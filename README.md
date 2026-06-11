# StreakArcher - Accountability App

> **"Stop Planning. Start Hitting."**

An accountability app that won't let you slack. Set goals, build streaks, and stay on track with real people who actually care.

Built by procrastinators, for procrastinators.

---

## 🎯 The Problem

Traditional productivity apps don't work because there's no real consequence for skipping. You need something that:
- Gets in your face when you're slacking
- Involves real human accountability
- Makes procrastination uncomfortable

---

## 🏹 The Solution

StreakArcher uses the **archery metaphor** to gamify accountability:

| Stage | Archery Metaphor | App Feature |
|-------|------------------|-------------|
| 🏹 Drawing Bow | Finding your target | Setting 30-day goal |
| 🎯 Finding Balance | Steadying your aim | Answering clarifying questions |
| 💥 Releasing Arrow | Taking the shot | Completing daily tasks |
| 🔥 Streak | Multiple bullseyes | Consecutive days completed |
| 📱 Distractions | Wind, noise, movement | Things that break focus (visualized) |

---

## ✨ Core Features

### 1. Goal → Daily Actions Pipeline
- User sets ambitious 30-day goal
- AI breaks it down into daily micro-tasks
- Tasks tailored to user's strengths, schedule, and context
- Example: "Become a better coder" → 4 daily coding tasks

### 2. Streak System
- Complete all daily tasks = streak increases 🔥
- Miss a day = streak resets to 0
- Track current streak vs. best streak
- Gamification through visual fire emojis

### 3. Accountability Partnership
Three types of partnerships:
- **Pro → Acc.Partner**: One-way monitoring (partner watches pro)
- **Pro ↔ Pro**: Mutual monitoring (both watch each other)
- **Many-to-Many**: One pro with multiple partners, or one partner monitoring multiple pros

### 4. Disruption System (KILLER FEATURE)
When pros are slacking:
- In-app modal blocks UI until tasks are done
- Push notifications get progressively annoying
- Email sent to acc.partner after 6pm if <50% complete
- App literally won't let you do other things

### 5. Partner Marketplace
- Browse available acc.partners
- Filter by specialty (coding, fitness, business, etc.)
- Partner ratings and reviews from pros
- Post "looking for partner" requests
- Auto-matching algorithm (coming soon)

### 6. Community Feed
- Pros post what they're working on
- Connect with others with similar goals
- Request accountability partners publicly
- Social layer on top of 1-on-1 partnerships

---

## 👥 User Types

### Procrastinator (Pro)
- Has goals they want to achieve
- Needs external accountability
- Gets disrupted when slacking
- Can also be acc.partner for others (hybrid)

### Accountability Partner (Acc.Partner)
- Monitors pros' progress
- Gets notifications when they slack
- Can encourage or call out
- May have their own goals (optional)
- Can earn reputation through reviews

### Hybrid User
- Both a pro AND an acc.partner
- Has own goals while monitoring others
- Most engaged user type

---

## 🗄️ Database Schema

### Collections

#### Users
```typescript
{
  _id: ObjectId
  email: string
  password: string (hashed)
  name: string
  role: 'pro' | 'partner' | 'both'
  hasCompletedOnboarding: boolean
  partnerProfile?: {
    bio: string
    specialties: string[]  // ['coding', 'fitness', 'business']
    rating: number  // 1-5
    reviewCount: number
    availability: string
    timezone: string
  }
  createdAt: Date
  updatedAt: Date
}
```

#### Goals
```typescript
{
  _id: ObjectId
  userId: ObjectId  // ref: User
  goalText: string  // "Become a better coder"
  clarifyingAnswers: [
    { question: string, answer: string }
  ]
  dailyActions: string[]  // Generated tasks
  active: boolean
  targetDate: Date
  createdAt: Date
}
```

#### Partnerships
```typescript
{
  _id: ObjectId
  procrastinatorId: ObjectId  // ref: User (person being held accountable)
  partnerId: ObjectId  // ref: User (person holding them accountable)
  type: 'one-way' | 'mutual'  // Mutual = both monitor each other
  status: 'pending' | 'active' | 'declined' | 'inactive'
  inviteToken: string  // For email link
  invitedAt: Date
  acceptedAt: Date
  createdAt: Date
}
```

