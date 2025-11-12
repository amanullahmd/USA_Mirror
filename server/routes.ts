import type { Express } from "express";
import { storage } from "./storage";
import { insertSubmissionSchema, insertCategorySchema, insertPromotionalPackageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import crypto from "crypto";
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

  // Cities
  app.get("/api/cities", async (req, res) => {
    try {
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const regionId = req.query.regionId ? parseInt(req.query.regionId as string) : undefined;
      
      let isCapital: boolean | undefined = undefined;
      if (req.query.isCapital === 'true') {
        isCapital = true;
      } else if (req.query.isCapital === 'false') {
        isCapital = false;
      }
      
      const cities = await storage.getCities({ countryId, regionId, isCapital });
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
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
            cityId: submission.cityId || undefined,
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
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Regenerate session to prevent session fixation
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });

      req.session.adminId = admin.id;
      req.session.email = admin.email;
      req.session.username = admin.username;

      res.json({ success: true, email: admin.email, username: admin.username });
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
      res.json({ authenticated: true, email: req.session.email, username: req.session.username });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Password Change
  app.post("/api/admin/change-password", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }

      const admin = await storage.getAdminByEmail(req.session.email!);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateAdminPassword(admin.id, newPasswordHash);

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Password Recovery - Request Reset
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }

      const admin = await storage.getAdminByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!admin) {
        return res.json({ success: true, message: "If the email exists, a reset code will be sent" });
      }

      // Generate cryptographically secure random token (32 bytes = 64 hex chars)
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Hash the token before storing
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      
      await storage.setPasswordResetToken(email, hashedToken, expiry);

      // TODO: In production, send the resetToken via email to the user
      // The token would be included in a password reset link
      // For development, the token can be retrieved from the database if needed
      
      res.json({ 
        success: true, 
        message: "If the email exists, a reset code will be sent"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process password reset" });
    }
  });

  // Password Recovery - Reset with Token
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }

      // Hash the provided token to compare with stored hashed version
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      
      const admin = await storage.getAdminByResetToken(hashedToken);
      if (!admin) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateAdminPassword(admin.id, newPasswordHash);

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
}
