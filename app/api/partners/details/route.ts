import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Partner from '@/models/Partner';
import User from '@/models/User';
import Goal from '@/models/Goal';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find partnership by token
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

    // Get inviter details
    const inviter = await User.findById(partnership.procrastinatorId);
    if (!inviter) {
      return NextResponse.json(
        { error: 'Inviter not found' },
        { status: 404 }
      );
    }

    // Get inviter's goal
    const goal = await Goal.findOne({
      userId: partnership.procrastinatorId,
      active: true,
    }).sort({ createdAt: -1 });

    // Check if partner email is registered
    const partnerEmail = partnership.partnerEmail || '';
    const existingPartner = await User.findOne({
      email: partnerEmail.toLowerCase(),
    });

    return NextResponse.json({
      inviterName: inviter.name,
      inviterGoal: goal?.goalText || 'their goals',
      partnerEmail,
      isRegistered: !!existingPartner,
    });
  } catch (error) {
    console.error('Partnership details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}