import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface Region {
  name: string;
  slug: string;
}

interface Country {
  name: string;
  slug: string;
  flag: string;
  regions: Region[];
}

const countries: Country[] = [
  {
    name: "United States",
    slug: "usa",
    flag: "🇺🇸",
    regions: [
      { name: "New York", slug: "new-york" },
      { name: "California", slug: "california" },
      { name: "Texas", slug: "texas" },
      { name: "Florida", slug: "florida" },
      { name: "Illinois", slug: "illinois" },
      { name: "Washington", slug: "washington" },
    ],
  },
  {
    name: "United Kingdom",
    slug: "uk",
    flag: "🇬🇧",
    regions: [
      { name: "London", slug: "london" },
      { name: "Manchester", slug: "manchester" },
      { name: "Birmingham", slug: "birmingham" },
      { name: "Edinburgh", slug: "edinburgh" },
      { name: "Cardiff", slug: "cardiff" },
      { name: "Belfast", slug: "belfast" },
    ],
  },
  {
    name: "Canada",
    slug: "canada",
    flag: "🇨🇦",
    regions: [
      { name: "Ontario", slug: "ontario" },
      { name: "Quebec", slug: "quebec" },
      { name: "British Columbia", slug: "british-columbia" },
      { name: "Alberta", slug: "alberta" },
      { name: "Manitoba", slug: "manitoba" },
      { name: "Saskatchewan", slug: "saskatchewan" },
    ],
  },
  {
    name: "Australia",
    slug: "australia",
    flag: "🇦🇺",
    regions: [
      { name: "New South Wales", slug: "nsw" },
      { name: "Victoria", slug: "victoria" },
      { name: "Queensland", slug: "queensland" },
      { name: "Western Australia", slug: "wa" },
      { name: "South Australia", slug: "sa" },
      { name: "Tasmania", slug: "tasmania" },
    ],
  },
  {
    name: "India",
    slug: "india",
    flag: "🇮🇳",
    regions: [
      { name: "Delhi", slug: "delhi" },
      { name: "Mumbai", slug: "mumbai" },
      { name: "Bangalore", slug: "bangalore" },
      { name: "Hyderabad", slug: "hyderabad" },
      { name: "Chennai", slug: "chennai" },
      { name: "Kolkata", slug: "kolkata" },
    ],
  },
  {
    name: "Bangladesh",
    slug: "bangladesh",
    flag: "🇧🇩",
    regions: [
      { name: "Dhaka", slug: "dhaka" },
      { name: "Chittagong", slug: "chittagong" },
      { name: "Sylhet", slug: "sylhet" },
      { name: "Rajshahi", slug: "rajshahi" },
      { name: "Khulna", slug: "khulna" },
      { name: "Barisal", slug: "barisal" },
    ],
  },
];

export default function CountryTabs() {
  const [activeTab, setActiveTab] = useState(countries[0].slug);

  return (
    <div className="w-full" data-testid="component-country-tabs">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
          {countries.map((country) => (
            <TabsTrigger
              key={country.slug}
              value={country.slug}
              data-testid={`tab-${country.slug}`}
              className="gap-2"
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {countries.map((country) => (
          <TabsContent key={country.slug} value={country.slug} className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {country.regions.map((region) => (
                <Link key={region.slug} href={`/location/${country.slug}/${region.slug}`}>
                  <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-region-${region.slug}`}>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm text-center">{region.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
