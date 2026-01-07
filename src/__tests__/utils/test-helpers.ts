import * as fc from 'fast-check';

/**
 * Arbitraries for property-based testing
 */

export const validEmailArbitrary = () =>
  fc.emailAddress().filter(email => email.length <= 255);

export const validBusinessNameArbitrary = () =>
  fc.stringMatching(/^[a-zA-Z0-9\s\-&'.,]{1,255}$/).filter(s => s.length > 0);

export const validDescriptionArbitrary = () =>
  fc.stringMatching(/^[a-zA-Z0-9\s\-&'.,!?()]{1,1000}$/).filter(s => s.length > 0);

export const validPhoneArbitrary = () =>
  fc.stringMatching(/^[\d\-\+\(\)\s]{10,20}$/);

export const validUrlArbitrary = () =>
  fc.webUrl().filter(url => url.length <= 500);

export const validAddressArbitrary = () =>
  fc.stringMatching(/^[a-zA-Z0-9\s\-.,#]{1,255}$/).filter(s => s.length > 0);

export const validCityArbitrary = () =>
  fc.stringMatching(/^[a-zA-Z\s\-]{1,100}$/).filter(s => s.length > 0);

export const validRegionArbitrary = () =>
  fc.stringMatching(/^[a-zA-Z\s\-]{1,100}$/).filter(s => s.length > 0);

export const validCountryArbitrary = () =>
  fc.stringMatching(/^[a-zA-Z\s\-]{1,100}$/).filter(s => s.length > 0);

export const validCategoryIdArbitrary = () =>
  fc.integer({ min: 1, max: 100 });

export const validLocationIdArbitrary = () =>
  fc.integer({ min: 1, max: 10000 });

export const validUserIdArbitrary = () =>
  fc.integer({ min: 1, max: 1000000 });

export const validListingIdArbitrary = () =>
  fc.integer({ min: 1, max: 10000000 });

export const listingStatusArbitrary = () =>
  fc.constantFrom('pending', 'approved', 'rejected');

export const validListingArbitrary = () =>
  fc.record({
    id: validListingIdArbitrary(),
    userId: validUserIdArbitrary(),
    businessName: validBusinessNameArbitrary(),
    description: validDescriptionArbitrary(),
    categoryId: validCategoryIdArbitrary(),
    phone: validPhoneArbitrary(),
    email: validEmailArbitrary(),
    website: fc.option(validUrlArbitrary()),
    address: validAddressArbitrary(),
    city: validCityArbitrary(),
    region: validRegionArbitrary(),
    country: validCountryArbitrary(),
    status: listingStatusArbitrary(),
    createdAt: fc.date(),
    updatedAt: fc.date(),
  });

export const invalidEmailArbitrary = () =>
  fc.stringOf(fc.char()).filter(s => !s.includes('@') || s.length > 255);

export const invalidBusinessNameArbitrary = () =>
  fc.stringOf(fc.char()).filter(s => s.length === 0 || s.length > 255);

export const invalidPhoneArbitrary = () =>
  fc.stringOf(fc.char()).filter(s => s.length < 10 || s.length > 20);
