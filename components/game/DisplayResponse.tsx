import React from "react";

interface DisplayResponseProps {
    response: string;
    question: string;
    story: string;
    firstResponsePlayer: string;
}

const DisplayResponse: React.FC<DisplayResponseProps>  = ({ response, question, story, firstResponsePlayer }: { response: string, question: string, story: string, firstResponsePlayer: string }) => {

        return (
            <div className="flex flex-col items-center justify-center relative z-10 w-full px-3 py-4">

                <div className="relative overflow-hidden rounded-[18px] border border-white/10
        bg-white/[0.03] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 text-center max-w-xl w-full sm:w-[92%]"
                     >
                    <p className="text-2xl sm:text-3xl md:text-[32px] font-medium text-white leading-snug break-words">
                        {response}
                    </p>
                    <div className="h-px bg-white/10 my-4 md:my-5 mx-auto w-0"/>
                    <p className="text-[13px] text-white leading-relaxed">
                        {story}
                    </p>

                    {firstResponsePlayer ? (
                        <p className="mt-8 md:mt-15 text-[12px] text-white tracking-wide break-words">
                            {firstResponsePlayer} a trouvé en premier
                        </p>
                    ) : (
                        <p className="mt-6 md:mt-10 text-[12px] text-white tracking-wide">
                            Personne n'a trouvé la réponse
                        </p>
                    )}
                </div>
            </div>
        );
}

export default DisplayResponse;
