-- Run this in your Supabase SQL Editor to create the necessary tables for BloomCare

-- 1. Create the PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  name text,
  age integer,
  weight numeric,
  height numeric,
  blood_group text,
  pregnant_status text,
  pregnant_weeks integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Allow users to insert/update their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create WATER LOGS table (optional, for water tracking)
CREATE TABLE IF NOT EXISTS public.water_logs (
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  current_ml integer DEFAULT 0,
  target_ml integer DEFAULT 2500,
  PRIMARY KEY (user_id, date)
);
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own water logs" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own water logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id);

-- 3. Create MEAL LOGS table (optional, for meal tracking)
CREATE TABLE IF NOT EXISTS public.meal_logs (
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  meal_type text NOT NULL,
  items text,
  PRIMARY KEY (user_id, date, meal_type)
);
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own meal logs" ON public.meal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own meal logs" ON public.meal_logs FOR ALL USING (auth.uid() = user_id);
