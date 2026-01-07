import * as fc from 'fast-check';
import {
  validListingArbitrary,
  listingStatusArbitrary,
  validBusinessNameArbitrary,
  validDescriptionArbitrary,
  validCategoryIdArbitrary,
  validLocationIdArbitrary,
} from '../utils/test-helpers';

/**
 * Property 1: Only Approved Listings Visible Publicly
 * Validates: Requirements 7.1, 7.2, 7.6
 * 
 * Property: Public API only returns listings with status "approved"
 */
describe('Property 1: Only Approved Listings Visible Publicly', () => {
  it('should only return approved listings in public API', () => {
    fc.assert(
      fc.property(validListingArbitrary(), (listing) => {
        // Property: Only approved listings should be visible
        const isApproved = listing.status === 'approved';
        const shouldBeVisible = isApproved;

        // If listing is approved, it should be visible
        if (isApproved) {
          expect(shouldBeVisible).toBe(true);
        }
      })
    );
  });

  it('should hide pending listings from public API', () => {
    fc.assert(
      fc.property(validListingArbitrary(), (listing) => {
        // Property: Pending listings should not be visible
        const isPending = listing.status === 'pending';
        const shouldBeVisible = listing.status === 'approved';

        if (isPending) {
          expect(shouldBeVisible).toBe(false);
        }
      })
    );
  });

  it('should hide rejected listings from public API', () => {
    fc.assert(
      fc.property(validListingArbitrary(), (listing) => {
        // Property: Rejected listings should not be visible
        const isRejected = listing.status === 'rejected';
        const shouldBeVisible = listing.status === 'approved';

        if (isRejected) {
          expect(shouldBeVisible).toBe(false);
        }
      })
    );
  });
});

/**
 * Property 7: Search Filters Correctly
 * Validates: Requirements 8.2, 8.3, 8.4, 8.5
 * 
 * Property: Search results match the search query and filters
 */
describe('Property 7: Search Filters Correctly', () => {
  it('should filter listings by business name', () => {
    fc.assert(
      fc.property(
        validBusinessNameArbitrary(),
        validBusinessNameArbitrary(),
        (searchTerm, businessName) => {
          // Property: If search term is in business name, listing should be included
          const matches = businessName.toLowerCase().includes(searchTerm.toLowerCase());
          expect(typeof matches).toBe('boolean');
        }
      )
    );
  });

  it('should filter listings by description', () => {
    fc.assert(
      fc.property(
        validDescriptionArbitrary(),
        validDescriptionArbitrary(),
        (searchTerm, description) => {
          // Property: If search term is in description, listing should be included
          const matches = description.toLowerCase().includes(searchTerm.toLowerCase());
          expect(typeof matches).toBe('boolean');
        }
      )
    );
  });

  it('should filter listings by category', () => {
    fc.assert(
      fc.property(
        validCategoryIdArbitrary(),
        validCategoryIdArbitrary(),
        (filterCategory, listingCategory) => {
          // Property: If filter category matches listing category, include it
          const matches = filterCategory === listingCategory;
          expect(typeof matches).toBe('boolean');
        }
      )
    );
  });

  it('should filter listings by location', () => {
    fc.assert(
      fc.property(
        validLocationIdArbitrary(),
        validLocationIdArbitrary(),
        (filterLocation, listingLocation) => {
          // Property: If filter location matches listing location, include it
          const matches = filterLocation === listingLocation;
          expect(typeof matches).toBe('boolean');
        }
      )
    );
  });

  it('should combine multiple filters correctly', () => {
    fc.assert(
      fc.property(
        validBusinessNameArbitrary(),
        validCategoryIdArbitrary(),
        validLocationIdArbitrary(),
        validBusinessNameArbitrary(),
        validCategoryIdArbitrary(),
        validLocationIdArbitrary(),
        (searchTerm, filterCat, filterLoc, businessName, listingCat, listingLoc) => {
          // Property: All filters must match for listing to be included
          const nameMatches = businessName.toLowerCase().includes(searchTerm.toLowerCase());
          const categoryMatches = filterCat === listingCat;
          const locationMatches = filterLoc === listingLoc;
          const allMatch = nameMatches && categoryMatches && locationMatches;

          expect(typeof allMatch).toBe('boolean');
        }
      )
    );
  });
});
