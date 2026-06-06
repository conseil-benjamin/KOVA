import React from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {redirect} from "next/navigation";

interface ModalAskForPseudoProps {
    guestNameInput: string;
    setGuestNameInput: (val: string) => void;
    handleGuestLogin: () => void;
}

const ModalAskForPseudo: React.FC<ModalAskForPseudoProps> = ({guestNameInput, setGuestNameInput, handleGuestLogin}) => {

    return(
        <AlertDialog open={true}>
            <AlertDialogContent className="bg-neutral-900 border border-white/10 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Choisir un pseudo</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="text-slate-400">
                    Veuillez choisir un pseudo pour vous identifier. Vous jouerez en mode invité.
                </AlertDialogDescription>

                <div className="py-4">
                    <input
                        type="text"
                        value={guestNameInput}
                        onChange={(e) => setGuestNameInput(e.target.value)}
                        placeholder="Votre pseudo..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white" onClick={() => redirect('/')}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleGuestLogin}
                        disabled={!guestNameInput.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                    >
                        Continuer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModalAskForPseudo;
