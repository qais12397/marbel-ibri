-- ==============================================================================
-- GLOBAL SHINING ROCKS - SUPABASE DATABASE & STORAGE SCHEMA
-- Execute this script in your Supabase SQL Editor (https://app.supabase.com)
--
-- After running this, also go to Authentication -> Sign In / Providers and
-- turn OFF "Allow new users to sign up". This project only ever needs the one
-- admin account (created manually via Authentication -> Users -> Add user) -
-- public sign-up has no legitimate use here and, combined with a permissive
-- RLS policy, would let a stranger create an account and edit your products.
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

-- 4. Admin Write Access - restricted to the specific admin account(s) below.
-- IMPORTANT: "TO authenticated" alone is not enough - any signed-up user counts
-- as "authenticated". This checks the JWT email so only the real admin(s) can
-- write, even if public sign-ups are ever re-enabled by mistake. Add more
-- emails with "OR auth.jwt() ->> 'email' = '...'" if you have multiple admins.
CREATE POLICY "Allow write access to the site admin only"
ON public.products
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'alsukit96@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'alsukit96@gmail.com');

-- 5. Insert Initial Default Catalog Data
INSERT INTO public.products (id, name_en, name_ar, desc_en, desc_ar, image, density, water_absorption, compressive_strength, finishes_en, finishes_ar, thickness_en, thickness_ar, max_panel_en, max_panel_ar, lead_time_en, lead_time_ar, active, sort_order)
VALUES 
(
    'stone-oman-marble',
    'Oman Marble (Desert Rose / Beige)',
    'رخام عُمان (بيج صحراوي كلاسيك)',
    'Uniform warm beige with delicate earth veins. Blocks, slabs, and cut-to-size panels extracted directly from our Ibri quarry.',
    'بيج دافئ متجانس بتعريقات ترابية ناعمة. كتل ضخمة، ألواح مصقولة، ومقاسات جاهزة من محجرنا بعبري مباشرة.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tennessee-marble-finished-tn1.jpg/1920px-Tennessee-marble-finished-tn1.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/d/d8/Marmor_Afyon_Grey_Fliesen_im_Quadratformat_10x10x1cm.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Thassos_marble.jpg/1920px-Thassos_marble.jpg',
    '2680', '0.16', '125',
    'Honed / Bush-hammered / Brushed', 'مطفي / مدقوق (بوش هامر) / معتق',
    '15mm - 50mm', '١٥ ملم - ٥٠ ملم',
    '1200 × 600 mm / Full Slabs', '١٢٠٠ × ٦٠٠ ملم / ألواح كاملة',
    '10-20 days', '١٠-٢٠ يوم',
    true, 3
)
ON CONFLICT (id) DO NOTHING;

-- 6. Site Settings Table (contact info + quarry section content shown on index.html,
--    editable from admin.html's "Site Settings" panel). Single-row table (id = 1).
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    whatsapp_number TEXT DEFAULT '96890000000',
    contact_email TEXT DEFAULT 'sales@globalshiningrocks.com',
    contact_address_ar TEXT DEFAULT 'المنطقة الصناعية بعبري، محافظة الظاهرة، سلطنة عُمان',
    contact_address_en TEXT DEFAULT 'Ibri Industrial Area, Al Dhahirah Governorate, Sultanate of Oman',
    cr_number TEXT DEFAULT 'CR: 1348920 (Sultanate of Oman)',
    stock_inventory TEXT DEFAULT '4,120 m²',
    hero_stat_blocks TEXT DEFAULT '1,200+',
    hero_stat_reserve TEXT DEFAULT '4.5M m³',
    quarry1_image TEXT,
    quarry1_title_ar TEXT,
    quarry1_title_en TEXT,
    quarry1_caption_ar TEXT,
    quarry1_caption_en TEXT,
    quarry2_image TEXT,
    quarry2_title_ar TEXT,
    quarry2_title_en TEXT,
    quarry2_caption_ar TEXT,
    quarry2_caption_en TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access on site_settings"
ON public.site_settings FOR SELECT USING (true);

-- Same admin-email restriction as the products table - see the note above.
CREATE POLICY "Allow write access to the site admin only"
ON public.site_settings FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'alsukit96@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'alsukit96@gmail.com');

INSERT INTO public.site_settings (id, whatsapp_number, contact_email, contact_address_ar, contact_address_en, cr_number, quarry1_image, quarry1_title_ar, quarry1_title_en, quarry1_caption_ar, quarry1_caption_en, quarry2_image, quarry2_title_ar, quarry2_title_en, quarry2_caption_ar, quarry2_caption_en)
VALUES (
    1, '96890000000', 'sales@globalshiningrocks.com',
    'المنطقة الصناعية بعبري، محافظة الظاهرة، سلطنة عُمان',
    'Ibri Industrial Area, Al Dhahirah Governorate, Sultanate of Oman',
    'CR: 1348920 (Sultanate of Oman)',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Carrara_marble_quarry_face.jpg/1920px-Carrara_marble_quarry_face.jpg',
    'قص الواجهات بمناشير السلك الماسي', 'DIAMOND WIRE SAW EXTRACTION',
    'محجرنا الخاص في عبري، محافظة الظاهرة.', 'Our own mining concession in Ibri, Al Dhahirah.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Doost_Marble_Factory_in_Herat-4.jpg/1920px-Doost_Marble_Factory_in_Herat-4.jpg',
    'مصنع النشر والصقل والتعبئة', 'PROCESSING PLANT & GANG SAWS',
    'خطوط صقل آلية ورافعات علوية ٧ طن.', 'Automated polishing lines, 7-tonne overhead crane.'
)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage Bucket Configuration (Run in Supabase Storage UI or API)
-- Bucket Name: "product-images" (Public bucket enabled)
