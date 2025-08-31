import { useEffect, useState } from 'react';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg';

const sizes = {
  xs: '(width >= 32rem)', // 512px
  sm: '(width >= 40rem)', // 640px
  md: '(width >= 48rem)', // 768px
  lg: '(width >= 64rem)', // 1024px
} as Record<ScreenSize, string>;

const getSize = () => {
  if (typeof window === 'undefined') return null;

  let s: ScreenSize = 'xs';
  for (const [size, media] of Object.entries(sizes)) {
    if (window.matchMedia(media).matches) {
      s = size as ScreenSize;
      continue;
    }
    break;
  }

  return s;
};

const useScreenSize = () => {
  const [size, setSize] = useState<ScreenSize | null>(null);

  useEffect(() => {
    const onResize = () => {
      setSize(getSize());
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
};

export { getSize, useScreenSize };
