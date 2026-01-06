import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function emojiFlag(iso2?: string) {
  if (!iso2) return '🏳️';
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map((c) => 0x1f1e6 - 65 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

async function upsertCountry(
  client: pg.PoolClient,
  name: string,
  code: string,
  continent?: string,
  emoji?: string,
  phoneCode?: string
) {
  const slug = slugify(name);
  const flag = emoji || emojiFlag(code);
  const sql = `
    INSERT INTO countries (name, slug, code, flag, continent, phone_code)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (code) DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug,
      flag = EXCLUDED.flag,
      continent = EXCLUDED.continent,
      phone_code = EXCLUDED.phone_code,
      updated_at = now()
    RETURNING id
  `;
  const res = await client.query(sql, [name, slug, code, flag, continent || null, phoneCode || null]);
  return res.rows[0].id as number;
}

async function ensureRegion(
  client: pg.PoolClient,
  name: string,
  countryId: number
) {
  const slug = slugify(name);
  const existing = await client.query(
    `SELECT id FROM regions WHERE slug = $1 AND country_id = $2 LIMIT 1`,
    [slug, countryId]
  );
  if (existing.rows[0]?.id) return existing.rows[0].id as number;
  const res = await client.query(
    `INSERT INTO regions (name, slug, country_id) VALUES ($1, $2, $3) RETURNING id`,
    [name, slug, countryId]
  );
  return res.rows[0].id as number;
}

async function ensureCity(
  client: pg.PoolClient,
  name: string,
  countryId: number,
  regionId?: number
) {
  const slug = slugify(name);
  const existing = await client.query(
    `SELECT id FROM cities WHERE slug = $1 AND country_id = $2 AND (region_id IS NOT DISTINCT FROM $3) LIMIT 1`,
    [slug, countryId, regionId ?? null]
  );
  if (existing.rows[0]?.id) return existing.rows[0].id as number;
  const res = await client.query(
    `INSERT INTO cities (name, slug, country_id, region_id) VALUES ($1, $2, $3, $4)
     ON CONFLICT (name, country_id) DO NOTHING
     RETURNING id`,
    [name, slug, countryId, regionId ?? null]
  );
  if (res.rows[0]?.id) return res.rows[0].id as number;
  const fallback = await client.query(
    `SELECT id FROM cities WHERE name = $1 AND country_id = $2 LIMIT 1`,
    [name, countryId]
  );
  return fallback.rows[0]?.id as number;
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required');

  const countriesPath = path.resolve('data/locations/countries.json');
  const statesPath = path.resolve('data/locations/states.json');
  const citiesPath = path.resolve('data/locations/cities.json');

  if (!fs.existsSync(countriesPath) || !fs.existsSync(statesPath)) {
    throw new Error('countries.json or states.json not found in data/locations/');
  }

  const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));
  const statesData = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
  let citiesData: any[] = [];
  if (fs.existsSync(citiesPath)) {
    citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
  } else {
    const citiesCsvPath = path.resolve('data/locations/cities.csv');
    if (fs.existsSync(citiesCsvPath)) {
      const raw = fs.readFileSync(citiesCsvPath, 'utf-8');
      const [headerLine, ...lines] = raw.split(/\r?\n/).filter(Boolean);
      const headers = headerLine.split(',');
      const idx = {
        id: headers.indexOf('id'),
        name: headers.indexOf('name'),
        state_id: headers.indexOf('state_id'),
        country_id: headers.indexOf('country_id'),
        country_code: headers.indexOf('country_code'),
      };
      citiesData = lines.map((line) => {
        const cols = line.split(',');
        return {
          id: Number(cols[idx.id]),
          name: cols[idx.name],
          state_id: Number(cols[idx.state_id]),
          country_id: Number(cols[idx.country_id]),
          country_code: cols[idx.country_code],
        };
      });
    }
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const datasetCountryIdToDbId = new Map<number, number>();
    const datasetStateIdToDbId = new Map<number, number>();

    // Countries
    for (const c of countriesData) {
      const dbId = await upsertCountry(client, c.name, c.iso2, c.region, c.emoji, c.phone_code || c.phonecode);
      datasetCountryIdToDbId.set(Number(c.id), dbId);
    }
    console.log(`✓ Imported/updated ${countriesData.length} countries`);

    // States/Regions
    try {
      for (const s of statesData) {
        const countryId = datasetCountryIdToDbId.get(Number(s.country_id));
        if (!countryId) continue;
        const regionId = await ensureRegion(client, s.name, countryId);
        datasetStateIdToDbId.set(Number(s.id), regionId);
      }
      console.log(`✓ Imported/ensured ${statesData.length} regions`);
    } catch (err) {
      console.error('Failed importing states/regions:', err);
    }

    // Cities: import strategy
    const importAll = process.env.IMPORT_ALL_CITIES === 'true';
    const onlyCountryCode = process.env.CITY_COUNTRY_CODE; // e.g. 'BD'
    let importedCities = 0;
    for (const city of citiesData) {
      const countryId = datasetCountryIdToDbId.get(Number(city.country_id));
      if (!countryId) continue;
      // If not importing all, restrict by configured country code or default to US
      if (!importAll) {
        const codeToKeep = onlyCountryCode || 'US';
        const match = city.country_code
          ? city.country_code === codeToKeep
          : (() => {
              const cRec = countriesData.find((c: any) => Number(c.id) === Number(city.country_id));
              return cRec?.iso2 === codeToKeep;
            })();
        if (!match) continue;
      }
      const regionId = datasetStateIdToDbId.get(Number(city.state_id));
      await ensureCity(client, city.name, countryId, regionId);
      importedCities++;
      if (importedCities % 5000 === 0) console.log(`… imported ${importedCities} cities`);
    }
    console.log(`✓ Imported ${importedCities} cities`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
