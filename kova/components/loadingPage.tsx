import { Loader2Icon } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-full bg-[#0a0a0f]">
            <Loader2Icon className="animate-spin size-10 text-white" />
        </div>
    );
}