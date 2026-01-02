
import { useEffect } from 'react';

export function useCalendarFix() {
  useEffect(() => {
    // Fix para iOS quando o calendário re-renderiza
    const fixCalendar = () => {
      const days = document.querySelectorAll('.rdp-day');
      days.forEach((day) => {
        const button = day.querySelector('button');
        if (button) {
          button.style.width = '100%';
          button.style.height = '100%';
        }
      });
    };

    // Executa o fix imediatamente e após mutações
    fixCalendar();
    
    const observer = new MutationObserver(fixCalendar);
    const calendar = document.querySelector('[data-slot="calendar"]');
    
    if (calendar) {
      observer.observe(calendar, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);
}