"use client";

import React, { useState } from 'react';
import {
    Mail, Lock, User, ArrowRight, Zap, Ghost,
    Github, Chrome, Gamepad2, Eye, EyeOff, Check
} from 'lucide-react';

const AuthMockup = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
    const [showPassword, setShowPassword] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Avatar selector (pour l'inscription)
    const [selectedAvatar, setSelectedAvatar] = useState('blue');
    const avatars = [
        { id: 'blue', gradient: 'from-blue-400 to-blue-600' },
        { id: 'red', gradient: 'from-red-400 to-red-600' },
        { id: 'green', gradient: 'from-green-400 to-green-600' },
        { id: 'purple', gradient: 'from-purple-400 to-purple-600' },
        { id: 'orange', gradient: 'from-orange-400 to-orange-600' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">

            {/* --- FOND ANIMÉ (Background FX) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* --- MAIN CARD --- */}
            <div className="w-full max-w-4xl bg-[#13131f]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">

                {/* COLONNE GAUCHE (Visuel & Info) */}
                <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#1a1a24] to-[#0f0f18] p-8 flex-col justify-between relative overflow-hidden border-r border-white/5">

                    {/* Logo */}
                    <div className="flex items-center gap-2 z-10">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter text-white italic">
                            POPSAUCE <span className="text-xs not-italic font-mono text-purple-400">MAX</span>
                        </h1>
                    </div>

                    {/* Illustration Dynamique */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        {isLogin ? (
                            <>
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center animate-float">
                                        <Gamepad2 className="w-16 h-16 text-slate-300 opacity-50" />
                                    </div>
                                    {/* Particules flottantes */}
                                    <div className="absolute top-0 right-0 w-4 h-4 bg-purple-500 rounded-full blur-md animate-ping"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Bon retour !</h2>
                                    <p className="text-sm text-slate-400">Prêt à dominer le classement ? Tes adversaires t'attendent.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Preview de l'avatar choisi */}
                                <div className="relative group">
                                    <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${avatars.find(a => a.id === selectedAvatar).gradient} shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-4xl font-bold text-white ring-4 ring-[#13131f] transition-all duration-500`}>
                                        {formData.username ? formData.username[0].toUpperCase() : '?'}
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#13131f] px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-purple-400 shadow-lg">
                                        NIVEAU 1
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Rejoins l'arène</h2>
                                    <p className="text-sm text-slate-400">Crée ton profil, personnalise ton avatar et commence ton ascension.</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Left */}
                    <div className="z-10 text-[10px] text-slate-500 text-center">
                        © 2024 PopSauce Max. Tous droits réservés.
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>

                {/* COLONNE DROITE (Formulaire) */}
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
                        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 group mt-6">
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
            </div>

        </div>
    );
};

export default AuthMockup;