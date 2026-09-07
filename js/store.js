/**
 * Global Shining Rocks - Products Data Store
 * Handles CRUD operations, local caching, and Supabase cloud synchronization.
 *
 * When js/config.js has a supabaseUrl + supabaseAnonKey configured, all reads/writes
 * go through Supabase (shared across every visitor). Otherwise it falls back to a
 * local-only demo mode backed by localStorage (single device/browser only).
 */

(function (window) {
  'use strict';

  // Default initial products catalog matching luxury mockup
  var DEFAULT_PRODUCTS = [
    {
      id: 'stone-crema-marfil-omani',
      name_en: 'Crema Marfil Omani',
      name_ar: 'كريما مارفيل عُماني',
      desc_en: 'Uniform warm beige marble with delicate crystalline veins. Ideal for luxury hotel lobbies, residential flooring, and cut-to-size wall cladding.',
      desc_ar: 'رخام بيج دافئ فائق الجودة بتعريقات بلورية ناعمة. مثالي لردهات الفنادق الفاخرة، الأرضيات والواجهات المعمارية.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tennessee-marble-finished-tn1.jpg/1920px-Tennessee-marble-finished-tn1.jpg',
      density: '2680',
      water_absorption: '0.16',
      compressive_strength: '128',
      flexural_strength: '14.2',
      finishes_en: 'Polished / Honed / Antique',
      finishes_ar: 'مصقول / مطفي / معتق',
      thickness_en: '20mm, 30mm, Custom',
      thickness_ar: '٢٠ ملم، ٣٠ ملم، حسب الطلب',
      max_panel_en: '3000 × 1800 mm',
      max_panel_ar: '٣٠٠٠ × ١٨٠٠ ملم',
      lead_time_en: '7-14 days',
      lead_time_ar: '٧-١٤ يوم',
      active: true,
      sort_order: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 'stone-emperador-gold',
      name_en: 'Emperador Omani Gold',
      name_ar: 'امبرادور عُماني ذهبي',
      desc_en: 'Rich earthen brown and gold veined marble with high structural density, mined from deep geological strata in Ibri.',
      desc_ar: 'رخام فاخر بلون بني ترابي غني بتعريقات ذهبية متميزة وكثافة بنيوية عالية من أعماق محاجر عبري.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Emperador_Dark_Marble.jpg',
      density: '2710',
      water_absorption: '0.14',
      compressive_strength: '135',
      flexural_strength: '15.1',
      finishes_en: 'Polished / Leathered / Bush-hammered',
      finishes_ar: 'مصقول / ملمس جلدي / مدقوق',
      thickness_en: '20mm, 30mm',
      thickness_ar: '٢٠ ملم، ٣٠ ملم',
      max_panel_en: '2800 × 1600 mm',
      max_panel_ar: '٢٨٠٠ × ١٦٠٠ ملم',
      lead_time_en: '7-10 days',
      lead_time_ar: '٧-١٠ أيام',
      active: true,
      sort_order: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 'stone-grey-serpeggiante',
      name_en: 'Grey Serpeggiante',
      name_ar: 'رمادي سيربيجيانتي مودرن',
      desc_en: 'Linear wave textured grey marble, highly sought after by architects for modern minimalist interiors and luxury facades.',
      desc_ar: 'رخام رمادي بخطوط مموجة انسيابية، خيار مفضل للمصممين والمهندسين للواجهات الحديثة والتصاميم العصرية.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Marmor_Afyon_Grey_Fliesen_im_Quadratformat_10x10x1cm.jpg',
      density: '2690',
      water_absorption: '0.15',
      compressive_strength: '130',
      flexural_strength: '14.8',
      finishes_en: 'Honed / Polished / Sandblasted',
      finishes_ar: 'مطفي / مصقول / مرمل',
      thickness_en: '15mm - 50mm',
      thickness_ar: '١٥ ملم - ٥٠ ملم',
      max_panel_en: '3200 × 1900 mm',
      max_panel_ar: '٣٢٠٠ × ١٩٠٠ ملم',
      lead_time_en: '10-15 days',
      lead_time_ar: '١٠-١٥ يوم',
      active: true,
      sort_order: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 'stone-white-crystal',
      name_en: 'Crystal White Omani',
      name_ar: 'أبيض كريستال عُماني',
      desc_en: 'Luminous light stone with subtle silver clouding. Perfect for staircase treads, vanity counters, and luxurious villa flooring.',
      desc_ar: 'حجر مضيء بلون أبيض ناصع وتوشيحات فضية خفيفة. ممتاز لدرجات السلالم، المغاسل، وأرضيات الفلل والقصور.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Thassos_marble.jpg/1920px-Thassos_marble.jpg',
      density: '2680',
      water_absorption: '0.12',
      compressive_strength: '132',
      flexural_strength: '15.0',
      finishes_en: 'High Gloss / Satin / Flamed',
      finishes_ar: 'عالي اللمعان / حريري / محروق',
      thickness_en: '20mm, 30mm, 40mm',
      thickness_ar: '٢٠ ملم، ٣٠ ملم، ٤٠ ملم',
      max_panel_en: '3000 × 1700 mm',
      max_panel_ar: '٣٠٠٠ × ١٧٠٠ ملم',
      lead_time_en: '7-12 days',
      lead_time_ar: '٧-١٢ يوم',
      active: true,
      sort_order: 4,
      created_at: new Date().toISOString()
    }
  ];

  var DEFAULT_SETTINGS = {
    id: 1,
    whatsapp_number: '96890000000',
    contact_email: 'sales@globalshiningrocks.com',
    contact_address_ar: 'المنطقة الصناعية بعبري، محافظة الظاهرة، سلطنة عُمان',
    contact_address_en: 'Ibri Industrial Area, Al Dhahirah Governorate, Sultanate of Oman',
    cr_number: 'CR: 1348920 (Sultanate of Oman)',
    stock_inventory: '4,120 m²',
    hero_stat_blocks: '1,200+',
    hero_stat_reserve: '4.5M m³',
    hero_bg_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Marble_Quarry_near_Carrera.jpg/1920px-Marble_Quarry_near_Carrera.jpg',
    quarry1_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Carrara_marble_quarry_face.jpg/1920px-Carrara_marble_quarry_face.jpg',
    quarry1_title_ar: 'قص الواجهات بمناشير السلك الماسي',
    quarry1_title_en: 'DIAMOND WIRE SAW EXTRACTION',
    quarry1_caption_ar: 'محجرنا الخاص في عبري، محافظة الظاهرة.',
    quarry1_caption_en: 'Our own mining concession in Ibri, Al Dhahirah.',
    quarry2_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Doost_Marble_Factory_in_Herat-4.jpg/1920px-Doost_Marble_Factory_in_Herat-4.jpg',
    quarry2_title_ar: 'مصنع النشر والصقل والتعبئة',
    quarry2_title_en: 'PROCESSING PLANT & GANG SAWS',
    quarry2_caption_ar: 'خطوط صقل آلية ورافعات علوية ٧ طن.',
    quarry2_caption_en: 'Automated polishing lines, 7-tonne overhead crane.'
  };

  var STORAGE_KEY = 'gsr_products_data_v3';
  var SETTINGS_STORAGE_KEY = 'gsr_site_settings_v1';
  var AUTH_KEY = 'gsr_admin_session_v3';

  var cfg = window.GSR_CONFIG || {};
  var CLOUD_ENABLED = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  var supabaseClient = null;

  function getClient() {
    if (!CLOUD_ENABLED) return null;
    if (!supabaseClient) {
      if (!window.supabase || !window.supabase.createClient) {
        console.error('Supabase library not loaded (check the CDN <script> tag in this page).');
        return null;
      }
      supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    }
    return supabaseClient;
  }

  var ProductStore = {
    isCloudEnabled: function () {
      return CLOUD_ENABLED;
    },

    // Synchronous read from the local cache. Used for the very first paint
    // (and as the only source of truth in local demo mode).
    getProducts: function (onlyActive) {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var products = raw ? JSON.parse(raw) : null;
        if (!products || !Array.isArray(products)) {
          products = CLOUD_ENABLED ? [] : DEFAULT_PRODUCTS;
          this.saveLocalCache(products);
        }
        if (onlyActive) {
          return products.filter(function (p) { return p.active !== false; });
        }
        return products.slice().sort(function (a, b) { return (Number(a.sort_order) || 99) - (Number(b.sort_order) || 99); });
      } catch (e) {
        console.error('Error loading products from storage:', e);
        return CLOUD_ENABLED ? [] : DEFAULT_PRODUCTS;
      }
    },

    getProductById: function (id) {
      var products = this.getProducts(false);
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) return products[i];
      }
      return null;
    },

    // Writes to the local cache only, and notifies listeners on this page.
    saveLocalCache: function (products) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new CustomEvent('gsr_products_updated', { detail: products }));
    },

    // Pulls the latest products from Supabase into the local cache.
    // No-op (resolves false) when cloud mode isn't configured.
    refreshFromCloud: function () {
      var client = getClient();
      if (!client) return Promise.resolve(false);
      return client.from('products').select('*').then(function (res) {
        if (res.error) {
          console.error('Supabase fetch error:', res.error.message);
          return false;
        }
        ProductStore.saveLocalCache(res.data || []);
        return true;
      });
    },

    // ---- Site settings (contact info, quarry section content) ----

    getSiteSettings: function () {
      try {
        var raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
        var settings = raw ? JSON.parse(raw) : null;
        if (!settings) {
          settings = DEFAULT_SETTINGS;
          this.saveLocalSettingsCache(settings);
        }
        return settings;
      } catch (e) {
        console.error('Error loading site settings from storage:', e);
        return DEFAULT_SETTINGS;
      }
    },

    saveLocalSettingsCache: function (settings) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('gsr_settings_updated', { detail: settings }));
    },

    refreshSettingsFromCloud: function () {
      var client = getClient();
      if (!client) return Promise.resolve(false);
      return client.from('site_settings').select('*').eq('id', 1).maybeSingle().then(function (res) {
        if (res.error) {
          console.error('Supabase settings fetch error:', res.error.message);
          return false;
        }
        if (res.data) ProductStore.saveLocalSettingsCache(res.data);
        return true;
      });
    },

    saveSiteSettings: function (data) {
      var client = getClient();
      var payload = Object.assign({}, data, { id: 1, updated_at: new Date().toISOString() });
      if (client) {
        return client.from('site_settings').upsert(payload).then(function (res) {
          if (res.error) throw new Error(res.error.message);
          return ProductStore.refreshSettingsFromCloud().then(function () { return payload; });
        });
      }
      this.saveLocalSettingsCache(Object.assign({}, this.getSiteSettings(), payload));
      return Promise.resolve(payload);
    },

    // Loads initial data. Call once on page load.
    init: function () {
      if (CLOUD_ENABLED) {
        return Promise.all([this.refreshFromCloud(), this.refreshSettingsFromCloud()]);
      }
      return Promise.resolve(false);
    },

    saveProduct: function (productData) {
      var client = getClient();
      if (client) {
        var isNew = !productData.id;
        if (isNew) {
          productData.id = 'stone-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
          productData.created_at = new Date().toISOString();
        } else {
          productData.updated_at = new Date().toISOString();
        }
        return client.from('products').upsert(productData).then(function (res) {
          if (res.error) throw new Error(res.error.message);
          return ProductStore.refreshFromCloud().then(function () { return productData; });
        });
      }

      // Local-only fallback (demo mode)
      var products = this.getProducts(false);
      if (!productData.id) {
        productData.id = 'stone-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        productData.created_at = new Date().toISOString();
        productData.sort_order = products.length + 1;
        products.push(productData);
      } else {
        var index = -1;
        for (var i = 0; i < products.length; i++) {
          if (products[i].id === productData.id) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          productData.updated_at = new Date().toISOString();
          products[index] = Object.assign({}, products[index], productData);
        } else {
          products.push(productData);
        }
      }
      this.saveLocalCache(products);
      return Promise.resolve(productData);
    },

    deleteProduct: function (id) {
      var client = getClient();
      if (client) {
        return client.from('products').delete().eq('id', id).then(function (res) {
          if (res.error) throw new Error(res.error.message);
          return ProductStore.refreshFromCloud();
        });
      }
      var products = this.getProducts(false);
      var filtered = products.filter(function (p) { return p.id !== id; });
      this.saveLocalCache(filtered);
      return Promise.resolve(true);
    },

    resetToDefaults: function () {
      if (CLOUD_ENABLED) {
        return Promise.reject(new Error('Reset to factory defaults is a local-demo-only action; edit data in Supabase directly.'));
      }
      this.saveLocalCache(DEFAULT_PRODUCTS);
      return Promise.resolve(DEFAULT_PRODUCTS);
    },

    exportJSON: function () {
      return JSON.stringify(this.getProducts(false), null, 2);
    },

    importJSON: function (jsonString) {
      if (CLOUD_ENABLED) {
        return { success: false, error: 'Import is a local-demo-only action; import data directly in Supabase.' };
      }
      try {
        var data = JSON.parse(jsonString);
        if (Array.isArray(data)) {
          this.saveLocalCache(data);
          return { success: true, count: data.length };
        }
        return { success: false, error: 'Invalid format. Expected an array of products.' };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    // ---- Auth ----

    // Synchronous local session read, used only in local demo mode.
    getSession: function () {
      try {
        var s = localStorage.getItem(AUTH_KEY);
        return s ? JSON.parse(s) : null;
      } catch (e) {
        return null;
      }
    },

    // Async session read - checks the real Supabase Auth session when cloud mode is on.
    getSessionAsync: function () {
      var client = getClient();
      if (client) {
        return client.auth.getSession().then(function (res) {
          return (res.data && res.data.session) ? res.data.session : null;
        });
      }
      return Promise.resolve(this.getSession());
    },

    setSession: function (sessionData) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    },

    clearSession: function () {
      localStorage.removeItem(AUTH_KEY);
      var client = getClient();
      if (client) return client.auth.signOut();
      return Promise.resolve();
    },

    login: function (email, password) {
      var client = getClient();
      if (client) {
        return client.auth.signInWithPassword({ email: (email || '').trim(), password: password || '' })
          .then(function (res) {
            if (res.error) return { success: false, error: res.error.message };
            return { success: true, session: res.data.session };
          });
      }

      // Local demo fallback - only used while Supabase isn't configured
      var cleanEmail = (email || '').trim().toLowerCase();
      var cleanPass = (password || '').trim();
      if ((cleanEmail === 'admin@globalshiningrocks.com' || cleanEmail === 'admin') && cleanPass === 'oman2026') {
        var session = {
          user: { email: 'admin@globalshiningrocks.com', role: 'admin', name: 'Ahmed Al-Mansoori' },
          token: 'demo-token-' + Date.now(),
          login_at: new Date().toISOString()
        };
        this.setSession(session);
        return Promise.resolve({ success: true, session: session });
      }
      return Promise.resolve({ success: false, error: 'بيانات الدخول غير صحيحة (وضع تجريبي محلي).' });
    }
  };

  window.ProductStore = ProductStore;
})(window);
