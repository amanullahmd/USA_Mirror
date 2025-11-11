import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ListingCard from "@/components/ListingCard";
import DivisionTabs from "@/components/DivisionTabs";
import StatsBar from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { Newspaper, Building2, GraduationCap, Landmark, Plane, Stethoscope, Code, Home as HomeIcon } from "lucide-react";

export default function Home() {
  const categories = [
    { title: "News", count: 125, href: "/category/news", icon: Newspaper },
    { title: "Services", count: 340, href: "/category/services", icon: Building2 },
    { title: "Education", count: 89, href: "/category/education", icon: GraduationCap },
    { title: "Banks", count: 52, href: "/category/banks", icon: Landmark },
    { title: "Technology", count: 67, href: "/category/technology", icon: Code },
    { title: "Travel", count: 43, href: "/category/travel", icon: Plane },
    { title: "Healthcare", count: 78, href: "/category/healthcare", icon: Stethoscope },
    { title: "Real Estate", count: 95, href: "/category/real-estate", icon: HomeIcon },
  ];

  const featuredListings = [
    {
      id: "1",
      title: "Daily Prothom Alo",
      category: "News",
      location: "Dhaka",
      description: "Leading Bengali daily newspaper providing comprehensive news coverage across Bangladesh and the world.",
      featured: true,
    },
    {
      id: "2",
      title: "Bangladesh Bank",
      category: "Banks",
      location: "Dhaka",
      description: "Central bank of Bangladesh responsible for monetary policy and banking regulation.",
    },
    {
      id: "3",
      title: "Dhaka University",
      category: "Education",
      location: "Dhaka",
      description: "Premier public university in Bangladesh offering undergraduate and graduate programs.",
    },
    {
      id: "4",
      title: "Square Pharmaceuticals",
      category: "Healthcare",
      location: "Dhaka",
      description: "Leading pharmaceutical company in Bangladesh manufacturing quality medicines.",
      featured: true,
    },
    {
      id: "5",
      title: "Biman Bangladesh Airlines",
      category: "Travel",
      location: "Dhaka",
      description: "National flag carrier airline of Bangladesh serving domestic and international routes.",
    },
    {
      id: "6",
      title: "BUET",
      category: "Education",
      location: "Dhaka",
      description: "Bangladesh University of Engineering and Technology - top engineering institution.",
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
                Bangladesh Directory Portal
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                Your complete guide to businesses, services, and organizations across all 8 divisions and 64 districts of Bangladesh
              </p>
              <Link href="/submit">
                <Button size="lg" data-testid="button-hero-submit">
                  Submit Your Business
                </Button>
              </Link>
            </div>
          </div>
        </section>

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
            <h2 className="text-2xl font-semibold mb-6">Browse by Location</h2>
            <DivisionTabs />
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
