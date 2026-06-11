import mongoose from 'mongoose';

export interface IStreak {
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
  updatedAt: Date;
  createdAt: Date;
}

const StreakSchema = new mongoose.Schema<IStreak>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
StreakSchema.index({ userId: 1 });

const Streak = mongoose.models.Streak || mongoose.model<IStreak>('Streak', StreakSchema);

export default Streak;