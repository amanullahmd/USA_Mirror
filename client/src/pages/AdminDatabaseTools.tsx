import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Database, Copy, Download } from "lucide-react";
import type { Category } from "@shared/schema";

export default function AdminDatabaseTools() {
  const { toast } = useToast();
  const [sqlOutput, setSqlOutput] = useState("");

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const generateCategorySql = () => {
    if (categories.length === 0) {
      toast({
        title: "No Categories",
        description: "No categories found to export.",
        variant: "destructive",
      });
      return;
    }

    // Sort categories: parent categories first, then subcategories
    const sortedCategories = [...categories].sort((a, b) => {
      if (!a.parentId && b.parentId) return -1;
      if (a.parentId && !b.parentId) return 1;
      return 0;
    });

    const sqlStatements = sortedCategories.map(cat => {
      const parentIdValue = cat.parentId ? cat.parentId : 'NULL';
      const countValue = cat.count || 0;
      
      // Use INSERT with ON CONFLICT to update if slug already exists
      return `INSERT INTO categories (name, slug, icon, parent_id, count)
VALUES ('${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${cat.icon}', ${parentIdValue}, ${countValue})
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  parent_id = EXCLUDED.parent_id,
  count = EXCLUDED.count;`;
    });

    const fullSql = `-- Categories Export from Development Database
-- Generated: ${new Date().toLocaleString()}
-- Total Categories: ${categories.length}
-- This SQL uses ON CONFLICT to safely update existing categories

${sqlStatements.join('\n\n')}

-- Done! ${categories.length} categories imported/updated.`;

    setSqlOutput(fullSql);
    
    toast({
      title: "SQL Generated!",
      description: `${categories.length} categories exported as SQL statements.`,
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
    a.download = `categories-export-${Date.now()}.sql`;
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
              Export Categories
            </CardTitle>
            <CardDescription>
              Generate SQL statements to copy all categories from this database to production
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Categories in Current Database</p>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `${categories.length} categories found`}
                </p>
              </div>
              <Button 
                onClick={generateCategorySql} 
                disabled={isLoading || categories.length === 0}
                data-testid="button-export-categories"
              >
                <Database className="h-4 w-4 mr-2" />
                Generate SQL
              </Button>
            </div>

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
                How to Import to Production:
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>Click "Generate SQL" to create the export statements</li>
                <li>Click "Copy" to copy the SQL to your clipboard</li>
                <li>Open the Replit Database pane (left sidebar)</li>
                <li>Switch to the "Production" tab at the top</li>
                <li>Click "SQL Runner" or "Query" button</li>
                <li>Paste the SQL statements and click "Run"</li>
                <li>Your categories will now appear in production!</li>
              </ol>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                ⚠️ Important Notes:
              </h4>
              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                <li>This exports categories from your current (development) database</li>
                <li>Parent categories must be created before subcategories</li>
                <li>The SQL file handles this automatically in the correct order</li>
                <li>You can safely run this multiple times (it will create duplicates though)</li>
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
