-- ============================================================
-- ENNAZAHA — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Project status enum
CREATE TYPE project_status AS ENUM ('coming_soon', 'ongoing', 'ready');

-- 2. Apartment availability enum
CREATE TYPE apartment_status AS ENUM ('available', 'reserved', 'sold');

-- 3. Projects table
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name_ar     TEXT NOT NULL,
  name_fr     TEXT NOT NULL,
  about_ar    TEXT DEFAULT '',
  about_fr    TEXT DEFAULT '',
  city_ar     TEXT DEFAULT '',
  city_fr     TEXT DEFAULT '',
  address     TEXT DEFAULT '',
  map_embed_url    TEXT DEFAULT '',
  cover_image_url  TEXT DEFAULT '',
  brochure_url     TEXT DEFAULT '',
  status      project_status NOT NULL DEFAULT 'coming_soon',
  price_from  BIGINT DEFAULT 0,
  delivery_date TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Apartment types (one project → many types)
CREATE TABLE apartment_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type_ar     TEXT NOT NULL DEFAULT '',
  type_fr     TEXT NOT NULL DEFAULT '',
  area_sqm    NUMERIC NOT NULL DEFAULT 0,
  status      apartment_status NOT NULL DEFAULT 'available',
  price_dzd   BIGINT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Project images (gallery)
CREATE TABLE project_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Indexes for performance
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_apartment_types_project ON apartment_types(project_id);
CREATE INDEX idx_project_images_project ON project_images(project_id);

-- 7. Auto-update updated_at on projects
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 8. Row Level Security (RLS)
-- Public can READ, only service_role can WRITE
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Read policies (public)
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Public can read apartment_types"
  ON apartment_types FOR SELECT USING (true);

CREATE POLICY "Public can read project_images"
  ON project_images FOR SELECT USING (true);

-- Write policies (anon key can also write for now — tighten later with service_role)
CREATE POLICY "Anon can insert projects"
  ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update projects"
  ON projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete projects"
  ON projects FOR DELETE USING (true);

CREATE POLICY "Anon can insert apartment_types"
  ON apartment_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update apartment_types"
  ON apartment_types FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete apartment_types"
  ON apartment_types FOR DELETE USING (true);

CREATE POLICY "Anon can insert project_images"
  ON project_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update project_images"
  ON project_images FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete project_images"
  ON project_images FOR DELETE USING (true);

-- 9. Storage bucket for project assets
-- NOTE: Run this separately if the SQL editor doesn't support storage API.
-- You can also create the bucket manually in the Supabase Dashboard:
--   Storage → New Bucket → Name: "project-assets" → Public: ON
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies — allow public read, authenticated/anon upload
CREATE POLICY "Public read project-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-assets');

CREATE POLICY "Allow upload to project-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-assets');

CREATE POLICY "Allow update project-assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-assets');

CREATE POLICY "Allow delete project-assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-assets');
