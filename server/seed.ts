import { db } from "./db";
import { categories, countries, regions, adminUsers, promotionalPackages } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Starting database seeding...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const existingAdmin = await db.select().from(adminUsers).limit(1);
  
  if (existingAdmin.length === 0) {
    await db.insert(adminUsers).values({
      username: "admin",
      passwordHash: adminPassword,
    });
    console.log("✅ Created admin user (username: admin, password: admin123)");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  const existingPackages = await db.select().from(promotionalPackages).limit(1);
  
  if (existingPackages.length === 0) {
    await db.insert(promotionalPackages).values([
      {
        name: "Basic Highlight",
        price: 2999, // $29.99
        durationDays: 30,
        features: ["Featured badge", "Top placement for 30 days", "Standard support"],
        active: true,
      },
      {
        name: "Premium Featured",
        price: 4999, // $49.99
        durationDays: 60,
        features: ["Featured badge", "Top placement for 60 days", "Priority support", "Social media spotlight"],
        active: true,
      },
      {
        name: "Enterprise Showcase",
        price: 9999, // $99.99
        durationDays: 90,
        features: ["Featured badge", "Top placement for 90 days", "Priority support", "Social media spotlight", "Monthly analytics report", "Dedicated account manager"],
        active: true,
      },
    ]);
    console.log("✅ Created promotional packages");
  } else {
    console.log("ℹ️  Promotional packages already exist");
  }

  const existingCountries = await db.select().from(countries).limit(1);
  
  if (existingCountries.length === 0) {
    const countryData = [
      { name: "United States", slug: "usa", flag: "🇺🇸" },
      { name: "United Kingdom", slug: "uk", flag: "🇬🇧" },
      { name: "Canada", slug: "canada", flag: "🇨🇦" },
      { name: "Australia", slug: "australia", flag: "🇦🇺" },
      { name: "India", slug: "india", flag: "🇮🇳" },
      { name: "Bangladesh", slug: "bangladesh", flag: "🇧🇩" },
    ];

    const insertedCountries = await db.insert(countries).values(countryData).returning();
    console.log("✅ Created countries");

    const regionData = [
      { name: "California", slug: "california", countryId: insertedCountries[0].id },
      { name: "New York", slug: "new-york", countryId: insertedCountries[0].id },
      { name: "Texas", slug: "texas", countryId: insertedCountries[0].id },
      { name: "London", slug: "london", countryId: insertedCountries[1].id },
      { name: "Manchester", slug: "manchester", countryId: insertedCountries[1].id },
      { name: "Ontario", slug: "ontario", countryId: insertedCountries[2].id },
      { name: "British Columbia", slug: "british-columbia", countryId: insertedCountries[2].id },
      { name: "New South Wales", slug: "new-south-wales", countryId: insertedCountries[3].id },
      { name: "Victoria", slug: "victoria", countryId: insertedCountries[3].id },
      { name: "Maharashtra", slug: "maharashtra", countryId: insertedCountries[4].id },
      { name: "Karnataka", slug: "karnataka", countryId: insertedCountries[4].id },
      { name: "Dhaka", slug: "dhaka", countryId: insertedCountries[5].id },
      { name: "Chittagong", slug: "chittagong", countryId: insertedCountries[5].id },
    ];

    await db.insert(regions).values(regionData);
    console.log("✅ Created regions");
  } else {
    console.log("ℹ️  Countries and regions already exist");
  }

  const existingCategories = await db.select().from(categories).limit(1);
  
  if (existingCategories.length === 0) {
    await db.insert(categories).values([
      { name: "Technology", slug: "technology", icon: "Cpu", count: 0 },
      { name: "Healthcare", slug: "healthcare", icon: "Heart", count: 0 },
      { name: "Education", slug: "education", icon: "GraduationCap", count: 0 },
      { name: "Finance", slug: "finance", icon: "DollarSign", count: 0 },
      { name: "Retail", slug: "retail", icon: "ShoppingBag", count: 0 },
      { name: "Food & Beverage", slug: "food-beverage", icon: "Utensils", count: 0 },
      { name: "Real Estate", slug: "real-estate", icon: "Home", count: 0 },
      { name: "Legal Services", slug: "legal", icon: "Scale", count: 0 },
    ]);
    console.log("✅ Created categories");
  } else {
    console.log("ℹ️  Categories already exist");
  }

  console.log("✅ Database seeding completed!");
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
