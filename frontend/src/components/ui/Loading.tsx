import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading...", fullScreen = false }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center ${fullScreen ? "fixed inset-0 bg-white/80 z-50" : "p-4"
                }`}
        >
            <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-2" />
            <span className="text-gray-700 font-medium">{message}</span>
        </div>
    );
};

export default Loading;
