import mongoose from 'mongoose';

export interface IGoal {
  userId: mongoose.Types.ObjectId;
  goalText: string;
  clarifyingAnswers: Array<{
    question: string;
    answer: string;
  }>;
  dailyActions: string[];
  active: boolean;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new mongoose.Schema<IGoal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goalText: {
      type: String,
      required: [true, 'Goal text is required'],
      trim: true,
    },
    clarifyingAnswers: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    dailyActions: [
      {
        type: String,
        required: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    targetDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
GoalSchema.index({ userId: 1, active: 1 });

const Goal = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;