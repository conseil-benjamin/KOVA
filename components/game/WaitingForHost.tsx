const WaitingForHost = () => (
    <div className="absolute inset-0 flex items-center justify-center z-20" style={{ background: 'rgba(10,10,18,0.9)', backdropFilter: 'blur(4px)' }}>
        <div className="flex flex-col items-center gap-5 text-center" style={{ maxWidth: 320 }}>

            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', border: '1.5px solid rgba(93,202,165,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>

            <div>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>En attente du lancement</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Le maître de jeu n'a pas encore lancé la partie.</p>
            </div>

        </div>
    </div>
)

export default WaitingForHost;
