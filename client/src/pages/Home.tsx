import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ListingCard from "@/components/ListingCard";
import CountryTabs from "@/components/CountryTabs";
import StatsBar from "@/components/StatsBar";
import NewsHighlights from "@/components/NewsHighlights";
import { Button } from "@/components/ui/button";
import { Newspaper, Building2, GraduationCap, Code, Plane, Clapperboard, Stethoscope, Home as HomeIcon } from "lucide-react";

export default function Home() {
  const categories = [
    { title: "News", count: 425, href: "/category/news", icon: Newspaper },
    { title: "Business", count: 840, href: "/category/business", icon: Building2 },
    { title: "Education", count: 289, href: "/category/education", icon: GraduationCap },
    { title: "Technology", count: 567, href: "/category/technology", icon: Code },
    { title: "Travel", count: 343, href: "/category/travel", icon: Plane },
    { title: "Entertainment", count: 278, href: "/category/entertainment", icon: Clapperboard },
    { title: "Healthcare", count: 198, href: "/category/healthcare", icon: Stethoscope },
    { title: "Real Estate", count: 395, href: "/category/real-estate", icon: HomeIcon },
  ];

  const featuredListings = [
    {
      id: "1",
      title: "The New York Times",
      category: "News",
      location: "New York, USA",
      description: "Leading international newspaper providing comprehensive news coverage and investigative journalism.",
      featured: true,
    },
    {
      id: "2",
      title: "Goldman Sachs",
      category: "Finance",
      location: "New York, USA",
      description: "Global investment banking, securities and investment management firm.",
    },
    {
      id: "3",
      title: "Harvard University",
      category: "Education",
      location: "Cambridge, USA",
      description: "Premier Ivy League research university offering undergraduate and graduate programs.",
    },
    {
      id: "4",
      title: "Google",
      category: "Technology",
      location: "Mountain View, USA",
      description: "Leading technology company specializing in internet services and products.",
      featured: true,
    },
    {
      id: "5",
      title: "BBC News",
      category: "News",
      location: "London, UK",
      description: "British public service broadcaster providing international news coverage.",
    },
    {
      id: "6",
      title: "Oxford University",
      category: "Education",
      location: "Oxford, UK",
      description: "World-renowned research university and the oldest university in the English-speaking world.",
    },
  ];

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.href} {...category} />
              ))}
            </div>
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
              <h2 className="text-2xl font-semibold">Featured Listings</h2>
              <Link href="/listings">
                <Button variant="outline" size="sm" data-testid="button-view-all">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
