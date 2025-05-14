import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {  type User } from 'firebase/auth';
import { signOutGoogle } from '../utils/googleAuth';
import { logout } from '../utils/emailAuth';

function UserMenu({ currentUser }: { currentUser: User |null}) {
  const handleSignOut = () => {


    if (currentUser?.providerData[0]?.providerId === 'google.com') {
      signOutGoogle(); 
    }else{
      logout();
    }
  };
   const handleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <Menu as="div" className="relative inline-block text-left mr-1">
      <MenuButton className="flex items-center focus:outline-none">
        <img
          src={currentUser?.photoURL || 'https://avatars.githubusercontent.com/u/50585782'}
          alt={`${currentUser?.displayName || 'User'}'s profile`}
          className="w-12 h-12 rounded-full "
        />
      </MenuButton>

      <MenuItems className="absolute left-0 mt-2 min-w-56 w-auto origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none z-50">
        <div className="px-4 py-3 border-b dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {currentUser?.displayName || 'Anonymous'}
          </p>
          <p className="text-sm text-gray-500">
            {currentUser?.email}
          </p>
        </div>
        {currentUser?<div className="py-1">
          <MenuItem>
            
              <button
                onClick={handleSignOut}
                className={`w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-500 text-red-600'
                }`}
              >
                Sign out
              </button>
            
          </MenuItem>
        </div>:<div className="py-1">
          <MenuItem>
            
              <button
                onClick={handleSignIn}
                className={`w-full text-left px-4 py-2 text-sm text-blue-700 dark:text-blue-500 text-blue-600'
                }`}
              >
                Sign in
              </button>
            
          </MenuItem>
        </div>}
      </MenuItems>
    </Menu>
  );
}

export default UserMenu;
