import { useState, useEffect } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Submission, PaginatedResponse } from "@shared/schema";

export default function AdminSubmissions() {
  const { toast } = useToast();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: submissionsResponse, isLoading } = useQuery<PaginatedResponse<Submission>>({
    queryKey: [`/api/submissions?page=${currentPage}&pageSize=${pageSize}`],
  });

  const submissions = submissionsResponse?.data || [];
  const totalPages = submissionsResponse ? Math.ceil(submissionsResponse.total / submissionsResponse.pageSize) : 0;

  // Adjust currentPage if it exceeds totalPages after data changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/submissions/${id}/status`, { status: "approved" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: ({ queryKey }) => 
          typeof queryKey[0] === "string" && queryKey[0].startsWith("/api/submissions")
      });
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Success",
        description: "Submission approved and published as listing",
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

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/submissions/${id}/status`, { status: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: ({ queryKey }) => 
          typeof queryKey[0] === "string" && queryKey[0].startsWith("/api/submissions")
      });
      toast({
        title: "Success",
        description: "Submission rejected",
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

  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <h1 className="text-lg font-semibold">Pending Submissions</h1>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Listings</CardTitle>
                  <CardDescription>
                    Review and manage pending business submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : !submissions || submissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No pending submissions
                    </p>
                  ) : (
                    <div className="border rounded-lg" data-testid="table-submissions">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Business Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submissions.map((submission) => (
                            <TableRow key={submission.id} data-testid={`row-submission-${submission.id}`}>
                              <TableCell className="text-sm">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">{submission.businessName}</TableCell>
                              <TableCell>{submission.categoryId}</TableCell>
                              <TableCell>
                                <Badge variant={submission.listingType === 'promotional' ? 'default' : 'secondary'}>
                                  {submission.listingType}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(submission.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleView(submission)}
                                    data-testid={`button-view-${submission.id}`}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {submission.status === "pending" && (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => approveMutation.mutate(submission.id)}
                                        disabled={approveMutation.isPending}
                                        data-testid={`button-approve-${submission.id}`}
                                      >
                                        <Check className="w-4 h-4 text-green-600" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => rejectMutation.mutate(submission.id)}
                                        disabled={rejectMutation.isPending}
                                        data-testid={`button-reject-${submission.id}`}
                                      >
                                        <X className="w-4 h-4 text-red-600" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {!isLoading && submissions.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 mt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages} ({submissionsResponse?.total || 0} total submissions)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          data-testid="button-previous-page"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          data-testid="button-next-page"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review the full details of this submission
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Business Information</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Business Name</dt>
                    <dd className="font-medium">{selectedSubmission.businessName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Type</dt>
                    <dd className="capitalize">{selectedSubmission.listingType}</dd>
                  </div>
                  {selectedSubmission.description && (
                    <div className="col-span-2">
                      <dt className="text-sm text-muted-foreground">Description</dt>
                      <dd>{selectedSubmission.description}</dd>
                    </div>
                  )}
                  {selectedSubmission.email && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Email</dt>
                      <dd>{selectedSubmission.email}</dd>
                    </div>
                  )}
                  {selectedSubmission.phone && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Phone</dt>
                      <dd>{selectedSubmission.phone}</dd>
                    </div>
                  )}
                  {selectedSubmission.website && (
                    <div className="col-span-2">
                      <dt className="text-sm text-muted-foreground">Website</dt>
                      <dd>
                        <a href={selectedSubmission.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {selectedSubmission.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              {selectedSubmission.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      approveMutation.mutate(selectedSubmission.id);
                      setViewDialogOpen(false);
                    }}
                    disabled={approveMutation.isPending}
                    data-testid="button-approve-dialog"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      rejectMutation.mutate(selectedSubmission.id);
                      setViewDialogOpen(false);
                    }}
                    disabled={rejectMutation.isPending}
                    data-testid="button-reject-dialog"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
