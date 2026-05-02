import React, { useMemo } from 'react';
import { APPLIANCE_TR } from '../utils/dataLoader';

function SelectField({ label, value, onChange, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={onChange} style={inputStyle}>
        {children}
      </select>
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        value={value}
        min="0.01"
        step="0.01"
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  );
}

function RangeField({ label, value, min, max, onChange, suffix = '' }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#145335',
          background: '#e8f5ec',
          padding: '4px 10px',
          borderRadius: '999px',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {value}{suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ width: '100%', accentColor: '#2f7d4b' }}
      />
    </div>
  );
}

export default function SidebarControls({
  applianceMedians,
  applianceCatalog,
  deviceSource,
  setDeviceSource,

  selectedAppliance,
  setSelectedAppliance,

  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedModelId,
  setSelectedModelId,

  catalogManualEnergy,
  setCatalogManualEnergy,
  selectedCatalogDevice,

  energyKwh,
  setEnergyKwh,
  energyRaw,
  setEnergyRaw,

  currentHour,
  setCurrentHour,
  flexibilityHours,
  setFlexibilityHours,

  longTermEnabled,
  setLongTermEnabled,
  weeklyUsage,
  setWeeklyUsage,
}) {
  const applianceOptions = Object.keys(applianceMedians).filter((key) => APPLIANCE_TR[key]);

  const catalogBrands = useMemo(() => {
    return [...new Set(applianceCatalog.map((item) => item.brand))].sort();
  }, [applianceCatalog]);

  const catalogCategories = useMemo(() => {
    return [
      ...new Set(
        applianceCatalog
          .filter((item) => item.brand === selectedBrand)
          .map((item) => item.category)
      ),
    ];
  }, [applianceCatalog, selectedBrand]);

  const catalogModels = useMemo(() => {
    return applianceCatalog.filter(
      (item) =>
        item.brand === selectedBrand &&
        item.category === selectedCategory
    );
  }, [applianceCatalog, selectedBrand, selectedCategory]);

  const resetEnergy = () => {
    setEnergyKwh(0);
    setEnergyRaw('');
  };

  const handleDeviceSourceChange = (source) => {
    setDeviceSource(source);

    if (source === 'dataset') {
      setSelectedBrand('');
      setSelectedCategory('');
      setSelectedModelId('');
    } else {
      setSelectedAppliance('');
    }

    resetEnergy();
  };

  const handleDatasetApplianceChange = (e) => {
    const value = e.target.value;
    setSelectedAppliance(value);

    const med = applianceMedians[value];
    if (med) {
      setEnergyKwh(med);
      setEnergyRaw(med.toFixed(3));
    } else {
      resetEnergy();
    }
  };

  const handleEnergyChange = (e) => {
    const value = e.target.value;
    setEnergyRaw(value);

    const parsed = Number(String(value).replace(',', '.'));
    if (!Number.isNaN(parsed)) {
      setEnergyKwh(parsed);
    }
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;

    if (!brand) {
      setSelectedBrand('');
      setSelectedCategory('');
      setSelectedModelId('');
      resetEnergy();
      return;
    }

    const categories = [
      ...new Set(
        applianceCatalog
          .filter((item) => item.brand === brand)
          .map((item) => item.category)
      ),
    ];

    const firstCategory = categories[0] || '';

    const models = applianceCatalog.filter(
      (item) => item.brand === brand && item.category === firstCategory
    );

    const firstModel = models[0] || null;

    setSelectedBrand(brand);
    setSelectedCategory(firstCategory);
    setSelectedModelId(firstModel?.id || '');

    if (firstModel) {
      setEnergyKwh(firstModel.energy_kwh_per_cycle);
      setEnergyRaw(Number(firstModel.energy_kwh_per_cycle).toFixed(3));
    } else {
      resetEnergy();
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;

    if (!category) {
      setSelectedCategory('');
      setSelectedModelId('');
      resetEnergy();
      return;
    }

    const models = applianceCatalog.filter(
      (item) => item.brand === selectedBrand && item.category === category
    );

    const firstModel = models[0] || null;

    setSelectedCategory(category);
    setSelectedModelId(firstModel?.id || '');

    if (firstModel) {
      setEnergyKwh(firstModel.energy_kwh_per_cycle);
      setEnergyRaw(Number(firstModel.energy_kwh_per_cycle).toFixed(3));
    } else {
      resetEnergy();
    }
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;

    if (!modelId) {
      setSelectedModelId('');
      resetEnergy();
      return;
    }

    const model = applianceCatalog.find((item) => item.id === modelId);

    setSelectedModelId(modelId);

    if (model) {
      setEnergyKwh(model.energy_kwh_per_cycle);
      setEnergyRaw(Number(model.energy_kwh_per_cycle).toFixed(3));
    } else {
      resetEnergy();
    }
  };

  return (
    <div className="control-card sidebar-card">
      <div id="tour-device-panel">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '20px' }}>🔌</span>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '20px',
            color: '#145335',
            margin: 0,
          }}>
            Cihaz Seçimi
          </h2>
        </div>

        <div className="device-source-tabs">
          <button
            onClick={() => handleDeviceSourceChange('dataset')}
            style={{
              ...toggleButtonStyle,
              background: deviceSource === 'dataset' ? '#347a4b' : 'transparent',
              color: deviceSource === 'dataset' ? 'white' : '#528e6e',
            }}
          >
            Veri setinden seç
          </button>

          <button
            onClick={() => handleDeviceSourceChange('custom')}
            style={{
              ...toggleButtonStyle,
              background: deviceSource === 'custom' ? '#347a4b' : 'transparent',
              color: deviceSource === 'custom' ? 'white' : '#528e6e',
            }}
          >
            Kendi cihazım
          </button>
        </div>

        {deviceSource === 'dataset' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <SelectField
              label="Cihaz seç"
              value={selectedAppliance}
              onChange={handleDatasetApplianceChange}
            >
              <option value="">Cihaz seçiniz</option>
              {applianceOptions.map((key) => (
                <option key={key} value={key}>
                  {APPLIANCE_TR[key]}
                </option>
              ))}
            </SelectField>

            <NumberField
              label="Enerji (kWh/program)"
              value={energyRaw}
              onChange={handleEnergyChange}
            />

            <div style={infoBoxStyle}>
              REFIT medyan enerji değeri cihaz seçildiğinde otomatik getirilir.
              İstersen bu değeri düzenleyebilirsin.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {applianceCatalog.length === 0 ? (
              <div style={warningBoxStyle}>
                Cihaz kataloğu yüklenemedi. Lütfen <b>public/data/appliance_catalog.json</b> dosyasını kontrol edin.
              </div>
            ) : (
              <>
                <SelectField
                  label="Marka seç"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  <option value="">Marka seçiniz</option>
                  {catalogBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="Cihaz türü seç"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Cihaz türü seçiniz</option>
                  {catalogCategories.map((category) => (
                    <option key={category} value={category}>
                      {APPLIANCE_TR[category] || category}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="Model seç"
                  value={selectedModelId}
                  onChange={handleModelChange}
                >
                  <option value="">Model seçiniz</option>
                  {catalogModels.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.model} {item.capacity ? `- ${item.capacity}` : ''}
                    </option>
                  ))}
                </SelectField>

                {selectedCatalogDevice && (
                  <div style={catalogInfoStyle}>
                    <p><b>Seçilen cihaz:</b> {selectedCatalogDevice.brand} {selectedCatalogDevice.model}</p>
                    <p><b>Cihaz türü:</b> {selectedCatalogDevice.category_tr}</p>

                    {selectedCatalogDevice.capacity && (
                      <p><b>Kapasite:</b> {selectedCatalogDevice.capacity}</p>
                    )}

                    {selectedCatalogDevice.energy_class && (
                      <p><b>Enerji sınıfı:</b> {selectedCatalogDevice.energy_class}</p>
                    )}

                    <p><b>Etiket değeri:</b> {selectedCatalogDevice.source_note}</p>
                    <p>
                      <b>Hesapta kullanılan enerji:</b>{' '}
                      {Number(selectedCatalogDevice.energy_kwh_per_cycle).toFixed(3)} kWh/program
                    </p>
                  </div>
                )}

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#405443',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  <input
                    type="checkbox"
                    checked={catalogManualEnergy}
                    onChange={(e) => setCatalogManualEnergy(e.target.checked)}
                    style={{ accentColor: '#347a4b' }}
                  />
                  Enerji değerini manuel düzenle
                </label>

                {catalogManualEnergy && (
                  <NumberField
                    label="Enerji (kWh/program)"
                    value={energyRaw}
                    onChange={handleEnergyChange}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div id="tour-hour-section" style={{
        marginTop: '28px',
        paddingTop: '24px',
        borderTop: '1px solid #e3efe7',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <RangeField
          label="Mevcut kullanım saati"
          value={currentHour}
          min={0}
          max={23}
          suffix=":00"
          onChange={(e) => setCurrentHour(Number(e.target.value))}
        />

        <RangeField
          label="Erteleme esnekliği"
          value={flexibilityHours}
          min={1}
          max={24}
          suffix=" saat"
          onChange={(e) => setFlexibilityHours(Number(e.target.value))}
        />

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#405443',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <input
            type="checkbox"
            checked={longTermEnabled}
            onChange={(e) => setLongTermEnabled(e.target.checked)}
            style={{ accentColor: '#347a4b' }}
          />
          Uzun dönem etkiyi hesapla
        </label>

        {longTermEnabled && (
          <RangeField
            label="Haftalık kullanım"
            value={weeklyUsage}
            min={1}
            max={14}
            suffix=" kez"
            onChange={(e) => setWeeklyUsage(Number(e.target.value))}
          />
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#528e6e',
  fontFamily: 'DM Sans, sans-serif',
};

const inputStyle = {
  width: '100%',
  border: '1.5px solid #d4e3d9',
  borderRadius: '12px',
  padding: '13px 14px',
  outline: 'none',
  fontSize: '14px',
  color: '#334155',
  background: 'white',
  fontFamily: 'DM Sans, sans-serif',
};

const toggleButtonStyle = {
  border: 'none',
  borderRadius: '10px',
  padding: '12px 10px',
  fontSize: '13px',
  fontWeight: 800,
  cursor: 'pointer',
  transition: '0.2s ease',
  fontFamily: 'DM Sans, sans-serif',
};

const infoBoxStyle = {
  background: '#f0f7f2',
  border: '1px solid #d4e3d9',
  color: '#528e6e',
  borderRadius: '12px',
  padding: '12px 14px',
  fontSize: '12px',
  lineHeight: 1.5,
  fontFamily: 'DM Sans, sans-serif',
};

const warningBoxStyle = {
  background: '#fff7ed',
  border: '1px solid #fed7aa',
  color: '#9a3412',
  borderRadius: '12px',
  padding: '12px 14px',
  fontSize: '12px',
  lineHeight: 1.5,
  fontFamily: 'DM Sans, sans-serif',
};

const catalogInfoStyle = {
  background: '#f3f8f4',
  border: '1px solid #d8eadf',
  color: '#145335',
  borderRadius: '14px',
  padding: '14px 16px',
  fontSize: '12.5px',
  lineHeight: 1.55,
  fontFamily: 'DM Sans, sans-serif',
};