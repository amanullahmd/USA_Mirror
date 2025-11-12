import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { Country, Region, City } from "@shared/schema";

export default function AdminLocations() {
  const { data: countries, isLoading: countriesLoading } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  const { data: regions, isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center gap-3 h-14 px-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-lg font-semibold">Locations</h1>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="countries" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="countries" data-testid="tab-countries">Countries</TabsTrigger>
                  <TabsTrigger value="regions" data-testid="tab-regions">Regions</TabsTrigger>
                  <TabsTrigger value="cities" data-testid="tab-cities">Cities</TabsTrigger>
                </TabsList>

                <TabsContent value="countries">
                  <Card>
                    <CardHeader>
                      <CardTitle>Countries</CardTitle>
                      <CardDescription>
                        All countries in the directory ({countries?.length || 0} total)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {countriesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : !countries || countries.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No countries found</p>
                      ) : (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Flag</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Slug</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {countries.map((country) => (
                                <TableRow key={country.id} data-testid={`row-country-${country.id}`}>
                                  <TableCell className="text-2xl">{country.flag}</TableCell>
                                  <TableCell className="font-medium">{country.name}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{country.code}</Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{country.slug}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="regions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Regions</CardTitle>
                      <CardDescription>
                        States, provinces, and territories ({regions?.length || 0} total)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {regionsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : !regions || regions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No regions found</p>
                      ) : (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Country ID</TableHead>
                                <TableHead>Slug</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {regions.map((region) => (
                                <TableRow key={region.id} data-testid={`row-region-${region.id}`}>
                                  <TableCell className="font-medium">{region.name}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">{region.type || 'region'}</Badge>
                                  </TableCell>
                                  <TableCell>{region.countryId}</TableCell>
                                  <TableCell className="text-muted-foreground">{region.slug}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cities">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cities</CardTitle>
                      <CardDescription>
                        Major cities and capitals ({cities?.length || 0} total)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {citiesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : !cities || cities.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No cities found</p>
                      ) : (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Country ID</TableHead>
                                <TableHead>Region ID</TableHead>
                                <TableHead>Population</TableHead>
                                <TableHead>Capital</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cities.map((city) => (
                                <TableRow key={city.id} data-testid={`row-city-${city.id}`}>
                                  <TableCell className="font-medium">{city.name}</TableCell>
                                  <TableCell>{city.countryId}</TableCell>
                                  <TableCell>{city.regionId || '-'}</TableCell>
                                  <TableCell>{city.population?.toLocaleString() || '-'}</TableCell>
                                  <TableCell>
                                    {city.isCapital && <Badge variant="default">Capital</Badge>}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
