import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubmissionForm from "@/components/SubmissionForm";

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Submit Your Listing</h1>
            <p className="text-muted-foreground">
              Join thousands of businesses already listed on our global platform
            </p>
          </div>
          <SubmissionForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
