-- Initial Supabase Schema for Pioftina.gr / Posokanei Greece Meal Planning & Grocery Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Preferences
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  household_size INTEGER DEFAULT 4,
  preferred_supermarkets TEXT[] DEFAULT ARRAY['sklavenitis', 'ab_vasilopoulos', 'lidl'],
  prioritize_bulk BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Supermarkets tracked from posokanei.gov.gr
CREATE TABLE IF NOT EXISTS supermarkets (
  id TEXT PRIMARY KEY, -- e.g. 'sklavenitis', 'ab_vasilopoulos', 'lidl'
  name TEXT NOT NULL,
  country TEXT DEFAULT 'GR',
  logo_url TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Recipes Library
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL means public/system recipe
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  servings INTEGER DEFAULT 4,
  prep_time_minutes INTEGER DEFAULT 20,
  cook_time_minutes INTEGER DEFAULT 30,
  category TEXT DEFAULT 'traditional',
  image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Recipe Ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL, -- 'g', 'kg', 'ml', 'L', 'τεμ'
  category TEXT DEFAULT 'pantry', -- 'dairy', 'meat', 'produce', 'pantry', 'bakery'
  posokanei_query TEXT NOT NULL,
  notes TEXT
);

-- 5. Weekly Meal Plans
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Meal Plan Slots (Monday - Sunday)
CREATE TABLE IF NOT EXISTS meal_plan_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 0 AND day <= 6), -- 0 = Monday, 6 = Sunday
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  custom_title TEXT,
  servings INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Grocery Lists
CREATE TABLE IF NOT EXISTS grocery_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT 'Εβδομαδιαία Λίστα Αγορών',
  total_estimated_cost NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Grocery List Items
CREATE TABLE IF NOT EXISTS grocery_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grocery_list_id UUID NOT NULL REFERENCES grocery_lists(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  category TEXT NOT NULL,
  required_amount NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  product_id TEXT, -- Posokanei product ID (hex)
  product_name TEXT,
  retailer_id TEXT REFERENCES supermarkets(id) ON DELETE SET NULL,
  pack_size NUMERIC(10,2),
  pack_count INTEGER DEFAULT 1,
  estimated_price NUMERIC(10,2),
  surplus_amount NUMERIC(10,2) DEFAULT 0,
  is_checked BOOLEAN DEFAULT false,
  in_pantry BOOLEAN DEFAULT false,
  is_bulk_pack BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Pantry Items (Surplus & Stock)
CREATE TABLE IF NOT EXISTS pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_slots_plan ON meal_plan_slots(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_grocery_list_items_list ON grocery_list_items(grocery_list_id);
CREATE INDEX IF NOT EXISTS idx_pantry_items_user ON pantry_items(user_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

-- Public read for recipes marked as public
CREATE POLICY "Public recipes are viewable by everyone" ON recipes
  FOR SELECT USING (is_public = true);

-- User policies
CREATE POLICY "Users can manage their own profiles" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own recipes" ON recipes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own grocery lists" ON grocery_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own pantry items" ON pantry_items
  FOR ALL USING (auth.uid() = user_id);
