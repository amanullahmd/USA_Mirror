import { db } from "./db";
import { countries, regions, cities } from "@shared/schema";
import { eq } from "drizzle-orm";

// Major regions/states/provinces for important countries
const regionsByCountry: Record<string, Array<{ name: string; slug: string; type: string }>> = {
  // United States - 50 States
  "US": [
    { name: "Alabama", slug: "alabama", type: "state" },
    { name: "Alaska", slug: "alaska", type: "state" },
    { name: "Arizona", slug: "arizona", type: "state" },
    { name: "Arkansas", slug: "arkansas", type: "state" },
    { name: "California", slug: "california", type: "state" },
    { name: "Colorado", slug: "colorado", type: "state" },
    { name: "Connecticut", slug: "connecticut", type: "state" },
    { name: "Delaware", slug: "delaware", type: "state" },
    { name: "Florida", slug: "florida", type: "state" },
    { name: "Georgia", slug: "georgia-us", type: "state" },
    { name: "Hawaii", slug: "hawaii", type: "state" },
    { name: "Idaho", slug: "idaho", type: "state" },
    { name: "Illinois", slug: "illinois", type: "state" },
    { name: "Indiana", slug: "indiana", type: "state" },
    { name: "Iowa", slug: "iowa", type: "state" },
    { name: "Kansas", slug: "kansas", type: "state" },
    { name: "Kentucky", slug: "kentucky", type: "state" },
    { name: "Louisiana", slug: "louisiana", type: "state" },
    { name: "Maine", slug: "maine", type: "state" },
    { name: "Maryland", slug: "maryland", type: "state" },
    { name: "Massachusetts", slug: "massachusetts", type: "state" },
    { name: "Michigan", slug: "michigan", type: "state" },
    { name: "Minnesota", slug: "minnesota", type: "state" },
    { name: "Mississippi", slug: "mississippi", type: "state" },
    { name: "Missouri", slug: "missouri", type: "state" },
    { name: "Montana", slug: "montana", type: "state" },
    { name: "Nebraska", slug: "nebraska", type: "state" },
    { name: "Nevada", slug: "nevada", type: "state" },
    { name: "New Hampshire", slug: "new-hampshire", type: "state" },
    { name: "New Jersey", slug: "new-jersey", type: "state" },
    { name: "New Mexico", slug: "new-mexico", type: "state" },
    { name: "New York", slug: "new-york", type: "state" },
    { name: "North Carolina", slug: "north-carolina", type: "state" },
    { name: "North Dakota", slug: "north-dakota", type: "state" },
    { name: "Ohio", slug: "ohio", type: "state" },
    { name: "Oklahoma", slug: "oklahoma", type: "state" },
    { name: "Oregon", slug: "oregon", type: "state" },
    { name: "Pennsylvania", slug: "pennsylvania", type: "state" },
    { name: "Rhode Island", slug: "rhode-island", type: "state" },
    { name: "South Carolina", slug: "south-carolina", type: "state" },
    { name: "South Dakota", slug: "south-dakota", type: "state" },
    { name: "Tennessee", slug: "tennessee", type: "state" },
    { name: "Texas", slug: "texas", type: "state" },
    { name: "Utah", slug: "utah", type: "state" },
    { name: "Vermont", slug: "vermont", type: "state" },
    { name: "Virginia", slug: "virginia", type: "state" },
    { name: "Washington", slug: "washington-state", type: "state" },
    { name: "West Virginia", slug: "west-virginia", type: "state" },
    { name: "Wisconsin", slug: "wisconsin", type: "state" },
    { name: "Wyoming", slug: "wyoming", type: "state" },
  ],
  
  // Canada - Provinces and Territories
  "CA": [
    { name: "Alberta", slug: "alberta", type: "province" },
    { name: "British Columbia", slug: "british-columbia", type: "province" },
    { name: "Manitoba", slug: "manitoba", type: "province" },
    { name: "New Brunswick", slug: "new-brunswick", type: "province" },
    { name: "Newfoundland and Labrador", slug: "newfoundland-labrador", type: "province" },
    { name: "Nova Scotia", slug: "nova-scotia", type: "province" },
    { name: "Ontario", slug: "ontario", type: "province" },
    { name: "Prince Edward Island", slug: "prince-edward-island", type: "province" },
    { name: "Quebec", slug: "quebec", type: "province" },
    { name: "Saskatchewan", slug: "saskatchewan", type: "province" },
    { name: "Northwest Territories", slug: "northwest-territories", type: "territory" },
    { name: "Nunavut", slug: "nunavut", type: "territory" },
    { name: "Yukon", slug: "yukon", type: "territory" },
  ],
  
  // United Kingdom - Countries
  "GB": [
    { name: "England", slug: "england", type: "country" },
    { name: "Scotland", slug: "scotland", type: "country" },
    { name: "Wales", slug: "wales", type: "country" },
    { name: "Northern Ireland", slug: "northern-ireland", type: "country" },
  ],
  
  // India - States and Union Territories
  "IN": [
    { name: "Andhra Pradesh", slug: "andhra-pradesh", type: "state" },
    { name: "Arunachal Pradesh", slug: "arunachal-pradesh", type: "state" },
    { name: "Assam", slug: "assam", type: "state" },
    { name: "Bihar", slug: "bihar", type: "state" },
    { name: "Chhattisgarh", slug: "chhattisgarh", type: "state" },
    { name: "Goa", slug: "goa", type: "state" },
    { name: "Gujarat", slug: "gujarat", type: "state" },
    { name: "Haryana", slug: "haryana", type: "state" },
    { name: "Himachal Pradesh", slug: "himachal-pradesh", type: "state" },
    { name: "Jharkhand", slug: "jharkhand", type: "state" },
    { name: "Karnataka", slug: "karnataka", type: "state" },
    { name: "Kerala", slug: "kerala", type: "state" },
    { name: "Madhya Pradesh", slug: "madhya-pradesh", type: "state" },
    { name: "Maharashtra", slug: "maharashtra", type: "state" },
    { name: "Manipur", slug: "manipur", type: "state" },
    { name: "Meghalaya", slug: "meghalaya", type: "state" },
    { name: "Mizoram", slug: "mizoram", type: "state" },
    { name: "Nagaland", slug: "nagaland", type: "state" },
    { name: "Odisha", slug: "odisha", type: "state" },
    { name: "Punjab", slug: "punjab", type: "state" },
    { name: "Rajasthan", slug: "rajasthan", type: "state" },
    { name: "Sikkim", slug: "sikkim", type: "state" },
    { name: "Tamil Nadu", slug: "tamil-nadu", type: "state" },
    { name: "Telangana", slug: "telangana", type: "state" },
    { name: "Tripura", slug: "tripura", type: "state" },
    { name: "Uttar Pradesh", slug: "uttar-pradesh", type: "state" },
    { name: "Uttarakhand", slug: "uttarakhand", type: "state" },
    { name: "West Bengal", slug: "west-bengal", type: "state" },
    { name: "Andaman and Nicobar Islands", slug: "andaman-nicobar", type: "union territory" },
    { name: "Chandigarh", slug: "chandigarh", type: "union territory" },
    { name: "Dadra and Nagar Haveli and Daman and Diu", slug: "dadra-nagar-haveli-daman-diu", type: "union territory" },
    { name: "Delhi", slug: "delhi", type: "union territory" },
    { name: "Jammu and Kashmir", slug: "jammu-kashmir", type: "union territory" },
    { name: "Ladakh", slug: "ladakh", type: "union territory" },
    { name: "Lakshadweep", slug: "lakshadweep", type: "union territory" },
    { name: "Puducherry", slug: "puducherry", type: "union territory" },
  ],
  
  // Australia - States and Territories
  "AU": [
    { name: "New South Wales", slug: "new-south-wales", type: "state" },
    { name: "Queensland", slug: "queensland", type: "state" },
    { name: "South Australia", slug: "south-australia", type: "state" },
    { name: "Tasmania", slug: "tasmania", type: "state" },
    { name: "Victoria", slug: "victoria", type: "state" },
    { name: "Western Australia", slug: "western-australia", type: "state" },
    { name: "Australian Capital Territory", slug: "australian-capital-territory", type: "territory" },
    { name: "Northern Territory", slug: "northern-territory", type: "territory" },
  ],
  
  // China - Provinces
  "CN": [
    { name: "Anhui", slug: "anhui", type: "province" },
    { name: "Beijing", slug: "beijing", type: "municipality" },
    { name: "Chongqing", slug: "chongqing", type: "municipality" },
    { name: "Fujian", slug: "fujian", type: "province" },
    { name: "Gansu", slug: "gansu", type: "province" },
    { name: "Guangdong", slug: "guangdong", type: "province" },
    { name: "Guangxi", slug: "guangxi", type: "autonomous region" },
    { name: "Guizhou", slug: "guizhou", type: "province" },
    { name: "Hainan", slug: "hainan", type: "province" },
    { name: "Hebei", slug: "hebei", type: "province" },
    { name: "Heilongjiang", slug: "heilongjiang", type: "province" },
    { name: "Henan", slug: "henan", type: "province" },
    { name: "Hong Kong", slug: "hong-kong", type: "special administrative region" },
    { name: "Hubei", slug: "hubei", type: "province" },
    { name: "Hunan", slug: "hunan", type: "province" },
    { name: "Inner Mongolia", slug: "inner-mongolia", type: "autonomous region" },
    { name: "Jiangsu", slug: "jiangsu", type: "province" },
    { name: "Jiangxi", slug: "jiangxi", type: "province" },
    { name: "Jilin", slug: "jilin", type: "province" },
    { name: "Liaoning", slug: "liaoning", type: "province" },
    { name: "Macau", slug: "macau", type: "special administrative region" },
    { name: "Ningxia", slug: "ningxia", type: "autonomous region" },
    { name: "Qinghai", slug: "qinghai", type: "province" },
    { name: "Shaanxi", slug: "shaanxi", type: "province" },
    { name: "Shandong", slug: "shandong", type: "province" },
    { name: "Shanghai", slug: "shanghai", type: "municipality" },
    { name: "Shanxi", slug: "shanxi", type: "province" },
    { name: "Sichuan", slug: "sichuan", type: "province" },
    { name: "Tianjin", slug: "tianjin", type: "municipality" },
    { name: "Tibet", slug: "tibet", type: "autonomous region" },
    { name: "Xinjiang", slug: "xinjiang", type: "autonomous region" },
    { name: "Yunnan", slug: "yunnan", type: "province" },
    { name: "Zhejiang", slug: "zhejiang", type: "province" },
  ],
  
  // Germany - States
  "DE": [
    { name: "Baden-Württemberg", slug: "baden-wurttemberg", type: "state" },
    { name: "Bavaria", slug: "bavaria", type: "state" },
    { name: "Berlin", slug: "berlin", type: "state" },
    { name: "Brandenburg", slug: "brandenburg", type: "state" },
    { name: "Bremen", slug: "bremen", type: "state" },
    { name: "Hamburg", slug: "hamburg", type: "state" },
    { name: "Hesse", slug: "hesse", type: "state" },
    { name: "Lower Saxony", slug: "lower-saxony", type: "state" },
    { name: "Mecklenburg-Vorpommern", slug: "mecklenburg-vorpommern", type: "state" },
    { name: "North Rhine-Westphalia", slug: "north-rhine-westphalia", type: "state" },
    { name: "Rhineland-Palatinate", slug: "rhineland-palatinate", type: "state" },
    { name: "Saarland", slug: "saarland", type: "state" },
    { name: "Saxony", slug: "saxony", type: "state" },
    { name: "Saxony-Anhalt", slug: "saxony-anhalt", type: "state" },
    { name: "Schleswig-Holstein", slug: "schleswig-holstein", type: "state" },
    { name: "Thuringia", slug: "thuringia", type: "state" },
  ],
  
  // France - Regions
  "FR": [
    { name: "Auvergne-Rhône-Alpes", slug: "auvergne-rhone-alpes", type: "region" },
    { name: "Bourgogne-Franche-Comté", slug: "bourgogne-franche-comte", type: "region" },
    { name: "Brittany", slug: "brittany", type: "region" },
    { name: "Centre-Val de Loire", slug: "centre-val-de-loire", type: "region" },
    { name: "Corsica", slug: "corsica", type: "region" },
    { name: "Grand Est", slug: "grand-est", type: "region" },
    { name: "Hauts-de-France", slug: "hauts-de-france", type: "region" },
    { name: "Île-de-France", slug: "ile-de-france", type: "region" },
    { name: "Normandy", slug: "normandy", type: "region" },
    { name: "Nouvelle-Aquitaine", slug: "nouvelle-aquitaine", type: "region" },
    { name: "Occitanie", slug: "occitanie", type: "region" },
    { name: "Pays de la Loire", slug: "pays-de-la-loire", type: "region" },
    { name: "Provence-Alpes-Côte d'Azur", slug: "provence-alpes-cote-azur", type: "region" },
  ],
  
  // Brazil - States
  "BR": [
    { name: "Acre", slug: "acre", type: "state" },
    { name: "Alagoas", slug: "alagoas", type: "state" },
    { name: "Amapá", slug: "amapa", type: "state" },
    { name: "Amazonas", slug: "amazonas", type: "state" },
    { name: "Bahia", slug: "bahia", type: "state" },
    { name: "Ceará", slug: "ceara", type: "state" },
    { name: "Distrito Federal", slug: "distrito-federal", type: "federal district" },
    { name: "Espírito Santo", slug: "espirito-santo", type: "state" },
    { name: "Goiás", slug: "goias", type: "state" },
    { name: "Maranhão", slug: "maranhao", type: "state" },
    { name: "Mato Grosso", slug: "mato-grosso", type: "state" },
    { name: "Mato Grosso do Sul", slug: "mato-grosso-do-sul", type: "state" },
    { name: "Minas Gerais", slug: "minas-gerais", type: "state" },
    { name: "Pará", slug: "para", type: "state" },
    { name: "Paraíba", slug: "paraiba", type: "state" },
    { name: "Paraná", slug: "parana", type: "state" },
    { name: "Pernambuco", slug: "pernambuco", type: "state" },
    { name: "Piauí", slug: "piaui", type: "state" },
    { name: "Rio de Janeiro", slug: "rio-de-janeiro", type: "state" },
    { name: "Rio Grande do Norte", slug: "rio-grande-do-norte", type: "state" },
    { name: "Rio Grande do Sul", slug: "rio-grande-do-sul", type: "state" },
    { name: "Rondônia", slug: "rondonia", type: "state" },
    { name: "Roraima", slug: "roraima", type: "state" },
    { name: "Santa Catarina", slug: "santa-catarina", type: "state" },
    { name: "São Paulo", slug: "sao-paulo", type: "state" },
    { name: "Sergipe", slug: "sergipe", type: "state" },
    { name: "Tocantins", slug: "tocantins", type: "state" },
  ],
  
  // Mexico - States
  "MX": [
    { name: "Aguascalientes", slug: "aguascalientes", type: "state" },
    { name: "Baja California", slug: "baja-california", type: "state" },
    { name: "Baja California Sur", slug: "baja-california-sur", type: "state" },
    { name: "Campeche", slug: "campeche", type: "state" },
    { name: "Chiapas", slug: "chiapas", type: "state" },
    { name: "Chihuahua", slug: "chihuahua", type: "state" },
    { name: "Coahuila", slug: "coahuila", type: "state" },
    { name: "Colima", slug: "colima", type: "state" },
    { name: "Durango", slug: "durango", type: "state" },
    { name: "Guanajuato", slug: "guanajuato", type: "state" },
    { name: "Guerrero", slug: "guerrero", type: "state" },
    { name: "Hidalgo", slug: "hidalgo", type: "state" },
    { name: "Jalisco", slug: "jalisco", type: "state" },
    { name: "México", slug: "mexico-state", type: "state" },
    { name: "Mexico City", slug: "mexico-city", type: "federal district" },
    { name: "Michoacán", slug: "michoacan", type: "state" },
    { name: "Morelos", slug: "morelos", type: "state" },
    { name: "Nayarit", slug: "nayarit", type: "state" },
    { name: "Nuevo León", slug: "nuevo-leon", type: "state" },
    { name: "Oaxaca", slug: "oaxaca", type: "state" },
    { name: "Puebla", slug: "puebla", type: "state" },
    { name: "Querétaro", slug: "queretaro", type: "state" },
    { name: "Quintana Roo", slug: "quintana-roo", type: "state" },
    { name: "San Luis Potosí", slug: "san-luis-potosi", type: "state" },
    { name: "Sinaloa", slug: "sinaloa", type: "state" },
    { name: "Sonora", slug: "sonora", type: "state" },
    { name: "Tabasco", slug: "tabasco", type: "state" },
    { name: "Tamaulipas", slug: "tamaulipas", type: "state" },
    { name: "Tlaxcala", slug: "tlaxcala", type: "state" },
    { name: "Veracruz", slug: "veracruz", type: "state" },
    { name: "Yucatán", slug: "yucatan", type: "state" },
    { name: "Zacatecas", slug: "zacatecas", type: "state" },
  ],
};

export async function seedRegionsData() {
  try {
    console.log("Starting regions data seed...");
    
    let totalRegionsInserted = 0;
    
    for (const [countryCode, countryRegions] of Object.entries(regionsByCountry)) {
      // Find country by code
      const [country] = await db.select().from(countries).where(eq(countries.code, countryCode));
      
      if (!country) {
        console.warn(`Warning: Country ${countryCode} not found`);
        continue;
      }
      
      console.log(`\nInserting regions for ${country.name}...`);
      
      for (const region of countryRegions) {
        await db.insert(regions).values({
          name: region.name,
          slug: region.slug,
          countryId: country.id,
          type: region.type,
        });
        totalRegionsInserted++;
      }
      
      console.log(`✓ ${countryRegions.length} regions inserted for ${country.name}`);
    }
    
    console.log(`\n✅ Regions data seed completed successfully!`);
    console.log(`Total: ${totalRegionsInserted} regions inserted across ${Object.keys(regionsByCountry).length} countries`);
    
  } catch (error) {
    console.error("Error seeding regions data:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRegionsData()
    .then(() => {
      console.log("\n✅ Regions seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Regions seeding failed:", error);
      process.exit(1);
    });
}
