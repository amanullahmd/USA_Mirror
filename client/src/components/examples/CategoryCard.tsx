import { Router } from "wouter";
import CategoryCard from "../CategoryCard";
import { Newspaper, Building2, GraduationCap, Landmark } from "lucide-react";

export default function CategoryCardExample() {
  return (
    <Router>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <CategoryCard title="News" count={125} href="/category/news" icon={Newspaper} />
        <CategoryCard title="Services" count={340} href="/category/services" icon={Building2} />
        <CategoryCard title="Education" count={89} href="/category/education" icon={GraduationCap} />
        <CategoryCard title="Banks" count={52} href="/category/banks" icon={Landmark} />
      </div>
    </Router>
  );
}
