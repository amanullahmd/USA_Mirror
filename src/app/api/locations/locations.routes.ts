import { Express } from 'express';
import { asyncHandler } from '../../middleware/error.middleware';
import { db } from '../../config/database.config';
import { countries, regions, cities } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export function registerLocationRoutes(app: Express) {
  // Get all countries
  app.get('/api/locations/countries', asyncHandler(async (req, res) => {
    try {
      const allCountries = await db.select().from(countries);
      res.json(allCountries || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.json([]);
    }
  }));

  // Get country by slug
  app.get('/api/locations/countries/:slug', asyncHandler(async (req, res) => {
    try {
      const country = await db
        .select()
        .from(countries)
        .where(eq(countries.slug, req.params.slug))
        .limit(1);

      if (country.length === 0) {
        return res.status(404).json({ error: 'Country not found' });
      }

      res.json(country[0]);
    } catch (error) {
      console.error('Error fetching country:', error);
      res.status(500).json({ error: 'Failed to fetch country' });
    }
  }));

  // Get regions by country ID
  app.get('/api/locations/regions/:countryId', asyncHandler(async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const regionList = await db
        .select()
        .from(regions)
        .where(eq(regions.countryId, countryId));

      res.json(regionList || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
      res.json([]);
    }
  }));

  // Get cities by region ID
  app.get('/api/locations/cities/:regionId', asyncHandler(async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      const cityList = await db
        .select()
        .from(cities)
        .where(eq(cities.regionId, regionId));

      res.json(cityList || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.json([]);
    }
  }));

  // Get all regions
  app.get('/api/regions', asyncHandler(async (req, res) => {
    try {
      const allRegions = await db.select().from(regions);
      res.json(allRegions || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
      res.json([]);
    }
  }));

  // Get all cities
  app.get('/api/cities', asyncHandler(async (req, res) => {
    try {
      const allCities = await db.select().from(cities);
      res.json(allCities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.json([]);
    }
  }));
}
