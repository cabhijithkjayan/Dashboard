/*
# Create community_submissions table

1. New Tables
- `community_submissions`
  - `id` (uuid, primary key)
  - `full_name` (text, not null)
  - `email` (text, not null)
  - `phone` (text)
  - `city` (text)
  - `linkedin` (text)
  - `job_title` (text)
  - `company` (text)
  - `experience_years` (text)
  - `industry` (text)
  - `skills` (text[])
  - `qualification` (text)
  - `certifications` (text[])
  - `open_to` (text)
  - `preferred` (text)
  - `notice` (text)
  - `expected_salary` (text)
  - `source` (text)
  - `consent` (boolean, default false)
  - `cv_file_name` (text)
  - `cv_mime` (text)
  - `cv_base64` (text)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `community_submissions`.
- Allow anon + authenticated INSERT only (public form submissions).
- No SELECT/UPDATE/DELETE from the anon key (admin reads via service role in edge function or Supabase admin).

3. Notes
- This is a no-auth public form. Anyone can submit, but cannot read other submissions.
- Admin access is through the service role key in edge functions, not through RLS.
*/

CREATE TABLE IF NOT EXISTS community_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  linkedin text,
  job_title text,
  company text,
  experience_years text,
  industry text,
  skills text[] DEFAULT '{}',
  qualification text,
  certifications text[] DEFAULT '{}',
  open_to text,
  preferred text,
  notice text,
  expected_salary text,
  source text,
  consent boolean NOT NULL DEFAULT false,
  cv_file_name text,
  cv_mime text,
  cv_base64 text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_submissions" ON community_submissions;
CREATE POLICY "anon_insert_submissions" ON community_submissions FOR INSERT
TO anon, authenticated WITH CHECK (true);
