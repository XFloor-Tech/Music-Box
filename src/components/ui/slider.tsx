'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';
import { ReactNode, useMemo } from 'react';

type Props = {
  thumbless?: boolean;
  children?: ReactNode;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbless = false,
  children,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & Props) {
  const _values = useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot='slider'
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'group relative flex h-4 w-full cursor-pointer touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot='slider-track'
        className={cn(
          'relative grow overflow-hidden rounded-full bg-neutral-600 data-[orientation=horizontal]:h-[4px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot='slider-range'
          className={cn(
            'absolute bg-neutral-50 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>

      {!thumbless &&
        Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot='slider-thumb'
            key={index}
            className='border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border opacity-0 shadow-sm transition-[color,box-shadow,opacity] group-hover:opacity-100 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50'
          />
        ))}

      {children}
    </SliderPrimitive.Root>
  );
}

export { Slider };
