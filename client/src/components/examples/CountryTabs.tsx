import { Router } from "wouter";
import CountryTabs from "../CountryTabs";

export default function CountryTabsExample() {
  return (
    <Router>
      <div className="p-4">
        <CountryTabs />
      </div>
    </Router>
  );
}
