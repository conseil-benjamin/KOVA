import { LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation'
import { User } from '@/types/User';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Cookies from 'universal-cookie';
import { Room } from '@/types/Room';

interface NavbarProps {
    isLoggedIn: boolean;
    user: User | null;
    rooms: Room[];
    nbUsers: number;
}

export default function Navbar({ isLoggedIn, user, rooms, nbUsers }: NavbarProps) {
    const cookies = new Cookies();

    const logout = () => {
        cookies.remove('user');
        cookies.remove('userName');
        window.location.reload();
    }

    return (
        <nav className="fixed top-0 w-full h-[calc(4rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between gap-3 px-3 md:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0 shrink" onClick={() => redirect('/')}>
                <img
                    src="/logo.svg"
                    alt="Logo"
                    width={125}
                    height={125}
                    className="h-9 w-auto sm:h-10 md:h-11 lg:h-14"
                />
            </div>

            {/* Menu Droite */}
            <div className="flex items-center gap-4">
                {/* Stats globales (Desktop) */}
                <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400 mr-4 border-r border-white/10 pr-6">
                    <div className="flex items-center gap-1.5">
                        {/*<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        {/*<span className="text-white font-bold">1,240</span> en ligne*/}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-white font-bold">{rooms.length}</span> parties
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                        <span className="text-white font-bold">{nbUsers}</span> joueurs
                    </div>
                </div>

                {/* Auth Buttons */}
                {isLoggedIn ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 active:bg-white/10 p-1 rounded-full pr-1 md:pr-4 transition border border-transparent hover:border-white/10 shrink-0">
                                    {user?.imageUrl != '' ? (
                                        <img src={user?.imageUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 ring-2 ring-white/20"></div>
                                    )}
                                    <div className="hidden md:block text-right">
                                        <div className="text-xs font-bold text-white">{user?.username}</div>
                                        <div className="text-[10px] text-purple-400">Niveau {user?.stats?.level}</div>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-64 bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 rounded-xl p-0 overflow-hidden"
                                align="end"
                                sideOffset={10}
                            >
                                {/* En-tête profil */}
                                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/5">
                                    {user?.imageUrl != '' ? (
                                        <img src={user?.imageUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40 flex-shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 ring-2 ring-white/20 flex-shrink-0"></div>
                                    )}
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{user?.username}</div>
                                        <div className="text-xs text-purple-400">Niveau {user?.stats?.level}</div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-1.5 flex flex-col gap-0.5">
                                    <DropdownMenuItem
                                        onClick={() => redirect(`/profile/${user?.username}`)}
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        Mon profil
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-white/10 my-0.5" />

                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 cursor-pointer transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 flex-shrink-0" />
                                        Se déconnecter
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => redirect('/auth')} className="hidden md:block px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition">Connexion</button>
                        <button onClick={() => redirect('/auth?mode=register')} className="px-3 md:px-4 py-2.5 md:py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-purple-100 active:scale-95 transition flex items-center gap-2 whitespace-nowrap">
                            <LogIn className="w-4 h-4 shrink-0" />
                            <span>S&apos;inscrire</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
