import { useState, useEffect } from 'react';
import { shouldShowDisruption } from '@/lib/disruption';

interface UseDisruptionProps {
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  partnerName: string;
  enabled?: boolean;
}

export function useDisruption({
  completedTasks,
  totalTasks,
  currentStreak,
  partnerName,
  enabled = true,
}: UseDisruptionProps) {
  const [showModal, setShowModal] = useState(false);
  const [lastShownAt, setLastShownAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Check every minute if we should show disruption
    const checkInterval = setInterval(() => {
      const shouldShow = shouldShowDisruption(
        lastShownAt,
        completedTasks,
        totalTasks
      );

      if (shouldShow) {
        setShowModal(true);
        setLastShownAt(new Date());
      }
    }, 60000); // Check every minute

    // Initial check
    const shouldShow = shouldShowDisruption(
      lastShownAt,
      completedTasks,
      totalTasks
    );

    if (shouldShow) {
      setShowModal(true);
      setLastShownAt(new Date());
    }

    return () => clearInterval(checkInterval);
  }, [completedTasks, totalTasks, enabled, lastShownAt]);

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    closeModal,
    modalProps: {
      isOpen: showModal,
      completedTasks,
      totalTasks,
      currentStreak,
      partnerName,
      onClose: closeModal,
    },
  };
}