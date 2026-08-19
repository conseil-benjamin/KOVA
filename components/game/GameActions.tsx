import React from 'react';
import { BookOpen, LogIn, LogOut, Play, Settings, XCircle, type LucideIcon } from 'lucide-react';
import { Player } from '@/types/Room';

type Tone = 'primary' | 'neutral' | 'danger' | 'dangerSoft';

interface GameActionsProps {
    /** `bar` : rangée compacte du header (desktop).
     *  `stack` : colonne pleine largeur (menu mobile, écran d'attente). */
    variant: 'bar' | 'stack';
    currentUser?: string;
    creator?: string;
    players?: Player[];
    isGameRunning?: boolean;
    /** Le compte à rebours de lancement tourne : on propose d'annuler, pas de lancer. */
    isStartingSoon?: boolean;
    /** Omis = pas de bouton « Règles » (cas du compte à rebours, où seule l'annulation compte). */
    onRules?: () => void;
    onEdit?: () => void;
    onStart?: () => void;
    onCancelStart?: () => void;
    onJoin?: () => void;
    onLeave?: () => void;
    /** Exécuté après chaque action : sert à refermer le menu mobile. */
    onAfterAction?: () => void;
}

const TONE: Record<Tone, string> = {
    primary:
        'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.55)]',
    neutral:
        'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white',
    danger:
        'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:from-red-500 hover:to-rose-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.55)]',
    dangerSoft:
        'bg-red-500/10 text-red-300 border border-red-500/25 hover:bg-red-500/20 hover:text-red-200',
};

const SHAPE = {
    // Hauteur unique par variante : c'est ce qui manquait le plus aux anciens boutons.
    bar: 'h-9 gap-1.5 rounded-full px-3 lg:px-4 text-xs lg:text-sm',
    stack: 'h-12 w-full gap-2 rounded-2xl px-4 text-sm',
};

type Item = {
    key: string;
    tone: Tone;
    icon: LucideIcon;
    /** Libellé court (barre du header) / explicite (colonne mobile). */
    short: string;
    long: string;
    onClick: () => void;
};

const GameActions: React.FC<GameActionsProps> = ({
    variant, currentUser, creator, players, isGameRunning, isStartingSoon,
    onRules, onEdit, onStart, onCancelStart, onJoin, onLeave, onAfterAction,
}) => {
    const me = currentUser?.toLowerCase().trim();
    const isCreator = !!creator && !!me && creator.toLowerCase().trim() === me;
    const userInGame = !!players?.some((player) => player.username.toLowerCase() === me);

    // Ordre « colonne » : l'action la plus attendue en premier.
    const items: Item[] = [];

    if (onJoin && !userInGame) {
        items.push({ key: 'join', tone: 'primary', icon: LogIn, short: 'Rejoindre', long: 'Rejoindre la partie', onClick: onJoin });
    }

    if (isCreator && !isGameRunning) {
        if (isStartingSoon && onCancelStart) {
            items.push({ key: 'cancel', tone: 'danger', icon: XCircle, short: 'Annuler', long: 'Annuler le lancement', onClick: onCancelStart });
        } else if (onStart && !isStartingSoon && (players?.length ?? 0) > 0) {
            items.push({ key: 'start', tone: 'primary', icon: Play, short: 'Lancer', long: 'Lancer la partie', onClick: onStart });
        }
        if (onEdit) {
            items.push({ key: 'edit', tone: 'neutral', icon: Settings, short: 'Modifier', long: 'Configurer la partie', onClick: onEdit });
        }
    }

    if (onRules) {
        items.push({ key: 'rules', tone: 'neutral', icon: BookOpen, short: 'Règles', long: 'Règles du jeu', onClick: onRules });
    }

    if (onLeave && userInGame) {
        items.push({ key: 'leave', tone: 'dangerSoft', icon: LogOut, short: 'Quitter', long: 'Quitter la partie', onClick: onLeave });
    }

    if (items.length === 0) return null;

    // Dans le header, l'action principale se lit à droite, près de l'avatar :
    // le secondaire (Quitter, Règles) part à gauche.
    const ordered = variant === 'bar' ? [...items].reverse() : items;

    return (
        <div className={variant === 'bar' ? 'flex items-center gap-2' : 'flex w-full flex-col gap-2.5'}>
            {ordered.map(({ key, tone, icon: Icon, short, long, onClick }) => (
                <button
                    key={key}
                    type="button"
                    aria-label={long}
                    title={variant === 'bar' ? short : undefined}
                    onClick={() => { onClick(); onAfterAction?.(); }}
                    className={`inline-flex shrink-0 items-center justify-center font-semibold tracking-wide whitespace-nowrap cursor-pointer transition-all duration-200 ease-out active:scale-95 ${SHAPE[variant]} ${TONE[tone]}`}
                >
                    <Icon className={`shrink-0 ${variant === 'bar' ? 'w-4 h-4' : 'w-5 h-5'} ${key === 'start' ? 'fill-current' : ''}`} />
                    <span className={variant === 'bar' && tone === 'neutral' ? 'max-lg:hidden' : ''}>
                        {variant === 'bar' ? short : long}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default GameActions;
