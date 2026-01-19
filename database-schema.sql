-- CEDO Onboarding Database Schema
-- Run this SQL in the Neon SQL Editor to create all required tables

-- Main onboarding submissions table
CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Step 1: Brand Assets
  logos TEXT,
  light_background_version BOOLEAN DEFAULT FALSE,
  dark_background_version BOOLEAN DEFAULT FALSE,
  brand_guidelines TEXT,
  brand_notes TEXT,
  
  -- Step 2: Car Information
  chassis VARCHAR(255),
  engine VARCHAR(255),
  other_specifications TEXT,
  car_images TEXT,
  plain_white_background BOOLEAN DEFAULT FALSE,
  multiple_angles BOOLEAN DEFAULT FALSE,
  
  -- Step 3: Photography
  event_photography TEXT,
  photography_types JSONB DEFAULT '[]',
  
  -- Step 5: Team & Staff
  team_background TEXT,
  
  -- Step 6: Event Preferences
  indycar_only BOOLEAN DEFAULT FALSE,
  include_indycar_nxt BOOLEAN DEFAULT FALSE,
  acknowledge_schedule_source BOOLEAN DEFAULT FALSE,
  event_types JSONB DEFAULT '[]',
  
  -- Step 7: FAQs
  use_default_faqs BOOLEAN DEFAULT TRUE,
  special_notes TEXT,
  
  -- Step 8: Review & Submit
  assets_approved BOOLEAN DEFAULT FALSE,
  additional_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  hometown VARCHAR(255),
  current_residence VARCHAR(255),
  birthdate VARCHAR(50),
  instagram VARCHAR(500),
  facebook VARCHAR(500),
  twitter VARCHAR(500),
  tiktok VARCHAR(500),
  merchandise_store VARCHAR(500),
  driver_bio TEXT,
  headshot TEXT,
  hero_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_id) REFERENCES onboarding_submissions(reference_id) ON DELETE CASCADE
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) NOT NULL,
  track_name VARCHAR(255) NOT NULL,
  track_images TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_id) REFERENCES onboarding_submissions(reference_id) ON DELETE CASCADE
);

-- Experiential events table
CREATE TABLE IF NOT EXISTS experiential_events (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_id) REFERENCES onboarding_submissions(reference_id) ON DELETE CASCADE
);

-- Ownership table
CREATE TABLE IF NOT EXISTS ownership (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  headshot TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_id) REFERENCES onboarding_submissions(reference_id) ON DELETE CASCADE
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  email VARCHAR(255),
  mobile VARCHAR(50),
  role_on_site VARCHAR(255),
  headshot TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_id) REFERENCES onboarding_submissions(reference_id) ON DELETE CASCADE
);

-- Custom FAQs table
CREATE TABLE IF NOT EXISTS custom_faqs (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_id) REFERENCES onboarding_submissions(reference_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_drivers_reference_id ON drivers(reference_id);
CREATE INDEX IF NOT EXISTS idx_tracks_reference_id ON tracks(reference_id);
CREATE INDEX IF NOT EXISTS idx_experiential_events_reference_id ON experiential_events(reference_id);
CREATE INDEX IF NOT EXISTS idx_ownership_reference_id ON ownership(reference_id);
CREATE INDEX IF NOT EXISTS idx_staff_reference_id ON staff(reference_id);
CREATE INDEX IF NOT EXISTS idx_custom_faqs_reference_id ON custom_faqs(reference_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_created_at ON onboarding_submissions(created_at);
