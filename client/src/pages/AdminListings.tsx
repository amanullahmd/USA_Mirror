import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, X, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Listing } from "@shared/schema";

export default function AdminListings() {
  const { toast } = useToast();
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [position, setPosition] = useState("");
  const [durationHours, setDurationHours] = useState("");

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const setPositionMutation = useMutation({
    mutationFn: async ({ id, position, durationHours }: { id: number; position: number; durationHours: number }) => {
      await apiRequest("POST", `/api/admin/listings/${id}/position`, { position, durationHours });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Success",
        description: "Listing position updated",
      });
      setPositionDialogOpen(false);
      setSelectedListing(null);
      setPosition("");
      setDurationHours("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removePositionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/listings/${id}/position`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Success",
        description: "Listing position removed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSetPosition = (listing: Listing) => {
    setSelectedListing(listing);
    setPosition(listing.position?.toString() || "");
    setDurationHours("");
    setPositionDialogOpen(true);
  };

  const handlePositionSubmit = () => {
    if (!selectedListing) return;
    
    const positionNum = parseInt(position);
    const durationNum = parseInt(durationHours);

    if (isNaN(positionNum) || positionNum < 1) {
      toast({
        title: "Invalid Position",
        description: "Position must be a positive integer",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(durationNum) || durationNum < 1) {
      toast({
        title: "Invalid Duration",
        description: "Duration must be at least 1 hour",
        variant: "destructive",
      });
      return;
    }

    setPositionMutation.mutate({ 
      id: selectedListing.id, 
      position: positionNum, 
      durationHours: durationNum 
    });
  };

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
            <h1 className="text-lg font-semibold">All Listings</h1>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Approved Listings</CardTitle>
                  <CardDescription>
                    Manage all published listings and their positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : !listings || listings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No listings found
                    </p>
                  ) : (
                    <div className="border rounded-lg" data-testid="table-listings">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Business Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {listings.map((listing) => (
                            <TableRow key={listing.id} data-testid={`row-listing-${listing.id}`}>
                              <TableCell>
                                {listing.position ? (
                                  <Badge variant="default">#{listing.position}</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{listing.title}</TableCell>
                              <TableCell>{listing.categoryId}</TableCell>
                              <TableCell>
                                <Badge variant={listing.listingType === 'promotional' ? 'default' : 'secondary'}>
                                  {listing.listingType}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {listing.featured ? (
                                  <Badge variant="default">Featured</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell>0</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleSetPosition(listing)}
                                    data-testid={`button-position-${listing.id}`}
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </Button>
                                  {listing.position && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => removePositionMutation.mutate(listing.id)}
                                      disabled={removePositionMutation.isPending}
                                      data-testid={`button-remove-position-${listing.id}`}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={positionDialogOpen} onOpenChange={setPositionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Listing Position</DialogTitle>
            <DialogDescription>
              Position this listing at the top of its category
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Listing Title</Label>
                <Input 
                  id="business-name" 
                  value={selectedListing.title} 
                  disabled 
                  data-testid="input-business-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position (1 = top)</Label>
                <Input
                  id="position"
                  type="number"
                  min="1"
                  placeholder="Enter position number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  data-testid="input-position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="Enter number of hours"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  data-testid="input-duration"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPositionDialogOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePositionSubmit}
              disabled={setPositionMutation.isPending}
              data-testid="button-confirm-position"
            >
              {setPositionMutation.isPending ? "Saving..." : "Set Position"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
