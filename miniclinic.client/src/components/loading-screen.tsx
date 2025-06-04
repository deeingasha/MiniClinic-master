import { HeartPulse } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <HeartPulse size={48} className="text-primary animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-destructive animate-ping" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold text-foreground">Loading</h2>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 flex items-center gap-2">
        <div className="h-1 w-24 bg-muted overflow-hidden rounded-full">
          <div className="h-full bg-primary animate-[progress_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;