-- Migration: 20261101000000_add_blog_to_profile.sql
-- Description: Add blog column to profile table

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS blog text;
