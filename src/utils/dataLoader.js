import Papa from 'papaparse';

// Cihaz isimlerini Türkçeye çevirir
export const APPLIANCE_TR = {
  dishwasher: 'Bulaşık Makinesi',
  washing_machine: 'Çamaşır Makinesi',
  tumble_dryer: 'Kurutma Makinesi',
  washer_dryer: 'Yıkama-Kurutma Makinesi',
};

// Demo verisi - CSV yüklenemezse kullanılır
export const DEMO_CARBON_DATA = [
  { hour: 0, carbon_intensity_g_per_kwh: 218 },
  { hour: 1, carbon_intensity_g_per_kwh: 208 },
  { hour: 2, carbon_intensity_g_per_kwh: 200 },
  { hour: 3, carbon_intensity_g_per_kwh: 195 },
  { hour: 4, carbon_intensity_g_per_kwh: 192 },
  { hour: 5, carbon_intensity_g_per_kwh: 198 },
  { hour: 6, carbon_intensity_g_per_kwh: 215 },
  { hour: 7, carbon_intensity_g_per_kwh: 240 },
  { hour: 8, carbon_intensity_g_per_kwh: 258 },
  { hour: 9, carbon_intensity_g_per_kwh: 265 },
  { hour: 10, carbon_intensity_g_per_kwh: 268 },
  { hour: 11, carbon_intensity_g_per_kwh: 262 },
  { hour: 12, carbon_intensity_g_per_kwh: 255 },
  { hour: 13, carbon_intensity_g_per_kwh: 248 },
  { hour: 14, carbon_intensity_g_per_kwh: 240 },
  { hour: 15, carbon_intensity_g_per_kwh: 238 },
  { hour: 16, carbon_intensity_g_per_kwh: 242 },
  { hour: 17, carbon_intensity_g_per_kwh: 260 },
  { hour: 18, carbon_intensity_g_per_kwh: 278 },
  { hour: 19, carbon_intensity_g_per_kwh: 285 },
  { hour: 20, carbon_intensity_g_per_kwh: 275 },
  { hour: 21, carbon_intensity_g_per_kwh: 262 },
  { hour: 22, carbon_intensity_g_per_kwh: 248 },
  { hour: 23, carbon_intensity_g_per_kwh: 232 },
];

export const DEMO_APPLIANCE_DATA = {
  dishwasher: 0.88,
  washing_machine: 0.51,
  tumble_dryer: 2.20,
  washer_dryer: 1.50,
};

/**
 * Saatlik karbon yoğunluğu CSV dosyasını yükler
 */
export async function loadCarbonData() {
  try {
    const response = await fetch('/data/gb_carbon_hour_profile.csv');
    if (!response.ok) throw new Error('Dosya bulunamadı');
    const text = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parse uyarıları:', results.errors);
          }
          const data = results.data.map(row => ({
            hour: Number(row.hour),
            carbon_intensity_g_per_kwh: Number(row.carbon_intensity_g_per_kwh),
          })).filter(row => !isNaN(row.hour) && !isNaN(row.carbon_intensity_g_per_kwh));

          resolve(data);
        },
        error: reject,
      });
    });
  } catch (err) {
    console.warn('Karbon verisi yüklenemedi, demo veri kullanılıyor:', err.message);
    return DEMO_CARBON_DATA;
  }
}

/**
 * Cihaz olayları CSV dosyasını yükler ve medyan enerji tüketimlerini hesaplar
 * @returns {Object} { applianceMedians: {name: kwh}, rawData: [...] }
 */
export async function loadApplianceData() {
  try {
    const response = await fetch('/data/refit_appliance_events_final.csv');
    if (!response.ok) throw new Error('Dosya bulunamadı');
    const text = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data.filter(
            row => row.appliance_name && row.energy_kwh && !isNaN(Number(row.energy_kwh))
          );

          // Her cihaz için enerji değerlerini grupla
          const groups = {};
          rows.forEach(row => {
            const name = row.appliance_name.trim().toLowerCase();
            if (!groups[name]) groups[name] = [];
            groups[name].push(Number(row.energy_kwh));
          });

          // Medyan hesapla
          const medians = {};
          Object.entries(groups).forEach(([name, values]) => {
            const sorted = [...values].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            medians[name] = sorted.length % 2 !== 0
              ? sorted[mid]
              : (sorted[mid - 1] + sorted[mid]) / 2;
          });

          resolve({ applianceMedians: medians, rawData: rows });
        },
        error: reject,
      });
    });
  } catch (err) {
    console.warn('Cihaz verisi yüklenemedi, demo veri kullanılıyor:', err.message);
    return { applianceMedians: DEMO_APPLIANCE_DATA, rawData: [] };
  }
}

export async function loadApplianceCatalog() {
  try {
    const response = await fetch('/data/appliance_catalog.json');

    if (!response.ok) {
      console.warn('appliance_catalog.json dosyası bulunamadı.');
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn('appliance_catalog.json geçerli bir liste değil.');
      return [];
    }

    return data.map((item) => ({
      ...item,
      energy_kwh_per_cycle: Number(item.energy_kwh_per_cycle || 0),
      energy_value: Number(item.energy_value || 0),
    }));
  } catch (error) {
    console.warn('Cihaz kataloğu yüklenemedi:', error);
    return [];
  }
}