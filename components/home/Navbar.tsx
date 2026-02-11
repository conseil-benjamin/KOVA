import { Zap, LogIn } from 'lucide-react';
import { redirect } from 'next/navigation'
import { User } from '@/types/User';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import Cookies from 'universal-cookie';

interface NavbarProps {
    isLoggedIn: boolean;
    user: User | null;
    rooms: Room[];
}

export default function Navbar({ isLoggedIn, user, rooms }: NavbarProps) {
    const cookies = new Cookies();

    const logout = () => {
        cookies.remove('email');
        cookies.remove('user');
        cookies.remove('userName');
        window.location.reload();
    }

    return (
        <nav className="fixed top-0 w-full h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1.5 md:p-2 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                    <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-purple-200 to-indigo-400 bg-clip-text text-transparent italic">
                    KOVA <span className="text-xs not-italic font-mono text-purple-400 bg-purple-400/10 px-1 rounded border border-purple-400/20"></span>
                </h1>
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
                </div>

                {/* Auth Buttons */}
                {isLoggedIn ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded-full pr-4 transition border border-transparent hover:border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 ring-2 ring-white/20"></div>
                                    <div className="hidden md:block text-right">
                                        <div className="text-xs font-bold text-white">{user?.username}</div>
                                        <div className="text-[10px] text-purple-400">Niveau {user?.stats?.level}</div>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={logout} style={{ cursor: 'pointer', }}>
                                        Mon profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} style={{ cursor: 'pointer' }}>
                                        Se deconnecter
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => redirect('/auth')} className="hidden md:block px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition">Connexion</button>
                        <button onClick={() => redirect('/auth')} className="px-4 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-purple-100 transition flex items-center gap-2">
                            <LogIn className="w-4 h-4" />
                            <span className="hidden md:inline">S'inscrire</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
