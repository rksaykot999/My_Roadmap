import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export function useProgress() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [bookmarkedDays, setBookmarkedDays] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Auth listener to switch between Firestore and LocalStorage
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Logged in: Use Firestore real-time listener
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.completedDays) setCompletedDays(data.completedDays);
            if (data.bookmarkedDays) setBookmarkedDays(data.bookmarkedDays);
          } else {
            setCompletedDays([]);
            setBookmarkedDays([]);
          }
          setIsLoaded(true);
        });
        return () => unsubscribeSnapshot();
      } else {
        // Not logged in: Use LocalStorage
        const loadLocal = () => {
          const storedCompleted = localStorage.getItem('roadmap_progress');
          const storedBookmarks = localStorage.getItem('roadmap_bookmarks');
          
          if (storedCompleted) {
            try { setCompletedDays(JSON.parse(storedCompleted)); } catch (e) {}
          } else setCompletedDays([]);
          
          if (storedBookmarks) {
            try { setBookmarkedDays(JSON.parse(storedBookmarks)); } catch (e) {}
          } else setBookmarkedDays([]);
          
          setIsLoaded(true);
        };
        
        loadLocal();

        // Listen for custom event to sync across components
        const handleLocalSync = () => loadLocal();
        window.addEventListener('roadmap_progress_changed', handleLocalSync);
        
        return () => window.removeEventListener('roadmap_progress_changed', handleLocalSync);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleDay = async (id: number) => {
    const user = auth.currentUser;
    let updated: number[] = [];
    
    setCompletedDays((prev) => {
      updated = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      return updated;
    });

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { completedDays: updated }, { merge: true });
    } else {
      localStorage.setItem('roadmap_progress', JSON.stringify(updated));
      window.dispatchEvent(new Event('roadmap_progress_changed'));
    }
  };

  const toggleBookmark = async (id: number) => {
    const user = auth.currentUser;
    let updated: number[] = [];
    
    setBookmarkedDays((prev) => {
      updated = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      return updated;
    });

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { bookmarkedDays: updated }, { merge: true });
    } else {
      localStorage.setItem('roadmap_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new Event('roadmap_progress_changed'));
    }
  };

  const getProgressPercentage = (totalDays: number) => {
    if (totalDays === 0) return 0;
    return Math.round((completedDays.length / totalDays) * 100);
  };

  return { completedDays, bookmarkedDays, toggleDay, toggleBookmark, getProgressPercentage, isLoaded };
}
