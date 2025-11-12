import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ListingCard from "@/components/ListingCard";
import CountryTabs from "@/components/CountryTabs";
import StatsBar from "@/components/StatsBar";
import NewsHighlights from "@/components/NewsHighlights";
import { Button } from "@/components/ui/button";
import { Newspaper, Building2, GraduationCap, Code, Plane, Clapperboard, Stethoscope, Home as HomeIcon, Briefcase, Heart } from "lucide-react";
import type { Category, Listing } from "@shared/schema";

const iconMap: Record<string, any> = {
  newspaper: Newspaper,
  building2: Building2,
  graduationcap: GraduationCap,
  code: Code,
  plane: Plane,
  clapperboard: Clapperboard,
  stethoscope: Stethoscope,
  home: HomeIcon,
  briefcase: Briefcase,
  heart: Heart,
};

export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: listings = [], isLoading: listingsLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <StatsBar />

        <section className="py-8 md:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                The USA Mirror
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                Your complete guide to businesses, services, and organizations across 50+ countries and 200+ cities worldwide
              </p>
              <Link href="/submit">
                <Button size="lg" data-testid="button-hero-submit">
                  Submit Your Business
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <NewsHighlights />

        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            {categoriesLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No categories found. Add categories in the admin panel.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.filter(c => !c.parentId).map((category) => {
                  const IconComponent = iconMap[category.icon.toLowerCase()] || Briefcase;
                  return (
                    <CategoryCard
                      key={category.slug}
                      title={category.name}
                      count={category.count}
                      href={`/category/${category.slug}`}
                      icon={IconComponent}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-8 md:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6">Browse by Country</h2>
            <CountryTabs />
          </div>
        </section>

        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Listings</h2>
              <Link href="/listings">
                <Button variant="outline" size="sm" data-testid="button-view-all">
                  View All
                </Button>
              </Link>
            </div>
            {listingsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No listings yet. <Link href="/submit" className="text-primary hover:underline">Submit the first listing</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.slice(0, 6).map((listing) => {
                  const category = categories.find(c => c.id === listing.categoryId);
                  return (
                    <ListingCard
                      key={listing.id}
                      id={listing.id.toString()}
                      title={listing.title}
                      category={category?.name || "Uncategorized"}
                      location={`Listing ${listing.id}`}
                      description={listing.description}
                      featured={listing.featured}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
