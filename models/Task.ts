import mongoose from 'mongoose';

export interface ITask {
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  text: string;
  completed: boolean;
  completedAt?: Date;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
TaskSchema.index({ userId: 1, date: 1 });
TaskSchema.index({ userId: 1, completed: 1 });

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;