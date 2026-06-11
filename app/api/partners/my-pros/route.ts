import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Partner from '@/models/Partner';
import User from '@/models/User';
import Goal from '@/models/Goal';
import Task from '@/models/Task';
import Streak from '@/models/Streak';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find all active partnerships where current user is the partner
    const partnerships = await Partner.find({
      partnerId: session.user.id,
      status: 'active',
    });

    if (partnerships.length === 0) {
      return NextResponse.json({ pros: [] });
    }

    // Get details for each procrastinator
    const prosData = await Promise.all(
      partnerships.map(async (partnership) => {
        const pro = await User.findById(partnership.procrastinatorId);
        if (!pro) return null;

        // Get their current goal
        const goal = await Goal.findOne({
          userId: partnership.procrastinatorId,
          active: true,
        }).sort({ createdAt: -1 });

        // Get their streak
        const streak = await Streak.findOne({
          userId: partnership.procrastinatorId,
        });

        // Get today's tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tasks = await Task.find({
          userId: partnership.procrastinatorId,
          date: { $gte: today },
        }).sort({ createdAt: 1 });

        const completedTasks = tasks.filter((t) => t.completed).length;
        const totalTasks = tasks.length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Check if they're slacking (after 6pm and <50% complete)
        const currentHour = new Date().getHours();
        const isSlacking = currentHour >= 18 && percentage < 50;

        return {
          id: pro._id.toString(),
          name: pro.name,
          email: pro.email,
          goal: goal?.goalText || 'No active goal',
          currentStreak: streak?.currentStreak || 0,
          longestStreak: streak?.longestStreak || 0,
          todayProgress: {
            completed: completedTasks,
            total: totalTasks,
            percentage,
          },
          tasks: tasks.map((task) => ({
            id: task._id.toString(),
            text: task.text,
            completed: task.completed,
            completedAt: task.completedAt?.toISOString(),
          })),
          isSlacking,
        };
      })
    );

    // Filter out null values
    const validPros = prosData.filter((pro) => pro !== null);

    return NextResponse.json({ pros: validPros });
  } catch (error) {
    console.error('My pros error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}