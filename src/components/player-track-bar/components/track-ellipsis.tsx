import { cn } from '@/lib/utils';
import { Heart, Ellipsis } from 'lucide-react';
import { FC } from 'react';
import { Button } from '../../ui/button';

type Props = {
  className?: string;
  classNameHeart?: string;
};

const TrackEllipsis: FC<Props> = ({ className, classNameHeart }) => {
  return (
    <div className={cn('flex items-center md:gap-1 lg:gap-2', className)}>
      <Button
        variant='ghost'
        size='icon'
        className={cn('group hidden sm:inline-flex', classNameHeart)}
      >
        <Heart
          size={16}
          className='text-neutral-50 group-hover:text-neutral-50/90'
        />
      </Button>
      <Button variant='ghost' size='icon' className='group'>
        <Ellipsis
          size={16}
          className='text-neutral-50 group-hover:text-neutral-50/90'
        />
      </Button>
    </div>
  );
};

export { TrackEllipsis };
