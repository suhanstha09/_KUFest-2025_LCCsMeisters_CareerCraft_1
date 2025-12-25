'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, FileText, ChevronDown, Settings } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';

interface ProfileMenuProps {
  userName?: string;
  userEmail?: string;
}

export function ProfileMenu({ userName = 'John Doe', userEmail = 'john@example.com' }: ProfileMenuProps) {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // Clear tokens
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        // Redirect to login
        router.push('/login');
      },
      onError: () => {
        // Even on error, clear tokens and redirect
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        router.push('/login');
      },
    });
  };

  const handleCompleteOnboarding = () => {
    router.push('/onboarding');
  };

  const handleSettings = () => {
    router.push('/dashboard/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
              {userName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userEmail}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCompleteOnboarding} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Complete Onboarding</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
