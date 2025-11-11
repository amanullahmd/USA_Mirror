import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PromotionalPackage, InsertPromotionalPackage } from "@shared/schema";
import { insertPromotionalPackageSchema } from "@shared/schema";

const packageFormSchema = insertPromotionalPackageSchema.extend({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  durationDays: z.number().min(1, "Duration must be at least 1 day"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  active: z.boolean(),
});

type PackageFormData = z.infer<typeof packageFormSchema>;

interface PackageFormValues {
  name: string;
  price: string;
  durationDays: string;
  features: string;
  active: boolean;
}

export default function AdminPackages() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PromotionalPackage | null>(null);

  const { data: packages, isLoading } = useQuery<PromotionalPackage[]>({
    queryKey: ["/api/admin/promotional-packages"],
  });

  const createForm = useForm<PackageFormValues>({
    defaultValues: {
      name: "",
      price: "",
      durationDays: "",
      features: "",
      active: true,
    },
  });

  const editForm = useForm<PackageFormValues>({
    defaultValues: {
      name: "",
      price: "",
      durationDays: "",
      features: "",
      active: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PackageFormData) => {
      await apiRequest("POST", "/api/admin/promotional-packages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotional-packages"] });
      toast({
        title: "Success",
        description: "Package created successfully",
      });
      setCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PackageFormData }) => {
      await apiRequest("PATCH", `/api/admin/promotional-packages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotional-packages"] });
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
      setEditDialogOpen(false);
      setSelectedPackage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/promotional-packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotional-packages"] });
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      setDeleteDialogOpen(false);
      setSelectedPackage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const transformFormData = (values: PackageFormValues): PackageFormData => {
    return {
      name: values.name,
      price: Math.round(parseFloat(values.price) * 100), // Convert dollars to cents
      durationDays: parseInt(values.durationDays),
      features: values.features.split('\n').filter(f => f.trim() !== ''),
      active: values.active,
    };
  };

  const handleCreate = (values: PackageFormValues) => {
    const data = transformFormData(values);
    createMutation.mutate(data);
  };

  const handleEdit = (pkg: PromotionalPackage) => {
    setSelectedPackage(pkg);
    editForm.reset({
      name: pkg.name,
      price: (pkg.price / 100).toFixed(2),
      durationDays: pkg.durationDays.toString(),
      features: pkg.features.join('\n'),
      active: pkg.active,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = (values: PackageFormValues) => {
    if (selectedPackage) {
      const data = transformFormData(values);
      updateMutation.mutate({ id: selectedPackage.id, data });
    }
  };

  const handleDeleteClick = (pkg: PromotionalPackage) => {
    setSelectedPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPackage) {
      deleteMutation.mutate(selectedPackage.id);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-xl font-semibold">Promotional Packages</h1>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              data-testid="button-create-package"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Manage Packages</h2>
                <p className="text-muted-foreground">
                  Create and manage promotional packages for business listings
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages?.map((pkg) => (
                    <Card key={pkg.id} data-testid={`card-package-${pkg.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle data-testid={`text-package-name-${pkg.id}`}>
                              {pkg.name}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              <span className="text-2xl font-bold text-foreground" data-testid={`text-package-price-${pkg.id}`}>
                                {formatPrice(pkg.price)}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant={pkg.active ? "default" : "secondary"}
                            data-testid={`badge-package-status-${pkg.id}`}
                          >
                            {pkg.active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            <p className="text-base" data-testid={`text-package-duration-${pkg.id}`}>
                              {pkg.durationDays} days
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Features</p>
                            <ul className="space-y-1" data-testid={`list-package-features-${pkg.id}`}>
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleEdit(pkg)}
                              data-testid={`button-edit-package-${pkg.id}`}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(pkg)}
                              data-testid={`button-delete-package-${pkg.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-create-package">
          <DialogHeader>
            <DialogTitle>Create Package</DialogTitle>
            <DialogDescription>
              Add a new promotional package for business listings
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Premium Listing"
                        data-testid="input-package-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="e.g., 29.99"
                          data-testid="input-package-price"
                        />
                      </FormControl>
                      <FormDescription>Price in dollars</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 30"
                          data-testid="input-package-duration"
                        />
                      </FormControl>
                      <FormDescription>Number of days</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={createForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter one feature per line&#10;e.g.,&#10;Featured placement&#10;Priority listing&#10;Enhanced visibility"
                        rows={5}
                        data-testid="input-package-features"
                      />
                    </FormControl>
                    <FormDescription>One feature per line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Make this package available for purchase
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-package-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  data-testid="button-cancel-create"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-create"
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-package">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>
              Update package information
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Premium Listing"
                        data-testid="input-edit-package-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="e.g., 29.99"
                          data-testid="input-edit-package-price"
                        />
                      </FormControl>
                      <FormDescription>Price in dollars</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 30"
                          data-testid="input-edit-package-duration"
                        />
                      </FormControl>
                      <FormDescription>Number of days</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter one feature per line"
                        rows={5}
                        data-testid="input-edit-package-features"
                      />
                    </FormControl>
                    <FormDescription>One feature per line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Make this package available for purchase
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-edit-package-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-submit-edit"
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-package">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the package "{selectedPackage?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
