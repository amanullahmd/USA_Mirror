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
  const [schemaOutput, setSchemaOutput] = useState("");

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

  const generateAllDataSql = async () => {
    try {
      const response = await fetch('/api/admin/export-sql');
      if (!response.ok) {
        throw new Error('Failed to generate SQL');
      }
      const sql = await response.text();
      setSqlOutput(sql);

      const totalRecords = categories.length + countries.length + regions.length + cities.length + packages.length;
      toast({
        title: "SQL Generated!",
        description: `Exported ${totalRecords} total records.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SQL export.",
        variant: "destructive",
      });
    }
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
    a.download = `data-export-${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Data export file downloaded successfully.",
    });
  };

  const downloadSchema = async () => {
    try {
      const response = await fetch('/api/admin/export-schema');
      if (!response.ok) {
        throw new Error('Failed to fetch schema');
      }
      const schema = await response.text();
      setSchemaOutput(schema);

      const blob = new Blob([schema], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schema-${Date.now()}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: "Database schema downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download schema.",
        variant: "destructive",
      });
    }
  };

  const downloadHostingerPackage = async () => {
    try {
      // Get schema
      const schemaResponse = await fetch('/api/admin/export-schema');
      if (!schemaResponse.ok) throw new Error('Failed to fetch schema');
      const schema = await schemaResponse.text();

      // Get data
      const dataResponse = await fetch('/api/admin/export-sql');
      if (!dataResponse.ok) throw new Error('Failed to fetch data');
      const data = await dataResponse.text();

      // Combine them
      const complete = `-- ========================================
-- THE USA MIRROR - COMPLETE DATABASE EXPORT
-- FOR HOSTINGER POSTGRESQL DEPLOYMENT
-- Generated: ${new Date().toLocaleString()}
-- ========================================
--
-- INSTRUCTIONS:
-- 1. Create a new PostgreSQL database in Hostinger
-- 2. Run this ENTIRE file in phpPgAdmin or your database manager
-- 3. The schema will be created first, then data will be imported
--
-- ========================================

-- STEP 1: CREATE TABLES (Schema)
-- ========================================

${schema}

-- ========================================
-- STEP 2: INSERT DATA
-- ========================================

${data}

-- ========================================
-- DEPLOYMENT COMPLETE!
-- ========================================`;

      const blob = new Blob([complete], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hostinger-complete-deployment-${Date.now()}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: "Complete Hostinger deployment package downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create deployment package.",
        variant: "destructive",
      });
    }
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

                  <Tabs defaultValue="replit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="replit">Replit Production</TabsTrigger>
                      <TabsTrigger value="hostinger">Hostinger / External DB</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="replit" className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          📝 Import to Replit Production Database:
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
                    </TabsContent>
                    
                    <TabsContent value="hostinger" className="space-y-3">
                      <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                          🌐 Complete Hostinger Deployment Package
                        </h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                          Download a single SQL file that contains both the database schema (CREATE TABLE statements) and all your data. Perfect for deploying to Hostinger!
                        </p>
                        
                        <Button
                          onClick={downloadHostingerPackage}
                          disabled={isLoading}
                          size="lg"
                          className="w-full mb-4"
                          data-testid="button-download-hostinger-package"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Complete Hostinger Package
                        </Button>

                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 mt-4">
                          📝 Deployment Instructions:
                        </h4>
                        <ol className="text-sm text-purple-800 dark:text-purple-200 space-y-2 list-decimal list-inside">
                          <li>Click "Download Complete Hostinger Package" button above</li>
                          <li>Login to your Hostinger control panel (hPanel)</li>
                          <li>Go to "Databases" → Create or select a PostgreSQL database</li>
                          <li>Click "phpPgAdmin" or "Manage" to open the database manager</li>
                          <li>Click the "SQL" tab at the top</li>
                          <li>Open the downloaded file and copy ALL the SQL content</li>
                          <li>Paste it into the SQL query box</li>
                          <li>Click "Execute" to create tables and import all data</li>
                          <li>Your database is now ready on Hostinger!</li>
                        </ol>
                        
                        <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900 rounded">
                          <p className="text-xs text-purple-900 dark:text-purple-100 font-semibold mb-2">
                            📦 What's included in the package:
                          </p>
                          <ul className="text-xs text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                            <li>Complete database schema (all 11 tables)</li>
                            <li>All {categories.length} categories with hierarchical structure</li>
                            <li>All {countries.length} countries with flags and codes</li>
                            <li>All {regions.length} regions (states/provinces)</li>
                            <li>All {cities.length} cities with geographic data</li>
                            <li>All {packages.length} promotional packages</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

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
