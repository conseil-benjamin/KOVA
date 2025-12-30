"use client";

import React, { useState } from 'react';
import {
    Mail, Lock, User, ArrowRight, Zap, Eye, EyeOff, Check
} from 'lucide-react';

interface AuthFormProps {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
    formData: any;
    setFormData: (data: any) => void;
    selectedAvatar: string;
    setSelectedAvatar: (avatar: string) => void;
    avatars: { id: string, gradient: string }[];
    handleSubmit: () => void;
}

export default function AuthForm({
    isLogin, setIsLogin, formData, setFormData, selectedAvatar, setSelectedAvatar, avatars, handleSubmit
}: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-[#13131f]/50">

            {/* Toggle Mobile (Logo visible only on mobile) */}
            <div className="md:hidden flex items-center justify-center gap-2 mb-8">
                <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />
                <h1 className="text-2xl font-black italic text-white">POPSAUCE</h1>
            </div>

            {/* Header Form */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
                <div className="flex gap-2 text-sm">
                    <span className="text-slate-400">{isLogin ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}</span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition"
                    >
                        {isLogin ? "S'inscrire gratuitement" : 'Se connecter'}
                    </button>
                </div>
            </div>

            {/* Formulaire */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                {/* Username (Register Only) */}
                <div className={`space-y-1 transition-all duration-300 overflow-hidden ${isLogin ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                    <label className="text-xs font-bold text-slate-300 uppercase ml-1">Pseudo</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Ton nom de guerrier"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                {/* Avatar Selection (Register Only) */}
                <div className={`space-y-2 transition-all duration-300 overflow-hidden ${isLogin ? 'h-0 opacity-0' : 'h-24 opacity-100'}`}>
                    <label className="text-xs font-bold text-slate-300 uppercase ml-1">Choisis ta couleur</label>
                    <div className="flex gap-3">
                        {avatars.map((avatar) => (
                            <button
                                type="button"
                                key={avatar.id}
                                onClick={() => setSelectedAvatar(avatar.id)}
                                className={`w-10 h-10 rounded-full bg-gradient-to-tr ${avatar.gradient} relative transition-transform hover:scale-110 ${selectedAvatar === avatar.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#13131f] scale-110' : 'opacity-60 hover:opacity-100'}`}
                            >
                                {selectedAvatar === avatar.id && <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition" />
                        <input
                            type="email"
                            name="email"
                            placeholder="exemple@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-300 uppercase">Mot de passe</label>
                        {isLogin && <button className="text-xs text-slate-500 hover:text-slate-300">Oublié ?</button>}
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 group mt-6">
                    {isLogin ? 'Se connecter' : "C'est parti !"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>

            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#13131f] px-4 text-slate-500">Ou continuer avec</span></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition text-white font-medium text-sm">
                    <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Discord" className="w-5 h-5" />
                    Discord
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition text-white font-medium text-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Google
                </button>
            </div>

        </div>
    );
}
