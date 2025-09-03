'use client';

import { PlayerBar } from '@/components/player-track-bar/player-bar';

export default function Home() {
  return (
    <div className='relative flex h-full w-full flex-col gap-6 px-15'>
      <PlayerBar />
      <div>other content</div>
    </div>
  );
}
