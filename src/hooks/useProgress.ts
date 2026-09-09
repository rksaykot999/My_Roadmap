import { useState, useEffect } from 'react';

export function useProgress() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const stored = localStorage.getItem('roadmap_progress');
    if (stored) {
      try {
        setCompletedDays(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress from local storage');
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleDay = (id: number) => {
    setCompletedDays((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((d) => d !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem('roadmap_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const getProgressPercentage = (totalDays: number) => {
    if (totalDays === 0) return 0;
    return Math.round((completedDays.length / totalDays) * 100);
  };

  return { completedDays, toggleDay, getProgressPercentage, isLoaded };
}
