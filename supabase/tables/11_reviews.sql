-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 11: reviews
-- File: supabase/tables/11_reviews.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
    communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
    delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    comment TEXT,
    comment_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_supplier_id ON reviews(supplier_id);

-- Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" 
    ON reviews FOR SELECT 
    USING (true);

CREATE POLICY "Buyers can insert reviews" 
    ON reviews FOR INSERT 
    WITH CHECK (reviewer_id = (SELECT auth.uid()) OR is_admin());
