import mongoose from 'mongoose';

export interface IPartner {
  procrastinatorId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId | null;  // Null if partner hasn't signed up yet
  partnerEmail?: string;  // Store email if they haven't registered
  type: 'one-way' | 'mutual';
  status: 'pending' | 'active' | 'declined' | 'inactive';
  inviteToken: string;  // For email acceptance link
  invitedAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new mongoose.Schema<IPartner>(
  {
    procrastinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    partnerEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['one-way', 'mutual'],
      default: 'one-way',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'declined', 'inactive'],
      default: 'pending',
    },
    inviteToken: {
      type: String,
      required: true,
      unique: true,
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
PartnerSchema.index({ procrastinatorId: 1, partnerId: 1 });
PartnerSchema.index({ inviteToken: 1 });
PartnerSchema.index({ partnerEmail: 1 });

const Partner = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);

export default Partner;