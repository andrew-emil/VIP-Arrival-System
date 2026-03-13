import { Loader2 } from "lucide-react";

const LoadingIndicator = () => {
    return (
        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full flex items-center justify-center">
            <Loader2 className="animate-spin" />
        </div>
    )
}

export default LoadingIndicator