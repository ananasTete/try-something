import { useEffect, useRef } from 'react';

// 实现信息的自动清除和 hover 时不清除

interface UseTimerProps {
  id: number;
  duration?: number;
  remove: (id: number) => void;
}

function useTimer(props: UseTimerProps) {
  const { id, duration = 2000, remove } = props;

  const timer = useRef<number | null>(null);

  const removeTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const startTimer = () => {
    timer.current = window.setTimeout(() => {
      remove(id);
      removeTimer();
    }, duration);
  };

  useEffect(() => {
    startTimer();
    return () => removeTimer();
  }, []);

  const onMouseEnter = () => {
    removeTimer();
  };

  const onMouseLeave = () => {
    startTimer();
  };

  return {
    onMouseEnter,
    onMouseLeave,
  };
}

export default useTimer;
