import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Partner from '@/models/Partner';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find partnership
    const partnership = await Partner.findOne({
      inviteToken: token,
      status: 'pending',
    });

    if (!partnership) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Get current user
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify email matches if partnerEmail exists
    if (
      partnership.partnerEmail &&
      partnership.partnerEmail.toLowerCase() !== currentUser.email.toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'This invitation is for a different email address' },
        { status: 403 }
      );
    }

    // Update partnership
    partnership.partnerId = currentUser._id;
    partnership.status = 'active';
    partnership.acceptedAt = new Date();
    await partnership.save();

    // Update user role if they're not already a partner
    if (currentUser.role === 'pro') {
      currentUser.role = 'both';
      await currentUser.save();
    } else if (!currentUser.role || currentUser.role === 'partner') {
      currentUser.role = currentUser.role || 'partner';
      await currentUser.save();
    }

    return NextResponse.json({
      message: 'Partnership accepted successfully!',
      partnership: {
        id: partnership._id,
        procrastinatorId: partnership.procrastinatorId,
        status: partnership.status,
      },
    });
  } catch (error) {
    console.error('Partnership accept error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}