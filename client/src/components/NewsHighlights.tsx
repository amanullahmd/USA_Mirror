import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { TrendingUp, Clock } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  time: string;
  trending?: boolean;
  imageUrl?: string;
}

export default function NewsHighlights() {
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Global Economic Summit Concludes with Historic Trade Agreement",
      excerpt: "World leaders announce groundbreaking partnership that will reshape international commerce and strengthen economic ties across continents.",
      category: "Business",
      time: "2 hours ago",
      trending: true,
    },
    {
      id: "2",
      title: "Breakthrough in Renewable Energy Technology Announced",
      excerpt: "Scientists unveil revolutionary solar panel design that could triple energy efficiency and reduce costs by 60%.",
      category: "Technology",
      time: "5 hours ago",
      trending: true,
    },
    {
      id: "3",
      title: "International Education Initiative Launches in 50 Countries",
      excerpt: "New program aims to provide free online learning resources to students in developing nations, bridging the digital divide.",
      category: "Education",
      time: "8 hours ago",
    },
    {
      id: "4",
      title: "Major Healthcare Innovation Approved by Global Medical Board",
      excerpt: "Revolutionary treatment method receives international approval, offering hope to millions of patients worldwide.",
      category: "Healthcare",
      time: "1 day ago",
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-background border-y">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">World's Top News & Events</h2>
              <p className="text-sm text-muted-foreground">Stay updated with breaking stories from around the globe</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {newsItems.map((item, index) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <Card 
                className={`hover-elevate active-elevate-2 cursor-pointer h-full ${index === 0 ? 'lg:row-span-2' : ''}`}
                data-testid={`card-news-${item.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.trending && (
                      <Badge variant="default" className="gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <h3 className={`font-semibold mb-2 ${index === 0 ? 'text-xl' : 'text-base'}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/category/news">
            <span className="text-sm text-primary hover:underline font-medium cursor-pointer" data-testid="link-view-all-news">
              View all news stories →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
