import React from "react";

interface DisplayResponseProps {
    response: string;
    question: string;
    story: string;
}

const DisplayResponse: React.FC<DisplayResponseProps>  = ({ response, question, story }: { response: string, question: string, story: string }) => {

        return (
            <div className="flex-1 flex flex-col items-center justify-center relative z-10">

                <p className="text-[11px] tracking-[0.12em] uppercase text-white/30 mb-5"
                   style={{ animation: "fadeUp 0.4s 0.1s both" }}>
                    La réponse était
                </p>

                <div className="relative overflow-hidden rounded-[18px] border border-white/10
        bg-white/[0.03] px-12 py-10 text-center max-w-xl w-[92%]"
                     style={{ animation: "fadeUp 0.5s 0.2s both" }}>
                    <p className="text-[32px] font-medium text-white leading-snug">
                        {response}
                    </p>
                    <div className="h-px bg-white/10 my-5 mx-auto w-0"
                         style={{ animation: "expandLine 0.6s 0.5s forwards" }} />
                    <p className="text-[13px] text-white/30 leading-relaxed">
                        {story}
                    </p>
                </div>

                <p className="mt-7 text-[12px] text-white/20 tracking-wide"
                   style={{ animation: "fadeUp 0.4s 0.9s both" }}>
                    Prochaine question dans quelques secondes…
                </p>

            </div>
        );
}

export default DisplayResponse;
