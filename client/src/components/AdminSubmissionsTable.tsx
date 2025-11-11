import { useState } from "react";
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
import { Check, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  date: string;
  businessName: string;
  category: string;
  location: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminSubmissionsTable() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      date: "2025-11-10",
      businessName: "Tech Innovators Inc",
      category: "Technology",
      location: "San Francisco, USA",
      status: "pending",
    },
    {
      id: "2",
      date: "2025-11-09",
      businessName: "Global News Network",
      category: "News",
      location: "London, UK",
      status: "pending",
    },
    {
      id: "3",
      date: "2025-11-08",
      businessName: "International Business School",
      category: "Education",
      location: "Toronto, Canada",
      status: "pending",
    },
  ]);

  const handleApprove = (id: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, status: "approved" as const } : sub
    ));
    toast({
      title: "Submission Approved",
      description: "The listing has been published.",
    });
  };

  const handleReject = (id: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, status: "rejected" as const } : sub
    ));
    toast({
      title: "Submission Rejected",
      description: "The listing has been rejected.",
      variant: "destructive",
    });
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
        return null;
    }
  };

  return (
    <div className="border rounded-lg" data-testid="table-submissions">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id} data-testid={`row-submission-${submission.id}`}>
              <TableCell className="text-sm">{submission.date}</TableCell>
              <TableCell className="font-medium">{submission.businessName}</TableCell>
              <TableCell>{submission.category}</TableCell>
              <TableCell>{submission.location}</TableCell>
              <TableCell>{getStatusBadge(submission.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" data-testid={`button-view-${submission.id}`}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  {submission.status === "pending" && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleApprove(submission.id)}
                        data-testid={`button-approve-${submission.id}`}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleReject(submission.id)}
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
  );
}
