import React from "react";

interface CountDownProps {
    gameStartingSoonTimer: number;
    /** Annulation du lancement, affichée sur mobile uniquement : sur desktop
     *  le bouton est déjà dans le header. */
    action?: React.ReactNode;
}

const CountDown = ({ gameStartingSoonTimer, action }: CountDownProps) => {
    const TOTAL_TIMER = 15;

    return (
    <div className="absolute inset-0 flex items-center justify-center z-20 overflow-y-auto overscroll-contain px-5 py-6"
         style={{background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(4px)'}}>
        <div className="flex w-full max-w-xs flex-col items-center gap-5 text-center">
            <p style={{
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 500
            }}>
                Préparez-vous !
            </p>

            <div style={{position: 'relative', width: 120, height: 120}}>
                <svg viewBox="0 0 120 120" style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(-90deg)'
                }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)"
                            strokeWidth="6"/>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#7F77DD" strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="326.7"
                            strokeDashoffset={326.7 * (1 - gameStartingSoonTimer / TOTAL_TIMER)}
                            style={{transition: 'stroke-dashoffset 1s linear'}}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                                    <span style={{
                                        fontSize: 48,
                                        fontWeight: 700,
                                        color: '#fff',
                                        lineHeight: 1
                                    }}>{gameStartingSoonTimer}</span>
                </div>
            </div>

            {action && <div className="w-full md:hidden">{action}</div>}
        </div>
    </div>
    )

}

export default CountDown;
