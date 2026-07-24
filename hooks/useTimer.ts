import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
  initialSeconds: number;
}

const DEFAULT_DURATION = 0;
const MAX_DURATION = 23 * 60 * 60 + 59 * 60 + 59;

const getTimeParts = (totalSeconds: number) => ({
  hours: Math.floor(totalSeconds / 3600),
  minutes: Math.floor((totalSeconds % 3600) / 60),
  seconds: totalSeconds % 60,
});

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    ...getTimeParts(DEFAULT_DURATION),
    isRunning: false,
    totalSeconds: DEFAULT_DURATION,
    initialSeconds: DEFAULT_DURATION,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const tick = () => {
      if (deadlineRef.current === null) {
        return;
      }

      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000)
      );

      if (remaining === 0) {
        deadlineRef.current = null;
        setIsCompleted(true);
        setState((previous) => ({
          ...previous,
          ...getTimeParts(0),
          isRunning: false,
          totalSeconds: 0,
        }));
        return;
      }

      setState((previous) => {
        if (remaining === previous.totalSeconds) {
          return previous;
        }
        return {
          ...previous,
          ...getTimeParts(remaining),
          totalSeconds: remaining,
        };
      });
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const updateDurationPart = useCallback(
    (part: 'hours' | 'minutes' | 'seconds', value: number) => {
      setIsCompleted(false);
      setState((previous) => {
        if (previous.isRunning) {
          return previous;
        }

        const next = { ...previous, [part]: value };
        const totalSeconds =
          next.hours * 3600 + next.minutes * 60 + next.seconds;

        return {
          ...next,
          totalSeconds,
          initialSeconds: totalSeconds,
        };
      });
    },
    []
  );

  const setHours = useCallback(
    (hours: number) => updateDurationPart('hours', hours),
    [updateDurationPart]
  );
  const setMinutes = useCallback(
    (minutes: number) => updateDurationPart('minutes', minutes),
    [updateDurationPart]
  );
  const setSeconds = useCallback(
    (seconds: number) => updateDurationPart('seconds', seconds),
    [updateDurationPart]
  );

  const setDuration = useCallback((totalSeconds: number) => {
    const safeDuration = Math.max(0, Math.min(totalSeconds, MAX_DURATION));
    deadlineRef.current = null;
    setIsCompleted(false);
    setState({
      ...getTimeParts(safeDuration),
      isRunning: false,
      totalSeconds: safeDuration,
      initialSeconds: safeDuration,
    });
  }, []);

  const addTime = useCallback((secondsToAdd: number) => {
    setIsCompleted(false);
    setState((previous) => {
      const nextTotal = Math.min(
        MAX_DURATION,
        Math.max(0, previous.totalSeconds + secondsToAdd)
      );
      const added = nextTotal - previous.totalSeconds;

      if (previous.isRunning && deadlineRef.current !== null) {
        deadlineRef.current += added * 1000;
      }

      return {
        ...previous,
        ...getTimeParts(nextTotal),
        totalSeconds: nextTotal,
        initialSeconds: Math.min(
          MAX_DURATION,
          Math.max(nextTotal, previous.initialSeconds + added)
        ),
      };
    });
  }, []);

  const start = useCallback(() => {
    setIsCompleted(false);
    setState((previous) => {
      if (previous.totalSeconds <= 0 || previous.isRunning) {
        return previous;
      }

      deadlineRef.current = Date.now() + previous.totalSeconds * 1000;
      return { ...previous, isRunning: true };
    });
  }, []);

  const pause = useCallback(() => {
    const remaining =
      deadlineRef.current === null
        ? null
        : Math.max(
            0,
            Math.ceil((deadlineRef.current - Date.now()) / 1000)
          );
    deadlineRef.current = null;

    if (remaining === 0) {
      setIsCompleted(true);
    }

    setState((previous) => {
      if (!previous.isRunning) {
        return previous;
      }

      const nextRemaining = remaining ?? previous.totalSeconds;

      return {
        ...previous,
        ...getTimeParts(nextRemaining),
        isRunning: false,
        totalSeconds: nextRemaining,
      };
    });
  }, []);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setIsCompleted(false);
    setState((previous) => ({
      ...previous,
      ...getTimeParts(previous.initialSeconds),
      isRunning: false,
      totalSeconds: previous.initialSeconds,
    }));
  }, []);

  const clear = useCallback(() => {
    deadlineRef.current = null;
    setIsCompleted(false);
    setState({
      ...getTimeParts(0),
      isRunning: false,
      totalSeconds: 0,
      initialSeconds: 0,
    });
  }, []);

  const restart = useCallback(() => {
    setIsCompleted(false);
    setState((previous) => {
      if (previous.initialSeconds <= 0) {
        return previous;
      }

      deadlineRef.current = Date.now() + previous.initialSeconds * 1000;
      return {
        ...previous,
        ...getTimeParts(previous.initialSeconds),
        isRunning: true,
        totalSeconds: previous.initialSeconds,
      };
    });
  }, []);

  const clearCompletion = useCallback(() => setIsCompleted(false), []);

  const progress =
    state.initialSeconds > 0
      ? (state.initialSeconds - state.totalSeconds) / state.initialSeconds
      : 0;

  return {
    ...state,
    isCompleted,
    progress,
    setHours,
    setMinutes,
    setSeconds,
    setDuration,
    addTime,
    start,
    pause,
    reset,
    clear,
    restart,
    clearCompletion,
  };
};
