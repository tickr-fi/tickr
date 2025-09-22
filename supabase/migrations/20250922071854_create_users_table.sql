-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  public_key text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read only their own row
CREATE POLICY "users can read their own data"
ON public.users
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Create policy for authenticated users to insert their own row
CREATE POLICY "authenticated users can insert users"
ON public.users
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Create policy for authenticated users to update their own row
CREATE POLICY "authenticated users can update users"
ON public.users
FOR UPDATE TO authenticated
USING (auth.uid() = id);
