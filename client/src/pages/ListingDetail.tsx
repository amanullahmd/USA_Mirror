import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

export default function ListingDetail() {
  const [, params] = useRoute("/listing/:id");
  const id = params?.id || "1";

  const listing = {
    id,
    title: "The New York Times",
    category: "News",
    country: "United States",
    city: "New York",
    description: "The New York Times is an American daily newspaper based in New York City with a worldwide readership. Founded in 1851, the Times has since won 132 Pulitzer Prizes, more than any other newspaper, and has long been regarded within the industry as a national newspaper of record. It is ranked 18th in the world by circulation and 3rd in the U.S. The paper is owned by The New York Times Company.",
    contactPerson: "Editorial Department",
    phone: "+1 212 556 1234",
    email: "news@nytimes.com",
    website: "https://www.nytimes.com",
    featured: true,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <nav className="text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
            <Link href="/">Home</Link> / <Link href={`/category/${listing.category.toLowerCase()}`}>{listing.category}</Link> / <span className="text-foreground">{listing.title}</span>
          </nav>

          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-muted-foreground">
                    {listing.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                    {listing.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{listing.category}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.city}, {listing.country}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Phone</p>
                        <p className="font-medium">{listing.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-medium">{listing.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:col-span-2">
                      <div className="p-2 bg-muted rounded-md">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Website</p>
                        <a
                          href={listing.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline truncate block"
                          data-testid="link-website"
                        >
                          {listing.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button asChild className="w-full gap-2" data-testid="button-visit-website">
                    <a href={listing.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
