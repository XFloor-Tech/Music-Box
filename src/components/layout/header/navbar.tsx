import { FC } from 'react';
import Logo from './logo';
import { ProfileMini } from './profile-mini';

const HeaderNavbar: FC = () => {
  return (
    <nav className='sticky top-0 left-0 z-50 h-16 w-full self-start bg-neutral-900 px-16'>
      <div className='flex h-full items-center justify-between'>
        <Logo />
        <ProfileMini />
      </div>
    </nav>
  );
};

export { HeaderNavbar };