#### Tasks
```typescript
{
  _id: ObjectId
  userId: ObjectId  // ref: User
  goalId: ObjectId  // ref: Goal
  text: string
  completed: boolean
  completedAt: Date
  date: Date  // Which day this task is for
  createdAt: Date
}
```

#### Streaks
```typescript
{
  _id: ObjectId
  userId: ObjectId  // ref: User
  currentStreak: number
  longestStreak: number
  lastCompletedDate: Date
  updatedAt: Date
}
```

#### Reviews
```typescript
{
  _id: ObjectId
  fromProId: ObjectId  // ref: User (pro giving review)
  toPartnerId: ObjectId  // ref: User (acc.partner being reviewed)
  rating: number  // 1-5
  comment: string
  createdAt: Date
}
```

#### Posts (Community Feed)
```typescript
{
  _id: ObjectId
  userId: ObjectId  // ref: User
  content: string  // "Looking for coding accountability partner..."
  goalType: string  // 'coding' | 'fitness' | 'business' | etc
  responses: [
    {
      userId: ObjectId
      message: string
      createdAt: Date
    }
  ]
  createdAt: Date
}
```

---

## 🎨 Design System

### Visual Metaphor: Archery Journey

**Stage 1: Drawing Bow (Onboarding)**
- Chaotic distractions (phones, games, TV)
- Archer pulling bow with shaky aim
- Target faded in background
- Copy: "Draw your bow. Aim at your target. Ignore the noise."

**Stage 2: Finding Balance (Clarifying Questions)**
- Distractions fading away
- Archer steady, focused
- Target getting clearer
- Breath/wind settling (flowing lines)
- Copy: "Steady your breath. Focus your mind. Find your balance."

**Stage 3: Bullseye (Daily Tasks)**
- Arrow hits center of target
- Shockwave animation
- Fire emojis, stars exploding
- Victory glow
- Copy: "Bullseye. Now repeat. Every. Single. Day."

### Color Palette
- **Primary**: Indigo (600-700) - Focus, discipline
- **Secondary**: Purple (600-700) - Ambition, goals
- **Accent**: Orange/Red (500-600) - Fire, streaks
- **Success**: Green (500-600) - Completion
- **Warning**: Yellow (500) - Slacking alert
- **Background**: Slate (800-900) - Dark, immersive

### Typography
- **Headings**: Bold, large (3xl-5xl)
- **Body**: Clear, readable (base-lg)
- **UI**: Semibold buttons, labels

---

## 🛣️ User Flows

### Flow 1: Pro Signup → First Goal
```
1. Land on homepage
2. Click "Get Started" → /signup
3. Create account
4. Redirect to /onboarding
5. Set 30-day goal (archery stage 1)
6. Answer clarifying questions (archery stage 2)
7. Review daily actions (archery stage 3)
8. Redirect to /partner/select
9. Choose: Invite someone OR Find a match OR Skip
10. Redirect to /dashboard
```

### Flow 2: Acc.Partner Invite → Acceptance
```
1. Pro invites partner via email
2. Partner receives email with invite link + token
3. Click link → /partner/accept?token=xxx
4. If not registered:
   - Simple signup (email pre-filled)
   - No onboarding (optional later)
5. If registered:
   - Just login
6. Accept or decline partnership
7. Redirect to /partner/dashboard
8. See pro's progress, tasks, streak
```

### Flow 3: Mutual Partnership (Pro ↔ Pro)
```
1. Pro A has goal, completes onboarding
2. Pro B has goal, completes onboarding
3. Pro A invites Pro B as acc.partner
4. Pro B accepts
5. Pro B invites Pro A back
6. Pro A accepts
7. Both see each other on dashboards
8. Both get notifications if either slacks
```

