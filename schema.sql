-- ==============================================================================
-- GLOBAL SHINING ROCKS - SUPABASE DATABASE & STORAGE SCHEMA
-- Execute this script in your Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    desc_en TEXT,
    desc_ar TEXT,
    image TEXT,
    density TEXT DEFAULT '2680',
    water_absorption TEXT DEFAULT '0.16',
    compressive_strength TEXT DEFAULT '128',
    flexural_strength TEXT DEFAULT '14.2',
    finishes_en TEXT DEFAULT 'Polished / Honed',
    finishes_ar TEXT DEFAULT 'مصقول / مطفي',
    thickness_en TEXT DEFAULT '20mm, 30mm, Custom',
    thickness_ar TEXT DEFAULT '٢٠ ملم، ٣٠ ملم، حسب الطلب',
    max_panel_en TEXT DEFAULT '3000 × 1800 mm',
    max_panel_ar TEXT DEFAULT '٣٠٠٠ × ١٨٠٠ ملم',
    lead_time_en TEXT DEFAULT '7-14 days',
    lead_time_ar TEXT DEFAULT '٧-١٤ يوم',
    datasheet_url TEXT DEFAULT '#enquiry',
    active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Access (Anyone can view active products on the website)
CREATE POLICY "Allow public read-only access on products"
ON public.products
FOR SELECT
USING (true);

-- 4. Authenticated / Admin Write Access
CREATE POLICY "Allow full access to authenticated admins"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Insert Initial Default Catalog Data
INSERT INTO public.products (id, name_en, name_ar, desc_en, desc_ar, image, density, water_absorption, compressive_strength, finishes_en, finishes_ar, thickness_en, thickness_ar, max_panel_en, max_panel_ar, lead_time_en, lead_time_ar, active, sort_order)
VALUES 
(
    'stone-oman-marble',
    'Oman Marble (Desert Rose / Beige)',
    'رخام عُمان (بيج صحراوي كلاسيك)',
    'Uniform warm beige with delicate earth veins. Blocks, slabs, and cut-to-size panels extracted directly from our Ibri quarry.',
    'بيج دافئ متجانس بتعريقات ترابية ناعمة. كتل ضخمة، ألواح مصقولة، ومقاسات جاهزة من محجرنا بعبري مباشرة.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    '2680', '0.16', '128',
    'Polished / Honed / Antique', 'مصقول / مطفي / معتق',
    '20mm, 30mm, Custom', '٢٠ ملم، ٣٠ ملم، حسب الطلب',
    '3000 × 1800 mm', '٣٠٠٠ × ١٨٠٠ ملم',
    '7-14 days', '٧-١٤ يوم',
    true, 1
),
(
    'stone-steps-risers',
    'Stair Steps & Risers',
    'درجات ومقاسم سلالم مصقولة',
    'Heavy-duty treads, vertical risers, and skirting tiles with chamfered or bullnose edge profiling.',
    'درجات سلالم عالية التحمل، مقاسم رأسية، ووزرات حماية مع تشطيب حواف دائرية أو مشطوفة بالمقاس.',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    '2680', '0.15', '130',
    'Bullnose / Beveled / Polished', 'حواف مستديرة / مشطوفة / مصقولة',
    '30mm treads / 20mm risers', 'درجات ٣٠ ملم / مقاسم ٢٠ ملم',
    'Custom staircase lengths', 'أطوال مخصصة للدرج',
    '5-10 days', '٥-١٠ أيام',
    true, 2
),
(
    'stone-cut-to-size',
    'Cut-to-size & Architectural Cladding',
    'تكسيات معمارية ومقاسات مخصصة',
    'Precision-cut tiles, exterior wall cladding panels, and flooring engineered to project bill of quantities.',
    'بلاط دقيق القص، ألواح تكسية للواجهات الخارجية، وأرضيات مطابقة لجداول كميات ومخططات المشاريع.',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    '2680', '0.16', '125',
    'Honed / Bush-hammered / Brushed', 'مطفي / مدقوق (بوش هامر) / معتق',
    '15mm - 50mm', '١٥ ملم - ٥٠ ملم',
    '1200 × 600 mm / Full Slabs', '١٢٠٠ × ٦٠٠ ملم / ألواح كاملة',
    '10-20 days', '١٠-٢٠ يوم',
    true, 3
)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Bucket Configuration (Run in Supabase Storage UI or API)
-- Bucket Name: "product-images" (Public bucket enabled)
