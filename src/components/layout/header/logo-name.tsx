import { Logo } from '@/components/logo';
import { FC } from 'react';

const LogoName: FC = () => {
  return (
    <div className='pointer-events-none flex items-center gap-2.5 select-none'>
      <Logo />
      <span className='text-xl font-black text-neutral-50'>MUSIC BOX</span>
    </div>
  );
};

export { LogoName };