### Flow 4: Partner Marketplace Search
```
1. Pro completes onboarding
2. On /partner/select, clicks "Find a Match"
3. Browse acc.partners by:
   - Specialty (coding, fitness, etc.)
   - Rating (4+ stars)
   - Availability
4. Send partnership request
5. Acc.partner accepts/declines
6. If accepted → active partnership
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Geist Sans, Geist Mono

### Backend
- **Runtime**: Next.js API Routes (serverless)
- **Database**: MongoDB Atlas (cloud)
- **ORM**: Mongoose
- **Authentication**: NextAuth.js (JWT sessions)
- **Email**: Resend (transactional emails)

### Deployment
- **Hosting**: Vercel
- **Domain**: TBD
- **CI/CD**: Automatic via GitHub integration

### Future Additions
- **Push Notifications**: Firebase Cloud Messaging
- **SMS**: Twilio
- **Analytics**: Vercel Analytics
- **Error Tracking**: Sentry (optional)

---

## 📂 Project Structure

```
streakarcher/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   │
│   ├── onboarding/
│   │   └── page.tsx              # Goal input (Day 1)
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Daily tasks (Day 2)
│   │
│   ├── partner/
│   │   ├── select/
│   │   │   └── page.tsx          # Choose partner method
│   │   ├── accept/
│   │   │   └── page.tsx          # Accept invite (via email)
│   │   ├── browse/
│   │   │   └── page.tsx          # Partner marketplace
│   │   └── dashboard/
│   │       └── page.tsx          # Acc.partner dashboard
│   │
│   ├── feed/
│   │   └── page.tsx              # Community posts
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts      # NextAuth config
│   │   │   └── signup/
│   │   │       └── route.ts      # User registration
│   │   ├── goals/
│   │   │   ├── route.ts          # GET/POST goals
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/PUT/DELETE goal
│   │   ├── tasks/
│   │   │   ├── route.ts          # GET/POST tasks
│   │   │   └── [id]/
│   │   │       └── route.ts      # PUT/DELETE task
│   │   ├── streaks/
│   │   │   └── route.ts          # GET/UPDATE streak
│   │   ├── partners/
│   │   │   ├── invite/
│   │   │   │   └── route.ts      # Send partner invite
│   │   │   ├── accept/
│   │   │   │   └── route.ts      # Accept partnership
│   │   │   ├── browse/
│   │   │   │   └── route.ts      # List available partners
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/DELETE partnership
│   │   ├── reviews/
│   │   │   └── route.ts          # POST review for partner
│   │   ├── posts/
│   │   │   └── route.ts          # Community feed CRUD
│   │   └── notifications/
│   │       └── route.ts          # Send notifications
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── icon.tsx                  # App icon (target SVG)
│   └── globals.css               # Tailwind + global styles
│
├── lib/
│   ├── db.ts                     # MongoDB connection
│   ├── email.ts                  # Email service (Resend)
│   └── notifications.ts          # Notification helpers
│
├── models/
│   ├── User.ts
│   ├── Goal.ts
│   ├── Task.ts
│   ├── Streak.ts
│   ├── Partnership.ts
│   ├── Review.ts
│   └── Post.ts
│
├── components/
│   ├── onboarding/
│   │   └── GoalInputForm.tsx
│   ├── dashboard/
│   │   ├── StreakCounter.tsx
│   │   ├── TaskList.tsx
│   │   └── ProgressStats.tsx
│   ├── partner/
│   │   ├── PartnerCard.tsx
│   │   ├── PartnerBrowser.tsx
│   │   └── InviteForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Card.tsx
│
├── types/
│   ├── next-auth.d.ts
│   └── index.ts
│
├── middleware.ts                 # Protected routes
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example env file
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md                     # This file
```

---

## 💰 Monetization (Freemium Model)

### Free Tier
- Set 1 goal at a time
- Connect with 1 acc.partner
- Basic streak tracking
- Standard disruption notifications
- Community feed access (view only)

### Pro Tier ($9/month or $79/year)
- Unlimited goals
- Multiple acc.partners
- Priority in partner matching
- Advanced analytics (streak history, completion rates)
- Custom disruption settings
- Post in community feed
- Early access to new features

### Partner Premium ($5/month)
- For acc.partners who monitor multiple pros
- Enhanced dashboard (see all pros at once)
- Custom notification preferences
- Priority support
- Badge showing "Premium Partner"

---

## ✅ Current Status

### ✅ Completed
- [x] Authentication system (NextAuth.js)
- [x] User signup/login with MongoDB
- [x] Onboarding flow (goal input)
- [x] Dashboard (daily tasks, streak counter)
- [x] MongoDB connection (Atlas)
- [x] Deployed to Vercel (live production)
- [x] App metadata and icon
- [x] Basic partner invitation UI

### 🚧 In Progress
- [ ] Email system (Resend integration)
- [ ] Partner acceptance flow
- [ ] Partner dashboard
- [ ] Disruption system

### 📋 Roadmap

#### Phase 1: Core Accountability (Current)
- [ ] Email invites with signup links
- [ ] Partner acceptance flow
- [ ] Partner dashboard showing pro's progress
- [ ] In-app disruption modal
- [ ] Email notifications when slacking

#### Phase 2: Community & Marketplace
- [ ] Partner marketplace (browse/search)
- [ ] Partner ratings and reviews
- [ ] Community feed (posts, responses)
- [ ] Auto-matching algorithm (beta)

#### Phase 3: Advanced Features
- [ ] Push notifications (browser + mobile)
- [ ] SMS notifications (Twilio)
- [ ] Analytics dashboard
- [ ] Habit insights and trends
- [ ] Weekly/monthly reports

#### Phase 4: Monetization
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Free vs. Pro tier enforcement
- [ ] Partner premium features

#### Phase 5: Mobile Apps
- [ ] React Native app (iOS/Android)
- [ ] Push notifications on mobile
- [ ] Offline mode
- [ ] App Store/Play Store launch

---

## 🔧 Environment Variables

Create `.env.local` in project root:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nudge?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # Or production URL
NEXTAUTH_SECRET=your-secret-key-here

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxx

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Or https://yourapp.vercel.app

# Node Environment
NODE_ENV=development  # Or production
```

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/streakarcher.git
cd streakarcher

