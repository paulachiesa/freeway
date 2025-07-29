import { useEffect, useRef } from "react";

export function useInactivityTimer(onTimeout: () => void, delay = 60000) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reinicia el timer
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onTimeout, delay);
  };

  useEffect(() => {
    // Eventos que reinician el contador
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Iniciar el contador al montar
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [delay, onTimeout]);
}
