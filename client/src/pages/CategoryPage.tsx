import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category || "all";

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");

  const listings = [
    {
      id: "1",
      title: "Daily Prothom Alo",
      category: "News",
      location: "Dhaka",
      description: "Leading Bengali daily newspaper providing comprehensive news coverage.",
      featured: true,
    },
    {
      id: "2",
      title: "The Daily Star",
      category: "News",
      location: "Dhaka",
      description: "English language daily newspaper covering national and international news.",
    },
    {
      id: "3",
      title: "Kaler Kantho",
      category: "News",
      location: "Dhaka",
      description: "Popular Bengali newspaper with extensive readership across Bangladesh.",
    },
    {
      id: "4",
      title: "Bangladesh Pratidin",
      category: "News",
      location: "Dhaka",
      description: "Daily newspaper focusing on national politics, business, and culture.",
    },
    {
      id: "5",
      title: "Jugantor",
      category: "News",
      location: "Dhaka",
      description: "Wide-circulation Bengali newspaper covering diverse topics.",
    },
    {
      id: "6",
      title: "Samakal",
      category: "News",
      location: "Dhaka",
      description: "Contemporary news source with balanced reporting.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-muted/30 py-6 border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <nav className="text-sm text-muted-foreground mb-3">
              <span>Home</span> / <span>Categories</span> / <span className="text-foreground">{categoryTitle}</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{categoryTitle}</h1>
                <p className="text-muted-foreground">
                  Showing {listings.length} listings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="recent">
                  <SelectTrigger className="w-40" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
            
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled data-testid="button-prev">
                Previous
              </Button>
              <Button variant="outline" size="sm" data-testid="button-page-1">
                1
              </Button>
              <Button variant="outline" size="sm" data-testid="button-page-2">
                2
              </Button>
              <Button variant="outline" size="sm" data-testid="button-page-3">
                3
              </Button>
              <Button variant="outline" size="sm" data-testid="button-next">
                Next
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
