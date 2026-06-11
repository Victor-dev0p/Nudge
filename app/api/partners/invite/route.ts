import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import { sendPartnerInviteEmail } from '@/lib/email';
import Partner from '@/models/Partner';
import User from '@/models/User';
import Goal from '@/models/Goal';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get inviter's info
    const inviter = await User.findById(session.user.id);
    if (!inviter) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get inviter's current goal
    const currentGoal = await Goal.findOne({
      userId: session.user.id,
      active: true,
    }).sort({ createdAt: -1 });

    const goalText = currentGoal?.goalText || 'their goals';

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Check if partner user exists
    const partnerUser = await User.findOne({ email: email.toLowerCase() });

    if (partnerUser) {
      // User exists - check if partnership already exists
      const existingPartnership = await Partner.findOne({
        $or: [
          { userId: session.user.id, partnerId: partnerUser._id },
          { userId: partnerUser._id, partnerId: session.user.id },
        ],
      });

      if (existingPartnership) {
        return NextResponse.json(
          { error: 'Partnership already exists' },
          { status: 409 }
        );
      }

      // Create pending partnership
      await Partner.create({
        procrastinatorId: session.user.id,
        partnerId: partnerUser._id,
        type: 'one-way',
        status: 'pending',
        inviteToken,
      });
    } else {
      // User doesn't exist - create pending partnership with email
      await Partner.create({
        procrastinatorId: session.user.id,
        partnerId: null, // Will be filled when they signup
        partnerEmail: email.toLowerCase(),
        type: 'one-way',
        status: 'pending',
        inviteToken,
      });
    }

    // Send email
    const emailResult = await sendPartnerInviteEmail({
      inviterName: inviter.name,
      inviterGoal: goalText,
      inviteToken,
      partnerEmail: email,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Invitation sent successfully!',
      email,
      pending: !partnerUser,
    });
  } catch (error: any) {
    console.error('Partner invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}