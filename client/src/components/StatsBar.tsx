import { Building2, Globe2, MapPin } from "lucide-react";

export default function StatsBar() {
  const stats = [
    { icon: Building2, label: "Total Listings", value: "2,500+" },
    { icon: Globe2, label: "Countries", value: "50+" },
    { icon: MapPin, label: "Cities", value: "200+" },
  ];

  return (
    <div className="bg-muted/50 py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-xl md:text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
