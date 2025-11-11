import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  count: number;
  href: string;
  icon: LucideIcon;
}

export default function CategoryCard({ title, count, href, icon: Icon }: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-category-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 truncate">{title}</h3>
              <p className="text-sm text-muted-foreground">{count} listings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
