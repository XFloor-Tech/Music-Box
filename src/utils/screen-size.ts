import { useEffect, useState } from 'react';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg';

const sizes = {
  xs: '(width >= 32rem)', // 512px
  sm: '(width >= 40rem)', // 640px
  md: '(width >= 48rem)', // 768px
  lg: '(width >= 64rem)', // 1024px
} as Record<ScreenSize, string>;

const useScreenSize = () => {
  const [size, setSize] = useState<ScreenSize>('md');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onResize = () => {
      let s: ScreenSize = 'xs';
      for (const [size, media] of Object.entries(sizes)) {
        if (window.matchMedia(media).matches) {
          s = size as ScreenSize;
          continue;
        }
        break;
      }
      setSize(s);
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
};

export { useScreenSize };
