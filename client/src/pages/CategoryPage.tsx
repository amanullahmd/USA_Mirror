import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import type { Category, Listing } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:category");
  const categorySlug = params?.category || "all";

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categorySlug}`],
  });

  const { data: listings = [], isLoading: listingsLoading } = useQuery<Listing[]>({
    queryKey: category ? [`/api/listings?categoryId=${category.id}`] : ["disabled-listings"],
    enabled: !!category,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {categoryLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : !category ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-muted/30 py-6 border-b">
              <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <nav className="text-sm text-muted-foreground mb-3">
                  <Link href="/" className="hover:text-foreground">Home</Link> / 
                  <span> Categories</span> / 
                  <span className="text-foreground"> {category.name}</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                    <p className="text-muted-foreground">
                      Showing {listings.length} listing{listings.length !== 1 ? 's' : ''}
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
                {listingsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading listings...</div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No listings found in this category yet.</p>
                    <Link href="/submit">
                      <Button>Submit First Listing</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        id={listing.id.toString()}
                        title={listing.title}
                        category={category.name}
                        location={`Listing ${listing.id}`}
                        description={listing.description}
                        featured={listing.featured}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
