import React, { useState, useEffect, useMemo } from 'react';
import HeroSection from './components/HeroSection';
import ProductTour from './components/ProductTour';
import SidebarControls from './components/SidebarControls';
import MetricCard from './components/MetricCard';
import CarbonChart from './components/CarbonChart';
import ScenarioTable from './components/ScenarioTable';
import ImpactCelebration from './components/ImpactCelebration';
import {
  loadCarbonData,
  loadApplianceData,
  loadApplianceCatalog,
  APPLIANCE_TR
} from './utils/dataLoader';
import { calculateResults, formatHour } from './utils/calculations';

export default function App() {
  const [carbonData, setCarbonData] = useState([]);
  const [applianceMedians, setApplianceMedians] = useState({});
  const [applianceCatalog, setApplianceCatalog] = useState([]);
  const [dataError, setDataError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showTour, setShowTour] = useState(true);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const [deviceSource, setDeviceSource] = useState('dataset');
  const [selectedAppliance, setSelectedAppliance] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [catalogManualEnergy, setCatalogManualEnergy] = useState(false);

  const [energyKwh, setEnergyKwh] = useState(0);
  const [energyRaw, setEnergyRaw] = useState('');

  const [currentHour, setCurrentHour] = useState(19);
  const [flexibilityHours, setFlexibilityHours] = useState(8);
  const [longTermEnabled, setLongTermEnabled] = useState(false);
  const [weeklyUsage, setWeeklyUsage] = useState(5);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const [carbon, appliance, catalog] = await Promise.all([
          loadCarbonData(),
          loadApplianceData(),
          loadApplianceCatalog(),
        ]);

        setCarbonData(carbon);
        setApplianceMedians(appliance.applianceMedians);
        setApplianceCatalog(catalog);

        setSelectedAppliance('');
        setSelectedBrand('');
        setSelectedCategory('');
        setSelectedModelId('');
        setEnergyKwh(0);
        setEnergyRaw('');
      } catch (err) {
        setDataError('Veriler yüklenirken hata oluştu. Lütfen CSV/JSON dosyalarını kontrol edin.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const selectedCatalogDevice = useMemo(() => {
    if (!applianceCatalog.length || !selectedModelId) return null;
    return applianceCatalog.find((item) => item.id === selectedModelId) || null;
  }, [applianceCatalog, selectedModelId]);

  const effectiveEnergyKwh =
    deviceSource === 'custom' && selectedCatalogDevice && !catalogManualEnergy
      ? Number(selectedCatalogDevice.energy_kwh_per_cycle || 0)
      : Number(energyKwh || 0);

  const hasActiveDevice =
    deviceSource === 'dataset'
      ? Boolean(selectedAppliance)
      : Boolean(selectedCatalogDevice);

  const hasValidEnergy = effectiveEnergyKwh > 0;

  const canCalculate =
    hasActiveDevice &&
    hasValidEnergy &&
    carbonData.length > 0;

  const applianceName =
    deviceSource === 'dataset'
      ? (APPLIANCE_TR[selectedAppliance] || selectedAppliance || 'Cihaz')
      : selectedCatalogDevice
        ? `${selectedCatalogDevice.brand} ${selectedCatalogDevice.model}`
        : 'Cihaz';

  const results = canCalculate
    ? calculateResults({
        energyKwh: effectiveEnergyKwh,
        currentHour,
        flexibilityHours,
        carbonData,
        weeklyUsage: longTermEnabled ? weeklyUsage : null,
      })
    : null;

  const renderSuggestionMessage = () => {
    if (!results) return null;

    if (results.saving > 0) {
      let levelClass = 'badge-low';
      if (results.savingPercent >= 20) levelClass = 'badge-high';
      else if (results.savingPercent >= 10) levelClass = 'badge-medium';

      return (
        <div style={{
          background: 'linear-gradient(135deg, #f0faf4, #dcf5e7)',
          border: '1.5px solid #baebd0',
          borderRadius: '16px',
          padding: '18px 20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '24px', flexShrink: 0, lineHeight: '1' }}>🌿</span>

          <div>
            <p style={{
              fontSize: '14px',
              color: '#145335',
              lineHeight: '1.6',
              margin: '0 0 8px 0',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              <strong>{applianceName}</strong> cihazını{' '}
              <strong>{formatHour(currentHour)}</strong> yerine{' '}
              <strong style={{ color: '#1a7a4a' }}>{formatHour(results.recommendedHour)}</strong> saatinde
              çalıştırırsanız yaklaşık{' '}
              <strong>%{results.savingPercent.toFixed(0)}</strong> daha az CO₂ salımı oluşur.
            </p>

            <span className={`saving-badge ${levelClass}`}>
              {results.savingLevel}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px 20px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '24px', flexShrink: 0, lineHeight: '1' }}>ℹ️</span>

        <p style={{
          fontSize: '14px',
          color: '#405443',
          lineHeight: '1.6',
          margin: 0,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Seçilen esneklik aralığında mevcut saat zaten düşük karbonlu saatlerden biri.
          Bu nedenle anlamlı bir CO₂ kazancı oluşmadı.
        </p>
      </div>
    );
  };

  const handleTourNext = () => {
    if (currentTourStep < 3) setCurrentTourStep((s) => s + 1);
  };

  const handleTourPrev = () => {
    if (currentTourStep > 0) setCurrentTourStep((s) => s - 1);
  };

  const handleTourFinish = () => {
    setShowTour(false);
  };

  const handleStartTour = () => {
    setCurrentTourStep(0);
    setShowTour(true);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f8f5',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #cde1d4',
          borderTopColor: '#1a7a4a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          color: '#528e6e',
          fontSize: '14px',
        }}>
          Veriler yükleniyor...
        </p>
      </div>
    );
  }

  return (
    <div className="app-page">
      {showTour && (
        <ProductTour
          currentStep={currentTourStep}
          onNext={handleTourNext}
          onPrev={handleTourPrev}
          onFinish={handleTourFinish}
        />
      )}

      <div className="app-container">
        <HeroSection onStartTour={handleStartTour} />

        {dataError && (
          <div style={{
            background: '#fef3c7',
            border: '1.5px solid #fcd34d',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#92400e',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            ⚠️ {dataError}
          </div>
        )}

        <div className="dashboard-grid">
          <SidebarControls
            applianceMedians={applianceMedians}
            applianceCatalog={applianceCatalog}
            deviceSource={deviceSource}
            setDeviceSource={setDeviceSource}
            selectedAppliance={selectedAppliance}
            setSelectedAppliance={setSelectedAppliance}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
            catalogManualEnergy={catalogManualEnergy}
            setCatalogManualEnergy={setCatalogManualEnergy}
            selectedCatalogDevice={selectedCatalogDevice}
            energyKwh={effectiveEnergyKwh}
            setEnergyKwh={setEnergyKwh}
            energyRaw={energyRaw}
            setEnergyRaw={setEnergyRaw}
            currentHour={currentHour}
            setCurrentHour={setCurrentHour}
            flexibilityHours={flexibilityHours}
            setFlexibilityHours={setFlexibilityHours}
            longTermEnabled={longTermEnabled}
            setLongTermEnabled={setLongTermEnabled}
            weeklyUsage={weeklyUsage}
            setWeeklyUsage={setWeeklyUsage}
          />

          <div className="dashboard-main">
            <div id="result-section">
              {!results ? (
                <div className="empty-results-card">
                  <div className="empty-results-icon">
                    🌱
                  </div>

                  <h3 className="empty-results-title">
                    Henüz bir cihaz seçilmedi
                  </h3>

                  <p className="empty-results-text">
                    Sol panelden bir cihaz seçtiğinizde mevcut CO₂, önerilen CO₂,
                    tasarruf oranı ve dünyaya katkı animasyonu burada görünecek.
                  </p>

                  <div className="empty-metrics-grid">
                    <EmptyMetric label="Mevcut CO₂" />
                    <EmptyMetric label="Önerilen CO₂" />
                    <EmptyMetric label="CO₂ Kazancı" />
                    <EmptyMetric label="Azalma Oranı" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="metrics-grid">
                    <MetricCard
                      label="Mevcut CO₂"
                      value={results.currentEmission.toFixed(0)}
                      unit="gCO₂"
                      sublabel={`${formatHour(currentHour)}`}
                      accent="current"
                      icon="⚡"
                    />

                    <MetricCard
                      label="Önerilen CO₂"
                      value={results.recommendedEmission.toFixed(0)}
                      unit="gCO₂"
                      sublabel={`${formatHour(results.recommendedHour)}`}
                      accent="recommended"
                      icon="🌿"
                    />

                    <MetricCard
                      label="CO₂ Kazancı"
                      value={Math.max(0, results.saving).toFixed(0)}
                      unit="gCO₂"
                      sublabel="tek kullanım"
                      accent="saving"
                      icon="✨"
                    />

                    <MetricCard
                      label="Azalma Oranı"
                      value={`%${Math.max(0, results.savingPercent).toFixed(0)}`}
                      unit=""
                      sublabel={results.savingLevel}
                      accent="percent"
                      icon="📉"
                    />
                  </div>

                  {renderSuggestionMessage()}

                  {results.saving > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <ImpactCelebration
                        saving={results.saving}
                        savingPercent={results.savingPercent}
                        longTermEnabled={longTermEnabled}
                        weeklyUsage={weeklyUsage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div
              id="carbon-chart-section"
              className="control-card carbon-chart-card"
            >
              <div className="carbon-chart-header">
                <h3 className="carbon-chart-title">
                  Saatlik Karbon Yoğunluğu
                </h3>

                {results ? (
                  <span className="carbon-chart-status active">
                    {results.candidateHours.length} aday saat değerlendirildi
                  </span>
                ) : (
                  <span className="carbon-chart-status">
                    Henüz hesaplama yapılmadı
                  </span>
                )}
              </div>

              {results ? (
                <CarbonChart
                  carbonData={carbonData}
                  currentHour={currentHour}
                  recommendedHour={results.recommendedHour}
                  candidateHours={results.candidateHours}
                />
              ) : (
                <EmptyCarbonChart />
              )}
            </div>

            {results && (
              <ScenarioTable
                applianceName={applianceName}
                energyKwh={effectiveEnergyKwh}
                currentHour={currentHour}
                flexibilityHours={flexibilityHours}
                weeklyUsage={weeklyUsage}
                results={results}
                longTermEnabled={longTermEnabled}
              />
            )}
          </div>
        </div>

        <div className="app-footer">
          Lumora · Kişisel Karbon Farkındalıklı Zamanlama Paneli
        </div>
      </div>
    </div>
  );
}

function EmptyMetric({ label }) {
  return (
    <div className="empty-metric-card">
      <div className="empty-metric-label">
        {label}
      </div>

      <div className="empty-metric-value">
        --
      </div>
    </div>
  );
}

function EmptyCarbonChart() {
  const emptyHours = Array.from({ length: 24 }, (_, index) => index);

  return (
    <div className="empty-carbon-chart">
      <div className="empty-carbon-bg" />

      <div className="empty-carbon-top">
        <div>
          <p className="empty-carbon-label">
            Grafik beklemede
          </p>

          <h4 className="empty-carbon-title">
            Karbon yoğunluğu grafiği burada görünecek
          </h4>

          <p className="empty-carbon-text">
            Sol panelden cihaz seçtiğinizde sistem mevcut saat, aday saatler ve önerilen
            düşük karbonlu saati bu grafikte gösterecek.
          </p>
        </div>

        <div className="empty-carbon-icon">
          📈
        </div>
      </div>

      <div className="empty-carbon-bars">
        {emptyHours.map((hour) => {
          const height = 24 + ((hour * 7) % 58);

          return (
            <div
              key={hour}
              title={`${hour}:00`}
              style={{ height: `${height}px` }}
              className="empty-carbon-bar"
            />
          );
        })}
      </div>

      <div className="empty-carbon-axis">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
}