import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function AdminStatsCards() {
  const stats = [
    {
      title: "Total Listings",
      value: "450",
      change: "+12 this week",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Pending Submissions",
      value: "12",
      change: "Awaiting review",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Approved This Week",
      value: "24",
      change: "+8 from last week",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Total Views",
      value: "12.5K",
      change: "+15% this month",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
