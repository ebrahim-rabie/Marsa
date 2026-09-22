-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 15: notifications
-- File: supabase/tables/15_notifications.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT,
    body TEXT,
    body_ar TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false,
    channel TEXT DEFAULT 'in_app',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
    ON notifications FOR SELECT 
    USING (user_id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Users can update their own notifications" 
    ON notifications FOR UPDATE 
    USING (user_id = (SELECT auth.uid()) OR is_admin());
