import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Check, Image, Video, Star } from "lucide-react";
import type { Category, Country, Region, City, PromotionalPackage } from "@shared/schema";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  country: z.string().min(1, "Please select a country"),
  region: z.string().min(1, "Please select a state/province"),
  city: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().url("Valid URL is required").or(z.literal("")),
  imageUrl: z.string().url("Valid image URL is required").or(z.literal("")),
  videoUrl: z.string().url("Valid video URL is required").or(z.literal("")),
  listingType: z.enum(["free", "promotional"]),
  packageId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SubmissionForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery<PromotionalPackage[]>({
    queryKey: ["/api/promotional-packages"],
  });

  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ["/api/regions", selectedCountryId],
    enabled: selectedCountryId !== null,
  });

  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ["/api/cities", selectedRegionId],
    enabled: selectedRegionId !== null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      category: "",
      country: "",
      region: "",
      city: "",
      description: "",
      contactPerson: "",
      phone: "",
      email: "",
      website: "",
      imageUrl: "",
      videoUrl: "",
      listingType: "free",
      packageId: "",
    },
  });

  const listingType = form.watch("listingType");

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const category = categories.find((c) => c.id.toString() === data.category);
      const country = countries.find((c) => c.id.toString() === data.country);
      const region = regions.find((r) => r.id.toString() === data.region);
      const city = data.city ? cities.find((c) => c.id.toString() === data.city) : null;

      if (!category || !country || !region) {
        throw new Error("Invalid selection");
      }

      const response = await apiRequest("POST", "/api/submissions", {
        businessName: data.businessName,
        description: data.description,
        categoryId: category.id,
        countryId: country.id,
        regionId: region.id,
        cityId: city?.id || undefined,
        contactPerson: data.contactPerson,
        phone: data.phone,
        email: data.email,
        website: data.website || undefined,
        imageUrl: data.imageUrl || undefined,
        videoUrl: data.videoUrl || undefined,
        listingType: data.listingType,
        packageId: data.packageId ? parseInt(data.packageId) : undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission Received!",
        description: "Your listing will be reviewed by our team shortly.",
      });
      form.reset();
      setStep(1);
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormData) {
    submitMutation.mutate(data);
  }

  function handleCountryChange(countryId: string) {
    const country = countries.find((c) => c.id.toString() === countryId);
    if (country) {
      setSelectedCountryId(country.id);
      setSelectedRegionId(null);
      form.setValue("region", "");
      form.setValue("city", "");
    }
  }

  function handleRegionChange(regionId: string) {
    const region = regions.find((r) => r.id.toString() === regionId);
    if (region) {
      setSelectedRegionId(region.id);
      form.setValue("city", "");
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <Card className="max-w-3xl mx-auto" data-testid="form-submission">
      <CardHeader>
        <CardTitle>Submit Your Business Listing</CardTitle>
        <CardDescription>
          Fill out the form below to add your business to our global directory. Choose between free and promotional listings.
        </CardDescription>
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">Step {step} of 3</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business name" {...field} data-testid="input-business-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem 
                              key={cat.id} 
                              value={cat.id.toString()}
                              data-testid={`option-category-${cat.id}`}
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCountryChange(value);
                        }}
                        value={field.value}
                        disabled={countriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-country">
                            <SelectValue placeholder={countriesLoading ? "Loading..." : "Select country"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem 
                              key={country.id} 
                              value={country.id.toString()}
                              data-testid={`option-country-${country.id}`}
                            >
                              {country.flag} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province/Region</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleRegionChange(value);
                        }} 
                        value={field.value} 
                        disabled={!selectedCountryId}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-region">
                            <SelectValue placeholder={!selectedCountryId ? "Select country first" : "Select state/province"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem 
                              key={region.id} 
                              value={region.id.toString()}
                              data-testid={`option-region-${region.id}`}
                            >
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value} 
                        disabled={!selectedRegionId}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-city">
                            <SelectValue placeholder={!selectedRegionId ? "Select state/province first" : cities.length === 0 ? "No cities available" : "Select city"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem 
                              key={city.id} 
                              value={city.id.toString()}
                              data-testid={`option-city-${city.id}`}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a city if available, or leave blank to use state/province only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your business, services, and what makes you unique..."
                          className="min-h-32"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)} data-testid="button-next-step-1">
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} data-testid="input-contact-person" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@business.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.yourbusiness.com" {...field} data-testid="input-website" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="https://example.com/image.jpg" {...field} className="pl-9" data-testid="input-image-url" />
                        </div>
                      </FormControl>
                      <FormDescription>Add a photo of your business or product</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} className="pl-9" data-testid="input-video-url" />
                        </div>
                      </FormControl>
                      <FormDescription>Link to a video showcasing your business</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="button-back-step-2">
                    Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)} data-testid="button-next-step-2">
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Type</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="gap-4">
                          <Card className="hover-elevate cursor-pointer" data-testid="card-listing-type-free">
                            <label htmlFor="free" className="cursor-pointer">
                              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                  <RadioGroupItem value="free" id="free" />
                                  <div>
                                    <CardTitle className="text-base">Free Listing</CardTitle>
                                    <CardDescription>Standard directory entry</CardDescription>
                                  </div>
                                </div>
                                <Badge variant="secondary">$0</Badge>
                              </CardHeader>
                              <CardContent>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Basic business information
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Standard listing placement
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Searchable in directory
                                  </li>
                                </ul>
                              </CardContent>
                            </label>
                          </Card>
                          <Card className="hover-elevate cursor-pointer border-primary" data-testid="card-listing-type-promotional">
                            <label htmlFor="promotional" className="cursor-pointer">
                              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                  <RadioGroupItem value="promotional" id="promotional" />
                                  <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                      Promotional Listing
                                      <Star className="w-4 h-4 text-primary fill-primary" />
                                    </CardTitle>
                                    <CardDescription>Featured placement with premium benefits</CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">Select a package below to continue</p>
                              </CardContent>
                            </label>
                          </Card>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {listingType === "promotional" && (
                  <FormField
                    control={form.control}
                    name="packageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Promotional Package</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="gap-4">
                            {packagesLoading ? (
                              <p className="text-sm text-muted-foreground">Loading packages...</p>
                            ) : packages.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No packages available</p>
                            ) : (
                              packages.map((pkg) => (
                                <Card key={pkg.id} className="hover-elevate cursor-pointer" data-testid={`card-package-${pkg.id}`}>
                                  <label htmlFor={`package-${pkg.id}`} className="cursor-pointer">
                                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                                      <div className="flex items-center gap-2">
                                        <RadioGroupItem value={pkg.id.toString()} id={`package-${pkg.id}`} />
                                        <div>
                                          <CardTitle className="text-base">{pkg.name}</CardTitle>
                                          <CardDescription>{pkg.durationDays} days</CardDescription>
                                        </div>
                                      </div>
                                      <Badge>{formatPrice(pkg.price)}</Badge>
                                    </CardHeader>
                                    <CardContent>
                                      <ul className="text-sm text-muted-foreground space-y-1">
                                        {pkg.features.map((feature, idx) => (
                                          <li key={idx} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-primary" /> {feature}
                                          </li>
                                        ))}
                                      </ul>
                                    </CardContent>
                                  </label>
                                </Card>
                              ))
                            )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} data-testid="button-back-step-3">
                    Back
                  </Button>
                  <Button type="submit" disabled={submitMutation.isPending} data-testid="button-submit-form">
                    {submitMutation.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                    Submit Listing
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
