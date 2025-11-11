import type { Express } from "express";
import { storage } from "./storage";
import { insertSubmissionSchema, insertCategorySchema, insertPromotionalPackageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import "./types";

export function registerRoutes(app: Express) {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/:slug", async (req, res) => {
    try {
      const country = await storage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch country" });
    }
  });

  // Regions
  app.get("/api/regions", async (req, res) => {
    try {
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const regions = countryId
        ? await storage.getRegionsByCountry(countryId)
        : await storage.getRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regions" });
    }
  });

  // Listings
  app.get("/api/listings", async (req, res) => {
    try {
      const options: any = {};
      if (req.query.categoryId) options.categoryId = parseInt(req.query.categoryId as string);
      if (req.query.countryId) options.countryId = parseInt(req.query.countryId as string);
      if (req.query.regionId) options.regionId = parseInt(req.query.regionId as string);
      if (req.query.featured) options.featured = req.query.featured === 'true';
      if (req.query.limit) options.limit = parseInt(req.query.limit as string);

      const listings = await storage.getListings(options);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getListingById(id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Increment view count
      await storage.incrementListingViews(id);
      
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  // Submissions
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create submission" });
    }
  });

  app.get("/api/submissions", async (req, res) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const status = req.query.status as string | undefined;
      const submissions = await storage.getSubmissions(status);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.patch("/api/submissions/:id/status", async (req, res) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // If approved, create a listing from the submission
      if (status === 'approved') {
        const submission = await storage.getSubmissionById(id);
        if (submission) {
          const newListing: any = {
            title: submission.businessName,
            description: submission.description,
            categoryId: submission.categoryId,
            countryId: submission.countryId,
            regionId: submission.regionId,
            contactPerson: submission.contactPerson,
            phone: submission.phone,
            email: submission.email,
            website: submission.website || undefined,
            imageUrl: submission.imageUrl || undefined,
            videoUrl: submission.videoUrl || undefined,
            listingType: submission.listingType,
            packageId: submission.packageId || undefined,
          };

          // Calculate expiration if promotional
          if (submission.listingType === 'promotional' && submission.packageId) {
            const pkg = await storage.getPromotionalPackageById(submission.packageId);
            if (pkg) {
              const expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + pkg.durationDays);
              newListing.expiresAt = expiresAt;
            }
          }

          await storage.createListing(newListing);
        }
      }

      const updatedSubmission = await storage.updateSubmissionStatus(id, status);
      if (!updatedSubmission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      res.json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ error: "Failed to update submission" });
    }
  });

  // Promotional Packages
  app.get("/api/promotional-packages", async (req, res) => {
    try {
      const packages = await storage.getActivePromotionalPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotional packages" });
    }
  });

  // Admin Routes - Promotional Packages
  app.get("/api/admin/promotional-packages", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const packages = await storage.getPromotionalPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotional packages" });
    }
  });

  app.post("/api/admin/promotional-packages", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validatedData = insertPromotionalPackageSchema.parse(req.body);
      const pkg = await storage.createPromotionalPackage(validatedData);
      res.status(201).json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create promotional package" });
    }
  });

  app.patch("/api/admin/promotional-packages/:id", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      const pkg = await storage.updatePromotionalPackage(id, req.body);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: "Failed to update promotional package" });
    }
  });

  app.delete("/api/admin/promotional-packages/:id", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      await storage.deletePromotionalPackage(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete promotional package" });
    }
  });

  // Admin Routes - Categories
  app.post("/api/admin/categories", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create category" });
    }
  });

  app.patch("/api/admin/categories/:id", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      req.session.username = admin.username;

      res.json({ success: true, username: admin.username });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", async (req, res) => {
    if (req.session?.adminId) {
      res.json({ authenticated: true, username: req.session.username });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Admin Stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
}
