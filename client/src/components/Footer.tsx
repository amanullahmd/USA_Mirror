import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: "News", href: "/category/news" },
    { label: "Services", href: "/category/services" },
    { label: "Education", href: "/category/education" },
    { label: "Banks", href: "/category/banks" },
  ];

  const divisions = [
    { label: "Dhaka", href: "/location/dhaka" },
    { label: "Chittagong", href: "/location/chittagong" },
    { label: "Rajshahi", href: "/location/rajshahi" },
    { label: "Khulna", href: "/location/khulna" },
  ];

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground">
              Bangladesh's complete directory portal featuring comprehensive listings across all divisions and districts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-footer-${item.label.toLowerCase()}`}>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Divisions</h3>
            <ul className="space-y-2">
              {divisions.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-footer-div-${item.label.toLowerCase()}`}>
                      {item.label}
                    </a>
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
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-submit">
                    Submit Listing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-admin">
                    Admin Login
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="mb-6" />
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Bangladesh Directory Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
