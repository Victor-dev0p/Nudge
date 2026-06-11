// Disruption timing rules
export const DISRUPTION_RULES = {
  // Morning: Gentle reminders
  morning: {
    startHour: 8,
    endHour: 12,
    intervalMinutes: 60, // Every hour
    intensity: 'gentle' as const,
  },
  // Afternoon: More frequent
  afternoon: {
    startHour: 12,
    endHour: 18,
    intervalMinutes: 45, // Every 45 min
    intensity: 'gentle' as const,
  },
  // Evening: Getting serious
  evening: {
    startHour: 18,
    endHour: 20,
    intervalMinutes: 30, // Every 30 min
    intensity: 'medium' as const,
  },
  // Night: URGENT
  night: {
    startHour: 20,
    endHour: 23,
    intervalMinutes: 15, // Every 15 min
    intensity: 'harsh' as const,
  },
};

export function shouldShowDisruption(
  lastShownAt: Date | null,
  completedTasks: number,
  totalTasks: number
): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Don't disrupt if they've completed everything
  if (percentage === 100) return false;

  // Don't disrupt too early or too late
  if (currentHour < 8 || currentHour >= 23) return false;

  // Get current time period
  let period;
  if (currentHour < 12) {
    period = DISRUPTION_RULES.morning;
  } else if (currentHour < 18) {
    period = DISRUPTION_RULES.afternoon;
  } else if (currentHour < 20) {
    period = DISRUPTION_RULES.evening;
  } else {
    period = DISRUPTION_RULES.night;
  }

  // If never shown before, show it
  if (!lastShownAt) return true;

  // Check if enough time has passed since last shown
  const minutesSinceLastShown = (now.getTime() - lastShownAt.getTime()) / (1000 * 60);
  
  return minutesSinceLastShown >= period.intervalMinutes;
}

export function getDisruptionIntensity(currentHour: number, percentage: number): 'gentle' | 'medium' | 'harsh' {
  if (currentHour >= 20 && percentage < 25) return 'harsh';
  if (currentHour >= 18 && percentage < 50) return 'medium';
  return 'gentle';
}