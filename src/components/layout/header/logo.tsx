import { Music2 } from 'lucide-react';
import { FC } from 'react';

const Logo: FC = () => {
  return (
    <div className='pointer-events-none flex items-center gap-2.5 select-none'>
      <div className='border-pink flex h-[36px] w-[36px] items-center justify-center border-1 bg-transparent'>
        <Music2 size={24} strokeWidth={1} className='text-neutral-50' />
      </div>
      <span className='text-xl font-black text-neutral-50'>MUSIC BOX</span>
    </div>
  );
};

export default Logo;
