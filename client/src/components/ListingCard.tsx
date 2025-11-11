import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  featured?: boolean;
}

export default function ListingCard({
  id,
  title,
  category,
  location,
  description,
  featured = false,
}: ListingCardProps) {
  return (
    <Card className={`hover-elevate active-elevate-2 transition-all ${featured ? "border-primary" : ""}`} data-testid={`card-listing-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-muted-foreground">{title.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
              {featured && <Badge variant="default" className="flex-shrink-0">Featured</Badge>}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Badge variant="secondary" className="text-xs">{category}</Badge>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/listing/${id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full gap-2" data-testid={`button-view-${id}`}>
            View Details
            <ExternalLink className="w-3 h-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
