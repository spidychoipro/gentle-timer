import { useState, useEffect, useRef } from 'react';

export interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

export const useStopwatch = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = now - startTimeRef.current;
        accumulatedTimeRef.current = newElapsed;
        setElapsedTime(newElapsed);
      }, 10); // Update every 10ms for smooth display
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    setLastLapTime(0);
    accumulatedTimeRef.current = 0;
  };

  const addLap = () => {
    if (isRunning && elapsedTime > 0) {
      const lapTime = elapsedTime - lastLapTime;
      const newLap: Lap = {
        id: laps.length + 1,
        time: elapsedTime,
        lapTime,
      };
      setLaps((prev) => [newLap, ...prev]);
      setLastLapTime(elapsedTime);
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    const mins = minutes.toString().padStart(2, '0');
    const secs = seconds.toString().padStart(2, '0');
    const msStr = milliseconds.toString().padStart(2, '0');
    
    return `${mins}:${secs}.${msStr}`;
  };

  return {
    elapsedTime,
    isRunning,
    laps,
    formatTime,
    start,
    pause,
    reset,
    addLap,
  };
};
