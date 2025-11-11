import { Router } from "wouter";
import DivisionTabs from "../DivisionTabs";

export default function DivisionTabsExample() {
  return (
    <Router>
      <div className="p-4">
        <DivisionTabs />
      </div>
    </Router>
  );
}
