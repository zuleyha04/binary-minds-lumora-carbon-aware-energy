/**
 * Karbon emisyonu hesaplama yardımcı fonksiyonları
 */

/**
 * Verilen saatin karbon yoğunluğunu döndürür
 */
export function getCarbonIntensity(hour, carbonData) {
  const entry = carbonData.find(d => d.hour === hour);
  return entry ? entry.carbon_intensity_g_per_kwh : 0;
}

/**
 * Temel CO₂ emisyon hesabı
 * @param {number} energyKwh - enerji tüketimi kWh
 * @param {number} carbonIntensity - karbon yoğunluğu gCO₂/kWh
 * @returns {number} emisyon (gram CO₂)
 */
export function calcEmission(energyKwh, carbonIntensity) {
  return energyKwh * carbonIntensity;
}

/**
 * Aday saatleri hesaplar (currentHour'dan flexibilityHours kadar ilerisi, 24 üzeri wrap-around)
 */
export function getCandidateHours(currentHour, flexibilityHours) {
  const candidates = [];
  for (let i = 0; i <= flexibilityHours; i++) {
    candidates.push((currentHour + i) % 24);
  }
  return candidates;
}

/**
 * Karbon yoğunluğu en düşük aday saati bulur
 */
export function findRecommendedHour(candidateHours, carbonData) {
  let minIntensity = Infinity;
  let recommendedHour = candidateHours[0];

  candidateHours.forEach(hour => {
    const intensity = getCarbonIntensity(hour, carbonData);
    if (intensity < minIntensity) {
      minIntensity = intensity;
      recommendedHour = hour;
    }
  });

  return recommendedHour;
}

/**
 * Tüm hesaplamaları bir arada yapar
 */
export function calculateResults({
  energyKwh,
  currentHour,
  flexibilityHours,
  carbonData,
  weeklyUsage = null,
}) {
  const candidateHours = getCandidateHours(currentHour, flexibilityHours);
  const recommendedHour = findRecommendedHour(candidateHours, carbonData);

  const currentCarbonIntensity = getCarbonIntensity(currentHour, carbonData);
  const recommendedCarbonIntensity = getCarbonIntensity(recommendedHour, carbonData);

  const currentEmission = calcEmission(energyKwh, currentCarbonIntensity);
  const recommendedEmission = calcEmission(energyKwh, recommendedCarbonIntensity);

  const saving = currentEmission - recommendedEmission;
  const savingPercent = currentEmission > 0 ? (saving / currentEmission) * 100 : 0;

  // Tasarruf seviyesi etiketi
  let savingLevel = 'Düşük potansiyel';
  if (savingPercent >= 20) savingLevel = 'Yüksek potansiyel';
  else if (savingPercent >= 10) savingLevel = 'Orta potansiyel';

  // Uzun dönem hesaplar (haftalıkUsage varsa)
  let longTerm = null;
  if (weeklyUsage && saving > 0) {
    longTerm = {
      weeklySavingKg: (saving * weeklyUsage) / 1000,
      monthlySavingKg: (saving * weeklyUsage * 4) / 1000,
      yearlySavingKg: (saving * weeklyUsage * 52) / 1000,
    };
  }

  return {
    candidateHours,
    recommendedHour,
    currentCarbonIntensity,
    recommendedCarbonIntensity,
    currentEmission,
    recommendedEmission,
    saving,
    savingPercent,
    savingLevel,
    longTerm,
  };
}

/**
 * Saati okunabilir formata dönüştürür: 9 → "09:00"
 */
export function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

/**
 * Senaryo sonuçlarını CSV stringine dönüştürür
 */
export function resultsToCSV(scenario) {
  const {
    applianceName,
    energyKwh,
    currentHour,
    results,
    weeklyUsage,
  } = scenario;

  const rows = [
    ['Alan', 'Değer'],
    ['Cihaz', applianceName],
    ['Mevcut Kullanım Saati', formatHour(currentHour)],
    ['Önerilen Saat', formatHour(results.recommendedHour)],
    ['Erteleme Esnekliği (saat)', scenario.flexibilityHours],
    ['Enerji Tüketimi (kWh)', energyKwh.toFixed(3)],
    ['Mevcut Karbon Yoğunluğu (gCO₂/kWh)', results.currentCarbonIntensity.toFixed(1)],
    ['Önerilen Karbon Yoğunluğu (gCO₂/kWh)', results.recommendedCarbonIntensity.toFixed(1)],
    ['Mevcut Emisyon (gCO₂)', results.currentEmission.toFixed(1)],
    ['Önerilen Emisyon (gCO₂)', results.recommendedEmission.toFixed(1)],
    ['Tek Kullanım CO₂ Kazancı (gCO₂)', results.saving.toFixed(1)],
    ['Azalma Oranı (%)', results.savingPercent.toFixed(1)],
  ];

  if (results.longTerm && weeklyUsage) {
    rows.push(['Haftalık Kullanım (kez/hafta)', weeklyUsage]);
    rows.push(['Haftalık CO₂ Kazancı (kgCO₂)', results.longTerm.weeklySavingKg.toFixed(3)]);
    rows.push(['Aylık CO₂ Kazancı (kgCO₂)', results.longTerm.monthlySavingKg.toFixed(3)]);
    rows.push(['Yıllık CO₂ Kazancı (kgCO₂)', results.longTerm.yearlySavingKg.toFixed(3)]);
  }

  return rows.map(r => r.join(',')).join('\n');
}
