import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: "News", href: "/category/news" },
    { label: "Business", href: "/category/business" },
    { label: "Education", href: "/category/education" },
    { label: "Technology", href: "/category/technology" },
  ];

  const countries = [
    { label: "United States", href: "/location/usa" },
    { label: "United Kingdom", href: "/location/uk" },
    { label: "Canada", href: "/location/canada" },
    { label: "Australia", href: "/location/australia" },
  ];

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground">
              The USA Mirror - Your global directory featuring listings across multiple countries and regions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid={`link-footer-${item.label.toLowerCase()}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Countries</h3>
            <ul className="space-y-2">
              {countries.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid={`link-footer-country-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/submit">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-submit">
                    Submit Listing
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-admin">
                    Admin Login
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="mb-6" />
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} The USA Mirror. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
