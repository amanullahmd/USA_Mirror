import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import './ListingForm.css';
import { Button } from '../components/ui/button';
import { authAPI } from '../services/api';

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  cityId: string;
  regionId: string;
  countryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

export function ListingForm() {
  const [isEdit, setIsEdit] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    categoryId: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    cityId: '',
    regionId: '',
    countryId: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Location[]>([]);
  const [regions, setRegions] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/listings/:id/edit');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      fetchRegions(formData.countryId);
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.regionId) {
      fetchCities(formData.regionId);
    }
  }, [formData.regionId]);

  const checkAuthAndLoadData = async () => {
    try {
      const session = await authAPI.session();
      if (!session.authenticated) {
        navigate('/auth/login');
        return;
      }

      // Load categories
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        setCategories(await catRes.json());
      }

      // Load countries
      const countRes = await fetch('/api/locations/countries');
      if (countRes.ok) {
        setCountries(await countRes.json());
      }

      // If editing, load listing data
      if (match && params?.id) {
        setIsEdit(true);
        setListingId(params.id);
        const listRes = await fetch(`/api/user/listings/${params.id}`);
        if (listRes.ok) {
          const listing = await listRes.json();
          setFormData({
            title: listing.title,
            description: listing.description,
            categoryId: listing.categoryId,
            phone: listing.phone,
            email: listing.email,
            website: listing.website || '',
            address: listing.address,
            cityId: listing.cityId,
            regionId: listing.regionId,
            countryId: listing.countryId,
          });

          // Load regions and cities for edit
          if (listing.countryId) {
            await fetchRegions(listing.countryId);
          }
          if (listing.regionId) {
            await fetchCities(listing.regionId);
          }
        }
      }
    } catch (err) {
      console.error(err);
      navigate('/auth/login');
    }
  };

  const fetchRegions = async (countryId: string) => {
    try {
      const res = await fetch(`/api/locations/regions/${countryId}`);
      if (res.ok) {
        setRegions(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCities = async (regionId: string) => {
    try {
      const res = await fetch(`/api/locations/cities/${regionId}`);
      if (res.ok) {
        setCities(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 255) newErrors.title = 'Title must be 255 characters or less';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 5000) newErrors.description = 'Description must be 5000 characters or less';

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.cityId) newErrors.cityId = 'City is required';
    if (!formData.regionId) newErrors.regionId = 'Region is required';
    if (!formData.countryId) newErrors.countryId = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/user/listings/${listingId}` : '/api/user/listings';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate('/dashboard/listings');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save listing');
      }
    } catch (err) {
      alert('An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="listing-form-page">
      <div className="listing-form-container">
        <h1>{isEdit ? 'Edit Listing' : 'Create New Listing'}</h1>

        <form onSubmit={handleSubmit} className="listing-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Business Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter business name"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter business description"
              rows={5}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Website */}
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website URL (optional)"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter business address"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          {/* Country */}
          <div className="form-group">
            <label htmlFor="countryId">Country *</label>
            <select
              id="countryId"
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              className={errors.countryId ? 'error' : ''}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.countryId && <span className="error-text">{errors.countryId}</span>}
          </div>

          {/* Region */}
          <div className="form-group">
            <label htmlFor="regionId">Region/State *</label>
            <select
              id="regionId"
              name="regionId"
              value={formData.regionId}
              onChange={handleChange}
              className={errors.regionId ? 'error' : ''}
              disabled={!formData.countryId}
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            {errors.regionId && <span className="error-text">{errors.regionId}</span>}
          </div>

          {/* City */}
          <div className="form-group">
            <label htmlFor="cityId">City *</label>
            <select
              id="cityId"
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              className={errors.cityId ? 'error' : ''}
              disabled={!formData.regionId}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityId && <span className="error-text">{errors.cityId}</span>}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Create Listing'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard/listings')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
