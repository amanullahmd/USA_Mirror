import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface District {
  name: string;
  slug: string;
}

interface Division {
  name: string;
  slug: string;
  districts: District[];
}

const divisions: Division[] = [
  {
    name: "Dhaka",
    slug: "dhaka",
    districts: [
      { name: "Dhaka", slug: "dhaka" },
      { name: "Gazipur", slug: "gazipur" },
      { name: "Narayanganj", slug: "narayanganj" },
      { name: "Tangail", slug: "tangail" },
      { name: "Manikganj", slug: "manikganj" },
      { name: "Munshiganj", slug: "munshiganj" },
    ],
  },
  {
    name: "Chittagong",
    slug: "chittagong",
    districts: [
      { name: "Chittagong", slug: "chittagong" },
      { name: "Cox's Bazar", slug: "coxs-bazar" },
      { name: "Comilla", slug: "comilla" },
      { name: "Rangamati", slug: "rangamati" },
      { name: "Bandarban", slug: "bandarban" },
      { name: "Khagrachhari", slug: "khagrachhari" },
    ],
  },
  {
    name: "Rajshahi",
    slug: "rajshahi",
    districts: [
      { name: "Rajshahi", slug: "rajshahi" },
      { name: "Bogra", slug: "bogra" },
      { name: "Pabna", slug: "pabna" },
      { name: "Natore", slug: "natore" },
      { name: "Sirajganj", slug: "sirajganj" },
      { name: "Naogaon", slug: "naogaon" },
    ],
  },
  {
    name: "Khulna",
    slug: "khulna",
    districts: [
      { name: "Khulna", slug: "khulna" },
      { name: "Jessore", slug: "jessore" },
      { name: "Satkhira", slug: "satkhira" },
      { name: "Bagerhat", slug: "bagerhat" },
      { name: "Kushtia", slug: "kushtia" },
      { name: "Chuadanga", slug: "chuadanga" },
    ],
  },
];

export default function DivisionTabs() {
  const [activeTab, setActiveTab] = useState(divisions[0].slug);

  return (
    <div className="w-full" data-testid="component-division-tabs">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
          {divisions.map((division) => (
            <TabsTrigger
              key={division.slug}
              value={division.slug}
              data-testid={`tab-${division.slug}`}
            >
              {division.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {divisions.map((division) => (
          <TabsContent key={division.slug} value={division.slug} className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {division.districts.map((district) => (
                <Link key={district.slug} href={`/location/${division.slug}/${district.slug}`}>
                  <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-district-${district.slug}`}>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm text-center">{district.name}</p>
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
