import { cn } from '@lib/utils';
import { Music2 } from 'lucide-react';
import { FC } from 'react';

type Props = {
  size?: number;
  className?: string;
};

const Logo: FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        'border-pink flex h-9 w-9 items-center justify-center border-1 bg-transparent',
        className,
      )}
    >
      <Music2 size={24} strokeWidth={1} className='text-neutral-50' />
    </div>
  );
};

export { Logo };
