import { useEffect, useRef, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, visible, onHide }: ToastProps) {
  const [show, setShow] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      hideTimerRef.current = null;
      dismissTimerRef.current = null;
    };

    clearTimers();

    if (visible) {
      setShow(true);
      hideTimerRef.current = setTimeout(() => {
        setShow(false);
        dismissTimerRef.current = setTimeout(onHide, 300);
      }, 4000);
    } else {
      setShow(false);
    }

    return clearTimers;
  }, [visible, onHide]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!show}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-forest dark:bg-dark-forest text-white px-5 py-3 rounded-2xl shadow-lift text-sm font-body">
        {message}
      </div>
    </div>
  );
}
