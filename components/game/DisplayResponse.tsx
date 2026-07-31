import React from "react";

interface DisplayResponseProps {
    response: string;
    question: string;
    story: string;
    firstResponsePlayer: string;
}

const DisplayResponse: React.FC<DisplayResponseProps>  = ({ response, question, story, firstResponsePlayer }: { response: string, question: string, story: string, firstResponsePlayer: string }) => {

        return (
            <div className="flex flex-col items-center justify-center relative z-10">

                <div className="relative overflow-hidden rounded-[18px] border border-white/10
        bg-white/[0.03] px-12 py-10 text-center max-w-xl w-[92%]"
                     style={{animation: "fadeUp 0.5s 0.2s both"}}>
                    <p className="text-[32px] font-medium text-white leading-snug">
                        {response}
                    </p>
                    <div className="h-px bg-white/10 my-5 mx-auto w-0"
                         style={{animation: "expandLine 0.6s 0.5s forwards"}}/>
                    <p className="text-[13px] text-white leading-relaxed">
                        {story}
                    </p>

                    {firstResponsePlayer ? (
                        <p className="mt-15 text-[12px] text-white tracking-wide"
                           style={{animation: "fadeUp 0.4s 0.9s both"}}>
                            {firstResponsePlayer} a trouvé en premier
                        </p>
                    ) : (
                        <p className="mt-10 text-[12px] text-white tracking-wide"
                           style={{animation: "fadeUp 0.4s 0.9s both"}}>
                            Personne n'a trouvé la réponse
                        </p>
                    )}
                </div>
            </div>
        );
}

export default DisplayResponse;
