import { Globe, Newspaper } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="logo">
      <div className="relative">
        <Globe className="w-8 h-8 text-primary" strokeWidth={1.5} />
        <Newspaper className="absolute bottom-0 right-0 w-4 h-4 text-primary-foreground bg-primary rounded-full p-0.5" strokeWidth={2} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-none text-foreground">
          The USA Mirror
        </span>
        <span className="text-xs text-muted-foreground leading-none mt-0.5">
          Global Business Directory
        </span>
      </div>
    </div>
  );
}
