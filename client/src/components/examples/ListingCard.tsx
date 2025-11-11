import { Router } from "wouter";
import ListingCard from "../ListingCard";

export default function ListingCardExample() {
  return (
    <Router>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <ListingCard
          id="1"
          title="Daily Prothom Alo"
          category="News"
          location="Dhaka"
          description="Leading Bengali daily newspaper providing comprehensive news coverage across Bangladesh and the world."
          featured
        />
        <ListingCard
          id="2"
          title="Bangladesh Bank"
          category="Banks"
          location="Dhaka"
          description="Central bank of Bangladesh responsible for monetary policy and banking regulation."
        />
        <ListingCard
          id="3"
          title="Dhaka University"
          category="Education"
          location="Dhaka"
          description="Premier public university in Bangladesh offering undergraduate and graduate programs."
        />
      </div>
    </Router>
  );
}
