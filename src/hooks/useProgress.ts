import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { roadmapData as defaultRoadmapTemplate, RoadmapDay } from '@/data/roadmapData';

export interface Roadmap {
  id: string;
  title: string;
  days: RoadmapDay[];
  weekTitles?: Record<number, string>; // weekNum -> custom title
}

export function useProgress() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  const [bookmarkedDays, setBookmarkedDays] = useState<Record<string, number[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRoadmaps(data.roadmaps || []);
            setActiveRoadmapId(data.activeRoadmapId || null);
            setCompletedDays(data.completedDays || {});
            setBookmarkedDays(data.bookmarkedDays || {});
          } else {
            initializeDefaultRoadmap(userRef);
          }
          setIsLoaded(true);
        });
        return () => unsubscribeSnapshot();
      } else {
        const loadLocal = () => {
          const storedRoadmaps = localStorage.getItem('user_roadmaps');
          const storedActiveId = localStorage.getItem('active_roadmap_id');
          const storedCompleted = localStorage.getItem('roadmap_completed');
          const storedBookmarks = localStorage.getItem('roadmap_bookmarks');
          
          if (storedRoadmaps) {
            setRoadmaps(JSON.parse(storedRoadmaps));
            setActiveRoadmapId(storedActiveId || null);
            setCompletedDays(storedCompleted ? JSON.parse(storedCompleted) : {});
            setBookmarkedDays(storedBookmarks ? JSON.parse(storedBookmarks) : {});
          } else {
            initializeDefaultRoadmapLocal();
          }
          setIsLoaded(true);
        };
        
        loadLocal();

        const handleLocalSync = () => loadLocal();
        window.addEventListener('roadmap_data_changed', handleLocalSync);
        
        return () => window.removeEventListener('roadmap_data_changed', handleLocalSync);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const dispatchLocalEvent = () => window.dispatchEvent(new Event('roadmap_data_changed'));

  const initializeDefaultRoadmap = async (userRef: any) => {
    const defaultRoadmap: Roadmap = {
      id: 'default-full-stack',
      title: 'Full Stack Journey',
      days: defaultRoadmapTemplate
    };
    
    await setDoc(userRef, {
      roadmaps: [defaultRoadmap],
      activeRoadmapId: defaultRoadmap.id,
      completedDays: { [defaultRoadmap.id]: [] },
      bookmarkedDays: { [defaultRoadmap.id]: [] }
    }, { merge: true });
  };

  const initializeDefaultRoadmapLocal = () => {
    const defaultRoadmap: Roadmap = {
      id: 'default-full-stack',
      title: 'Full Stack Journey',
      days: defaultRoadmapTemplate
    };
    
    localStorage.setItem('user_roadmaps', JSON.stringify([defaultRoadmap]));
    localStorage.setItem('active_roadmap_id', defaultRoadmap.id);
    localStorage.setItem('roadmap_completed', JSON.stringify({ [defaultRoadmap.id]: [] }));
    localStorage.setItem('roadmap_bookmarks', JSON.stringify({ [defaultRoadmap.id]: [] }));
    
    setRoadmaps([defaultRoadmap]);
    setActiveRoadmapId(defaultRoadmap.id);
    setCompletedDays({ [defaultRoadmap.id]: [] });
    setBookmarkedDays({ [defaultRoadmap.id]: [] });
  };

  const saveToFirebaseOrLocal = async (updates: any) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updates, { merge: true });
    } else {
      if (updates.roadmaps) localStorage.setItem('user_roadmaps', JSON.stringify(updates.roadmaps));
      if (updates.activeRoadmapId) localStorage.setItem('active_roadmap_id', updates.activeRoadmapId);
      if (updates.completedDays) localStorage.setItem('roadmap_completed', JSON.stringify(updates.completedDays));
      if (updates.bookmarkedDays) localStorage.setItem('roadmap_bookmarks', JSON.stringify(updates.bookmarkedDays));
      dispatchLocalEvent();
    }
  };

  const createRoadmap = async (title: string) => {
    const newId = `custom-${Date.now()}`;
    const newRoadmap: Roadmap = {
      id: newId,
      title,
      days: []
    };
    
    const updatedRoadmaps = [...roadmaps, newRoadmap];
    setRoadmaps(updatedRoadmaps);
    setActiveRoadmapId(newId);
    
    await saveToFirebaseOrLocal({
      roadmaps: updatedRoadmaps,
      activeRoadmapId: newId
    });
  };

  const switchRoadmap = async (id: string) => {
    setActiveRoadmapId(id);
    await saveToFirebaseOrLocal({ activeRoadmapId: id });
  };

  const updateDay = async (roadmapId: string, dayId: number, data: Partial<RoadmapDay>) => {
    const updatedRoadmaps = roadmaps.map(rm => {
      if (rm.id === roadmapId) {
        return {
          ...rm,
          days: rm.days.map(d => d.id === dayId ? { ...d, ...data } : d)
        };
      }
      return rm;
    });
    
    setRoadmaps(updatedRoadmaps);
    await saveToFirebaseOrLocal({ roadmaps: updatedRoadmaps });
  };

  const addDay = async (roadmapId: string) => {
    const updatedRoadmaps = roadmaps.map(rm => {
      if (rm.id === roadmapId) {
        // Find highest existing ID or start at 1
        const maxId = rm.days.length > 0 ? Math.max(...rm.days.map(d => d.id)) : 0;
        const newDayId = maxId + 1;
        
        const newDay: RoadmapDay = {
          id: newDayId,
          day: `Day ${rm.days.length + 1}`,
          frontend: "",
          backend: "",
          aiTools: "",
          deliverable: ""
        };
        
        return {
          ...rm,
          days: [...rm.days, newDay]
        };
      }
      return rm;
    });
    
    setRoadmaps(updatedRoadmaps);
    await saveToFirebaseOrLocal({ roadmaps: updatedRoadmaps });
  };

  const deleteRoadmap = async (roadmapId: string) => {
    let updatedRoadmaps = roadmaps.filter(rm => rm.id !== roadmapId);
    let newActiveId = activeRoadmapId === roadmapId ? (updatedRoadmaps.length > 0 ? updatedRoadmaps[0].id : null) : activeRoadmapId;

    if (updatedRoadmaps.length === 0) {
      // Recreate default full stack roadmap as fallback
      const defaultRoadmap: Roadmap = {
        id: 'default-full-stack',
        title: 'Full Stack Journey',
        days: defaultRoadmapTemplate
      };
      updatedRoadmaps = [defaultRoadmap];
      newActiveId = defaultRoadmap.id;
    }

    setRoadmaps(updatedRoadmaps);
    setActiveRoadmapId(newActiveId);
    
    await saveToFirebaseOrLocal({ 
      roadmaps: updatedRoadmaps,
      activeRoadmapId: newActiveId
    });
  };

  const deleteWeek = async (roadmapId: string, dayIdsToDelete: number[]) => {
    const updatedRoadmaps = roadmaps.map(rm => {
      if (rm.id === roadmapId) {
        const remainingDays = rm.days.filter(d => !dayIdsToDelete.includes(d.id));
        const reindexedDays = remainingDays.map((d, i) => ({
          ...d,
          day: `Day ${i + 1}`
        }));
        return { ...rm, days: reindexedDays };
      }
      return rm;
    });
    
    setRoadmaps(updatedRoadmaps);
    await saveToFirebaseOrLocal({ roadmaps: updatedRoadmaps });
  };

  const updateWeekTitle = async (roadmapId: string, weekNum: number, title: string) => {
    const updatedRoadmaps = roadmaps.map(rm => {
      if (rm.id === roadmapId) {
        return {
          ...rm,
          weekTitles: { ...(rm.weekTitles || {}), [weekNum]: title }
        };
      }
      return rm;
    });
    setRoadmaps(updatedRoadmaps);
    await saveToFirebaseOrLocal({ roadmaps: updatedRoadmaps });
  };

  const toggleDay = async (roadmapId: string, dayId: number) => {
    const currentCompleted = completedDays[roadmapId] || [];
    const updated = currentCompleted.includes(dayId) 
      ? currentCompleted.filter(id => id !== dayId) 
      : [...currentCompleted, dayId];
      
    const newCompletedDays = { ...completedDays, [roadmapId]: updated };
    setCompletedDays(newCompletedDays);
    await saveToFirebaseOrLocal({ completedDays: newCompletedDays });
  };

  const toggleBookmark = async (roadmapId: string, dayId: number) => {
    const currentBookmarks = bookmarkedDays[roadmapId] || [];
    const updated = currentBookmarks.includes(dayId) 
      ? currentBookmarks.filter(id => id !== dayId) 
      : [...currentBookmarks, dayId];
      
    const newBookmarkedDays = { ...bookmarkedDays, [roadmapId]: updated };
    setBookmarkedDays(newBookmarkedDays);
    await saveToFirebaseOrLocal({ bookmarkedDays: newBookmarkedDays });
  };

  const activeRoadmap = roadmaps.find(rm => rm.id === activeRoadmapId) || null;
  const activeCompleted = activeRoadmapId ? (completedDays[activeRoadmapId] || []) : [];
  const activeBookmarked = activeRoadmapId ? (bookmarkedDays[activeRoadmapId] || []) : [];

  const getProgressPercentage = (roadmapId: string) => {
    const rm = roadmaps.find(r => r.id === roadmapId);
    if (!rm || rm.days.length === 0) return 0;
    const completed = completedDays[roadmapId]?.length || 0;
    return Math.round((completed / rm.days.length) * 100);
  };

  return { 
    roadmaps,
    activeRoadmap,
    activeRoadmapId,
    completedDays: activeCompleted, 
    bookmarkedDays: activeBookmarked, 
    allCompletedDays: completedDays,
    allBookmarkedDays: bookmarkedDays,
    createRoadmap,
    switchRoadmap,
    toggleDay, 
    toggleBookmark, 
    updateDay,
    updateWeekTitle,
    deleteWeek,
    deleteRoadmap,
    addDay,
    getProgressPercentage, 
    isLoaded 
  };
}
