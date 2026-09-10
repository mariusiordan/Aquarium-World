import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'aquarium.db');

const isNewDatabase = !fs.existsSync(DB_PATH);
const db = new sqlite3.Database(DB_PATH);


function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

export async function initialiseDatabase() {

  await exec('PRAGMA foreign_keys = ON');

  if (isNewDatabase) {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await exec(schema);
    await exec(seed);
    console.log('Database created and seeded.');
  }
}

export function getAllZones() {
  return all('SELECT * FROM zones ORDER BY display_order');
}

export function getZoneBySlug(slug) {
  return get('SELECT * FROM zones WHERE slug = ?', [slug]);
}

export function getExperiencesByZoneId(zoneId) {
  return all('SELECT * FROM experiences WHERE zone_id = ? ORDER BY id', [zoneId]);
}

export function getAllExperiences() {
  return all(`
    SELECT experiences.*, zones.name AS zone_name, zones.slug AS zone_slug
    FROM experiences
    JOIN zones ON zones.id = experiences.zone_id
    ORDER BY zones.display_order, experiences.id
  `);
}

export async function getFaqsByCategory() {
  const rows = await all('SELECT * FROM faqs ORDER BY display_order');

  // Group into categories so the view can render one section per category
  return rows.reduce((groups, row) => {
    (groups[row.category] ||= []).push(row);
    return groups;
  }, {});
}

export function saveEnquiry({ name, email, subject, message }) {
  return run(
    'INSERT INTO enquiries (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message]
  );
}

export default db;

export function searchExperiences(term, type, zone) {
  var sql = `
    SELECT experiences.*, zones.name AS zone_name, zones.slug AS zone_slug
    FROM experiences
    JOIN zones ON zones.id = experiences.zone_id
    WHERE (experiences.name LIKE ? OR experiences.description LIKE ? OR zones.name LIKE ?)
  `;
  const pattern = `%${term}%`;
  const params = [pattern, pattern, pattern];

  if (type && type !== 'all') {
    sql += ' AND experiences.type = ?';
    params.push(type);
  }

  if (zone && zone !== 'all') {
    sql += ' AND zones.slug = ?';
    params.push(zone);
  }

  sql += ' ORDER BY zones.display_order, experiences.id';

  return all(sql, params);
}