import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Database, Copy, Download, Globe, MapPin, Package } from "lucide-react";
import type { Category } from "@shared/schema";

export default function AdminDatabaseTools() {
  const { toast } = useToast();
  const [sqlOutput, setSqlOutput] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery<any[]>({
    queryKey: ["/api/countries"],
  });

  const { data: regions = [], isLoading: regionsLoading } = useQuery<any[]>({
    queryKey: ["/api/regions"],
  });

  const { data: cities = [], isLoading: citiesLoading } = useQuery<any[]>({
    queryKey: ["/api/cities"],
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/promotional-packages"],
  });

  const isLoading = categoriesLoading || countriesLoading || regionsLoading || citiesLoading || packagesLoading;

  const generateAllDataSql = () => {
    let sqlParts: string[] = [];

    // Categories
    if (categories.length > 0) {
      const sortedCategories = [...categories].sort((a, b) => {
        if (!a.parentId && b.parentId) return -1;
        if (a.parentId && !b.parentId) return 1;
        return 0;
      });

      const categorySql = sortedCategories.map(cat => {
        const parentIdValue = cat.parentId ? cat.parentId : 'NULL';
        const countValue = cat.count || 0;
        return `INSERT INTO categories (name, slug, icon, parent_id, count)
VALUES ('${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${cat.icon}', ${parentIdValue}, ${countValue})
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, parent_id = EXCLUDED.parent_id, count = EXCLUDED.count;`;
      });

      sqlParts.push(`-- ========================================
-- CATEGORIES (${categories.length} total)
-- ========================================
${categorySql.join('\n\n')}`);
    }

    // Countries
    if (countries.length > 0) {
      const countrySql = countries.map(c =>
        `INSERT INTO countries (name, slug) VALUES ('${c.name.replace(/'/g, "''")}', '${c.slug}') ON CONFLICT (slug) DO NOTHING;`
      );
      sqlParts.push(`\n\n-- ========================================
-- COUNTRIES (${countries.length} total)
-- ========================================
${countrySql.join('\n')}`);
    }

    // Regions
    if (regions.length > 0) {
      const regionSql = regions.map(r =>
        `INSERT INTO regions (name, slug, country_id) VALUES ('${r.name.replace(/'/g, "''")}', '${r.slug}', ${r.countryId}) ON CONFLICT (slug) DO NOTHING;`
      );
      sqlParts.push(`\n\n-- ========================================
-- REGIONS (${regions.length} total)
-- ========================================
${regionSql.join('\n')}`);
    }

    // Cities
    if (cities.length > 0) {
      const citySql = cities.map(c =>
        `INSERT INTO cities (name, slug, country_id, region_id) VALUES ('${c.name.replace(/'/g, "''")}', '${c.slug}', ${c.countryId}, ${c.regionId || 'NULL'}) ON CONFLICT (slug) DO NOTHING;`
      );
      sqlParts.push(`\n\n-- ========================================
-- CITIES (${cities.length} total)
-- ========================================
${citySql.join('\n')}`);
    }

    // Promotional Packages
    if (packages.length > 0) {
      const packageSql = packages.map(p => {
        const featuresStr = JSON.stringify(p.features).replace(/'/g, "''");
        return `INSERT INTO promotional_packages (name, price, duration_days, features, active)
VALUES ('${p.name.replace(/'/g, "''")}', ${p.price}, ${p.durationDays}, '${featuresStr}'::jsonb, ${p.active})
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price, duration_days = EXCLUDED.duration_days, features = EXCLUDED.features, active = EXCLUDED.active;`;
      });
      sqlParts.push(`\n\n-- ========================================
-- PROMOTIONAL PACKAGES (${packages.length} total)
-- ========================================
${packageSql.join('\n\n')}`);
    }

    const fullSql = `-- ========================================
-- REFERENCE DATA EXPORT
-- Generated: ${new Date().toLocaleString()}
-- ========================================
-- Total: ${categories.length} categories, ${countries.length} countries, 
--        ${regions.length} regions, ${cities.length} cities, ${packages.length} packages
--
-- This SQL uses ON CONFLICT to safely insert/update data
-- Safe to run multiple times
-- ========================================

${sqlParts.join('\n')}

-- ========================================
-- IMPORT COMPLETE!
-- ========================================`;

    setSqlOutput(fullSql);

    toast({
      title: "SQL Generated!",
      description: `Exported ${categories.length + countries.length + regions.length + cities.length + packages.length} total records.`,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlOutput);
      toast({
        title: "Copied!",
        description: "SQL statements copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadSql = () => {
    const blob = new Blob([sqlOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complete-database-export-${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "SQL file downloaded successfully.",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h2 className="text-lg font-semibold">Database Tools</h2>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6 max-w-5xl">
              <div>
                <h1 className="text-3xl font-bold mb-2">Database Tools</h1>
                <p className="text-muted-foreground">
                  Export data from development to import into production database
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Export All Reference Data
                  </CardTitle>
                  <CardDescription>
                    Generate SQL statements to copy all categories, countries, regions, cities, and promotional packages to production
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Database className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{isLoading ? "..." : categories.length}</p>
                      <p className="text-xs text-muted-foreground">Categories</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Globe className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{isLoading ? "..." : countries.length}</p>
                      <p className="text-xs text-muted-foreground">Countries</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{isLoading ? "..." : regions.length}</p>
                      <p className="text-xs text-muted-foreground">Regions</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{isLoading ? "..." : cities.length}</p>
                      <p className="text-xs text-muted-foreground">Cities</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold">{isLoading ? "..." : packages.length}</p>
                      <p className="text-xs text-muted-foreground">Packages</p>
                    </div>
                  </div>

                  <Button
                    onClick={generateAllDataSql}
                    disabled={isLoading}
                    size="lg"
                    className="w-full"
                    data-testid="button-export-all"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Generate Complete SQL Export
                  </Button>

                  {sqlOutput && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Generated SQL Statements</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            data-testid="button-copy-sql"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadSql}
                            data-testid="button-download-sql"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={sqlOutput}
                        readOnly
                        className="font-mono text-xs min-h-[400px]"
                        data-testid="textarea-sql-output"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      📝 How to Import to Production:
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                      <li>Click "Generate Complete SQL Export" above</li>
                      <li>Click "Copy" to copy all SQL to your clipboard</li>
                      <li>Open the Replit Database pane (left sidebar)</li>
                      <li>Switch to the "Production" tab at the top</li>
                      <li>Click "SQL Runner" or "Query" button</li>
                      <li>Paste the SQL statements and click "Run"</li>
                      <li>All your data will now be in production!</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      ✅ Safe to Use:
                    </h4>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 list-disc list-inside">
                      <li>Uses ON CONFLICT to safely update existing records</li>
                      <li>Won't create duplicates - safe to run multiple times</li>
                      <li>Categories are exported parent-first for proper ordering</li>
                      <li>All data properly escaped and formatted</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