# Install dependencies (using yarn)
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
yarn dev
```

Visit `http://localhost:3000`

### Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Can create account
- [ ] Can login
- [ ] Can't access dashboard without login
- [ ] Redirects work correctly

**Onboarding:**
- [ ] Can set goal
- [ ] Answers save correctly
- [ ] Daily actions generated
- [ ] Redirects to partner selection

**Dashboard:**
- [ ] Shows correct date
- [ ] Displays user's tasks
- [ ] Can check off tasks
- [ ] Streak updates correctly
- [ ] Progress ring animates

**Partner System:**
- [ ] Can invite partner via email
- [ ] Email arrives with correct link
- [ ] Partner can accept invite
- [ ] Partnership shows in database

---

## 🎨 Design Principles

1. **Cinematic, Not Corporate**
   - Dark, immersive UI
   - Animations tell a story
   - Archery metaphor throughout

2. **Accountability Over Motivation**
   - Don't sugarcoat procrastination
   - Real consequences (partner notification)
   - Honest, direct copy

3. **Disruption is a Feature**
   - Getting in your face is the point
   - No easy escape routes
   - Partner sees everything

4. **Scalable from Day 1**
   - Many-to-many partnerships
   - Role flexibility (pro/partner/both)
   - Modular notification system

---

## 🤝 Contributing

This is currently a solo project built for learning TypeScript and solving personal procrastination. Open to collaboration once core features are stable.

---

## 📝 License

MIT (or specify your license)

---

## 🙏 Acknowledgments

- Built as a solution to personal procrastination
- Inspired by AA sponsor system
- Archery metaphor for focus and precision
- Community feedback from early testers

---

## 📧 Contact

- **Developer**: [Your Name]
- **Email**: [Your Email]
- **Live App**: https://streakarcher.vercel.app (or your domain)

---

**Remember: Every archer started with shaky hands. You got this.** 🏹🔥