-- Blue Harbour Aquarium — database schema
-- Each zone is a themed marine area of the aquarium.
-- Each experience belongs to exactly one zone (one-to-many).
-- FAQs and contact enquiries are independent tables.

DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS zones;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS enquiries;

CREATE TABLE zones (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  name          TEXT    NOT NULL,
  tagline       TEXT    NOT NULL,
  description   TEXT    NOT NULL,
  conservation  TEXT    NOT NULL,
  image_file    TEXT    NOT NULL,
  image_alt     TEXT    NOT NULL,
  image_credit  TEXT    NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE experiences (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id      INTEGER NOT NULL,
  name         TEXT    NOT NULL,
  type         TEXT    NOT NULL CHECK (type IN ('Tank exhibit', 'Interactive', 'Talk', 'Hands-on')),
  description  TEXT    NOT NULL,
  duration     TEXT,
  accessibility TEXT,
  sensory_note TEXT,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);

CREATE TABLE faqs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  category      TEXT    NOT NULL,
  question      TEXT    NOT NULL,
  answer        TEXT    NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE enquiries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  subject      TEXT    NOT NULL,
  message      TEXT    NOT NULL,
  submitted_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_experiences_zone ON experiences(zone_id);
CREATE INDEX idx_faqs_category ON faqs(category);