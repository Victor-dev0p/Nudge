// lib/tasks.ts

import type { MicroTask, GoalCategory } from "@/types/user";

/**
 * Generates 5 stub micro-tasks from a goal's text and category.
 * These are placeholders until the AI API is wired in.
 * Shaped exactly like real MicroTask objects so the dashboard
 * component never needs to know the difference.
 */

const STUB_TASKS: Record<GoalCategory, string[]> = {
  tech_execution: [
    "Define the scope and break the goal into 3 clear milestones",
    "Set up your project repo, folder structure, and initial commit",
    "Build and test the first working feature end to end",
    "Write a short progress log documenting what you shipped today",
    "Review what's left and update your task list for tomorrow",
  ],
  business_strategy: [
    "Write a one-page summary of the goal and the outcome you're targeting",
    "Identify the single biggest blocker and write a plan to remove it",
    "Complete one concrete action that moves the business forward today",
    "Reach out to one person who can give useful feedback or open a door",
    "Document today's progress and define tomorrow's first task",
  ],
  health_fitness: [
    "Complete today's planned workout or physical activity session",
    "Log your nutrition or hydration for the day honestly",
    "Track your key metric (weight, reps, distance, time)",
    "Do a 5-minute recovery or mobility session",
    "Write a short note on how your body felt today and what to adjust",
  ],
  mental_health_trauma: [
    "Complete today's scheduled self-care or therapeutic practice",
    "Journal for 10 minutes on how you're feeling without judgment",
    "Reach out to your support person or accountability partner",
    "Practice one grounding or coping technique from your plan",
    "Note one small win from today, no matter how minor it feels",
  ],
  addiction_recovery: [
    "Check in with your sponsor or accountability partner today",
    "Complete your daily recovery practice or meeting commitment",
    "Identify any triggers you encountered today and how you handled them",
    "Read or engage with one piece of recovery material",
    "Log your sober day count and write one sentence about staying committed",
  ],
  learning_skill: [
    "Complete today's scheduled study or practice session",
    "Work through one exercise, problem set, or hands-on task",
    "Take notes on the most important concept you learned today",
    "Test your understanding — explain what you learned without notes",
    "Plan what you will study in tomorrow's session",
  ],
  creative: [
    "Show up and create — produce something today, however rough",
    "Spend focused time on the most challenging part of your current piece",
    "Review yesterday's work with fresh eyes and make three improvements",
    "Share your work-in-progress with one trusted person for feedback",
    "Document your creative process and what you want to try tomorrow",
  ],
  financial: [
    "Review your numbers — income, expenses, or progress toward the goal",
    "Complete one concrete financial action toward the goal today",
    "Identify one unnecessary cost or inefficiency and address it",
    "Research or learn one thing that will improve your financial position",
    "Update your tracking sheet or budget and set tomorrow's target",
  ],
  relationship: [
    "Take one intentional action toward the relationship goal today",
    "Have an honest, present conversation with the relevant person",
    "Reflect on your own role and identify one thing you can do better",
    "Set a boundary, make a request, or show appreciation — whatever applies",
    "Write briefly on how the relationship is progressing and next steps",
  ],
  other: [
    "Define clearly what success looks like for this goal",
    "Take the single most important action toward the goal today",
    "Remove or reduce one obstacle blocking your progress",
    "Check in with your accountability partner on your progress",
    "Review today's progress and write tomorrow's first task",
  ],
};

export function generateStubTasks(
  uid: string,
  goalId: string,
  category: GoalCategory
): MicroTask[] {
  const texts = STUB_TASKS[category] ?? STUB_TASKS.other;
  const now = Date.now();

  return texts.map((text, i) => ({
    id: `${goalId}_task_${i + 1}`,
    text,
    status: "pending" as const,
    proofRequired: i === 2 || i === 4, // tasks 3 and 5 require proof
    proofType: i === 4 ? ("text_log" as const) : ("github_commit" as const),
    dueAt: now + 1000 * 60 * 60 * (8 + i * 2), // staggered due times
  }));
}