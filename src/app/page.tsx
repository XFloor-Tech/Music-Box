'use client';

import { PlayerTrackBar } from '@/components/player-track-bar/track-bar';

export default function Home() {
  return (
    <div className='relative flex h-full w-full flex-col gap-6 px-15'>
      <PlayerTrackBar />
      <div>other content</div>
    </div>
  );
}
