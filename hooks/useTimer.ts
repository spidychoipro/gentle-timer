import { useState, useEffect, useRef } from 'react';

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
  initialSeconds: number;
}

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    hours: 0,
    minutes: 5,
    seconds: 0,
    isRunning: false,
    totalSeconds: 300,
    initialSeconds: 300,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.isRunning && state.totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newTotal = prev.totalSeconds - 1;
          if (newTotal <= 0) {
            setIsCompleted(true);
            return {
              ...prev,
              totalSeconds: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
              isRunning: false,
            };
          }
          const hours = Math.floor(newTotal / 3600);
          const minutes = Math.floor((newTotal % 3600) / 60);
          const seconds = newTotal % 60;
          return {
            ...prev,
            totalSeconds: newTotal,
            hours,
            minutes,
            seconds,
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.totalSeconds]);

  const setHours = (hours: number) => {
    const newTotal = hours * 3600 + state.minutes * 60 + state.seconds;
    setState((prev) => ({
      ...prev,
      hours,
      totalSeconds: newTotal,
      initialSeconds: newTotal,
    }));
  };

  const setMinutes = (minutes: number) => {
    const newTotal = state.hours * 3600 + minutes * 60 + state.seconds;
    setState((prev) => ({
      ...prev,
      minutes,
      totalSeconds: newTotal,
      initialSeconds: newTotal,
    }));
  };

  const setSeconds = (seconds: number) => {
    const newTotal = state.hours * 3600 + state.minutes * 60 + seconds;
    setState((prev) => ({
      ...prev,
      seconds,
      totalSeconds: newTotal,
      initialSeconds: newTotal,
    }));
  };

  const start = () => {
    if (state.totalSeconds > 0) {
      setIsCompleted(false);
      setState((prev) => ({ ...prev, isRunning: true }));
    }
  };

  const pause = () => {
    setState((prev) => ({ ...prev, isRunning: false }));
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsCompleted(false);
    setState((prev) => ({
      ...prev,
      isRunning: false,
      totalSeconds: prev.initialSeconds,
      hours: Math.floor(prev.initialSeconds / 3600),
      minutes: Math.floor((prev.initialSeconds % 3600) / 60),
      seconds: prev.initialSeconds % 60,
    }));
  };

  const clearCompletion = () => {
    setIsCompleted(false);
  };

  const progress = state.initialSeconds > 0 
    ? (state.initialSeconds - state.totalSeconds) / state.initialSeconds 
    : 0;

  return {
    ...state,
    isCompleted,
    progress,
    setHours,
    setMinutes,
    setSeconds,
    start,
    pause,
    reset,
    clearCompletion,
  };
};
