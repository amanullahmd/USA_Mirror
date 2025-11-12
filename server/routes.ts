import type { Express } from "express";
import { storage } from "./storage";
import { insertSubmissionSchema, insertCategorySchema, insertPromotionalPackageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateResetToken, hashToken } from "./utils/auth";
import "./types";

export function registerRoutes(app: Express) {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      // Support filtering by parentId (for subcategories)
      let parentId: number | null | undefined = undefined;
      if (req.query.parentId === 'null') {
        parentId = null; // Root categories only
      } else if (req.query.parentId) {
        const parsed = parseInt(req.query.parentId as string);
        if (isNaN(parsed)) {
          return res.status(400).json({ error: "Invalid parentId: must be a number or 'null'" });
        }
        parentId = parsed;
      }
      
      // Support filtering by approval status
      let approved: boolean | undefined = undefined;
      if (req.query.approved === 'true') {
        approved = true;
      } else if (req.query.approved === 'false') {
        approved = false;
      } else if (req.query.approved !== undefined) {
        return res.status(400).json({ error: "Invalid approved: must be 'true' or 'false'" });
      }
      
      const categories = await storage.getCategories({ parentId, approved });
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
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
      
      // Validate pagination parameters
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: "Invalid page parameter" });
      }
      if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
        return res.status(400).json({ error: "Invalid pageSize parameter (must be 1-100)" });
      }
      
      const result = await storage.getSubmissions(status, page, pageSize);
      res.json(result);
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

  // Admin Routes - Category Approval
  app.patch("/api/admin/categories/:id/approve", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }

      const { approved } = req.body;
      if (typeof approved !== 'boolean') {
        return res.status(400).json({ error: "Approved must be a boolean value" });
      }

      const category = await storage.updateCategory(id, { approved });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category approval status" });
    }
  });

  // Admin Routes - Listing Positioning
  app.post("/api/admin/listings/:id/position", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const listingId = parseInt(req.params.id);
      const { position, durationHours } = req.body;

      // Validate position is a positive integer
      if (typeof position !== 'number' || position < 1 || !Number.isInteger(position)) {
        return res.status(400).json({ error: "Position must be a positive integer" });
      }

      // Get the listing to check its category
      const listing = await storage.getListingById(listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      // Check if position is already occupied in the same category
      const categoryListings = await storage.getListings({ categoryId: listing.categoryId });
      const existingPosition = categoryListings.find(
        l => l.id !== listingId && l.position === position
      );
      if (existingPosition) {
        return res.status(409).json({ 
          error: `Position ${position} is already occupied by listing #${existingPosition.id}` 
        });
      }

      // Calculate expiry if duration is provided
      let expiresAt: Date | null = null;
      if (durationHours && durationHours > 0) {
        expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
      }

      const updatedListing = await storage.setListingPosition(listingId, position, expiresAt);
      res.json(updatedListing);
    } catch (error: any) {
      if (error.message?.includes('unique constraint')) {
        res.status(409).json({ error: "Position already occupied in this category" });
      } else {
        res.status(500).json({ error: "Failed to set listing position" });
      }
    }
  });

  app.delete("/api/admin/listings/:id/position", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const listingId = parseInt(req.params.id);
      const listing = await storage.clearListingPosition(listingId);
      
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to clear listing position" });
    }
  });

  app.post("/api/admin/listings/cleanup-positions", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const count = await storage.clearExpiredPositions();
      res.json({ success: true, clearedCount: count });
    } catch (error) {
      res.status(500).json({ error: "Failed to cleanup expired positions" });
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

  app.get("/api/admin/users", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
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

      // Generate cryptographically secure reset token with hash
      const { token: resetToken, hash: hashedToken, expiry } = generateResetToken(0.25); // 15 minutes
      
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
      const hashedToken = hashToken(token);
      
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

  // User Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        phone
      });

      // Generate verification token
      const { token: verificationToken, hash: verificationTokenHash, expiry: verificationExpiry } = generateResetToken(24); // 24 hours

      await storage.setVerificationToken(user.id, verificationTokenHash, verificationExpiry);

      // In production, send verification email here
      // For now, log the token (in development only)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Verification token for ${email}: ${verificationToken}`);
      }

      // Auto-login after signup
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });

      req.session.userId = user.id;
      req.session.userEmail = user.email;

      res.status(201).json({
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
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

      req.session.userId = user.id;
      req.session.userEmail = user.email;

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    if (req.session?.userId) {
      const user = await storage.getUserById(req.session.userId);
      if (user) {
        res.json({
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified
          }
        });
      } else {
        res.json({ authenticated: false });
      }
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: "Verification token required" });
      }

      const tokenHash = hashToken(token);
      const user = await storage.getUserByVerificationToken(tokenHash);

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }

      await storage.verifyUserEmail(user.id);

      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ error: "Email verification failed" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }

      const user = await storage.getUserByEmail(email);
      if (user) {
        const { token: resetToken, hash: resetTokenHash, expiry: resetExpiry } = generateResetToken(1); // 1 hour

        await storage.setUserPasswordResetToken(email, resetTokenHash, resetExpiry);

        // In production, send reset email here
        // For now, log the token (in development only)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
        }
      }

      res.json({
        success: true,
        message: "If the email exists, a reset link will be sent"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process password reset" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }

      const tokenHash = hashToken(token);
      const user = await storage.getUserByPasswordResetToken(tokenHash);

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUserPassword(user.id, newPasswordHash);

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
}
