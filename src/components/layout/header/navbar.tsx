import { FC } from 'react';
import { ProfileMini } from './profile-mini';
import { LogoName } from './logo-name';

const HeaderNavbar: FC = () => {
  return (
    <nav className='sticky top-0 left-0 z-50 h-16 w-full self-start bg-neutral-900 px-16'>
      <div className='flex h-full items-center justify-between'>
        <LogoName />
        <ProfileMini />
      </div>
    </nav>
  );
};

export { HeaderNavbar };
