// popup.js - Antigravity v2.0
document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const globalToggle = document.getElementById('globalToggle');
  const autoSyncToggle = document.getElementById('autoSyncToggle');
  const modeSelect = document.getElementById('modeSelect');
  const siteToggle = document.getElementById('siteToggle');
  const siteThemeBtn = document.getElementById('siteThemeBtn');
  const currentSiteLabel = document.getElementById('currentSite');
  const resetBtn = document.getElementById('resetBtn');
  
  const invertGroup = document.getElementById('invertGroup');
  const hueGroup = document.getElementById('hueGroup');

  const presetSelect = document.getElementById('presetSelect');
  const savePresetBtn = document.getElementById('savePresetBtn');
  const cssBtn = document.getElementById('cssBtn');
  const cssPanel = document.getElementById('cssPanel');
  const customCssInput = document.getElementById('customCssInput');
  const ignoreImagesBtn = document.getElementById('ignoreImagesBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');

  const sliders = {
    brightness: document.getElementById('brightness'),
    contrast: document.getElementById('contrast'),
    grayscale: document.getElementById('grayscale'),
    sepia: document.getElementById('sepia'),
    invert: document.getElementById('invert'),
    hueRotate: document.getElementById('hueRotate'),
    saturate: document.getElementById('saturate'),
    colorTemp: document.getElementById('colorTemp'),
    blueLight: document.getElementById('blueLight'),
    blur: document.getElementById('blur'),
    opacity: document.getElementById('opacity'),
    bgDim: document.getElementById('bgDim'),
    textBoost: document.getElementById('textBoost'),
    imageDim: document.getElementById('imageDim')
  };

  const values = {
    brightness: document.getElementById('brightnessVal'),
    contrast: document.getElementById('contrastVal'),
    grayscale: document.getElementById('grayscaleVal'),
    sepia: document.getElementById('sepiaVal'),
    invert: document.getElementById('invertVal'),
    hueRotate: document.getElementById('hueRotateVal'),
    saturate: document.getElementById('saturateVal'),
    colorTemp: document.getElementById('colorTempVal'),
    blueLight: document.getElementById('blueLightVal'),
    blur: document.getElementById('blurVal'),
    opacity: document.getElementById('opacityVal'),
    bgDim: document.getElementById('bgDimVal'),
    textBoost: document.getElementById('textBoostVal'),
    imageDim: document.getElementById('imageDimVal')
  };

  // State
  let currentTheme = 'dark';
  let ignoreImagesState = true;

  // Built-in Presets
  const presets = {
    default: {
      brightness: 100, contrast: 100, grayscale: 0, sepia: 0,
      invert: 100, hueRotate: 180, saturate: 100, colorTemp: 6500,
      blueLight: 0, blur: 0, opacity: 100, bgDim: 0, textBoost: 0, imageDim: 0,
      ignoreImages: true
    },
    nightOwl: {
      brightness: 85, contrast: 105, grayscale: 0, sepia: 15,
      invert: 100, hueRotate: 180, saturate: 90, colorTemp: 5500,
      blueLight: 35, blur: 0, opacity: 100, bgDim: 20, textBoost: 1, imageDim: 25,
      ignoreImages: true
    },
    reading: {
      brightness: 95, contrast: 110, grayscale: 10, sepia: 25,
      invert: 100, hueRotate: 180, saturate: 85, colorTemp: 4500,
      blueLight: 50, blur: 0, opacity: 100, bgDim: 0, textBoost: 2, imageDim: 15,
      ignoreImages: true
    },
    lowBlue: {
      brightness: 90, contrast: 100, grayscale: 0, sepia: 40,
      invert: 100, hueRotate: 180, saturate: 95, colorTemp: 3500,
      blueLight: 75, blur: 0, opacity: 100, bgDim: 0, textBoost: 0, imageDim: 10,
      ignoreImages: true
    },
    highContrast: {
      brightness: 110, contrast: 140, grayscale: 0, sepia: 0,
      invert: 100, hueRotate: 180, saturate: 120, colorTemp: 6500,
      blueLight: 0, blur: 0, opacity: 100, bgDim: 0, textBoost: 3, imageDim: 0,
      ignoreImages: true
    },
    cinema: {
      brightness: 80, contrast: 120, grayscale: 0, sepia: 0,
      invert: 100, hueRotate: 180, saturate: 110, colorTemp: 6000,
      blueLight: 20, blur: 0, opacity: 100, bgDim: 40, textBoost: 0, imageDim: 0,
      ignoreImages: true
    }
  };

  // Target tab domain
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let host = 'Unknown Site';
  
  if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && !tab.url.startsWith('brave://')) {
    try {
      const url = new URL(tab.url);
      host = url.hostname;
    } catch(e) {}
  }
  
  currentSiteLabel.textContent = host;
  const storageKey = `site:${host}`;

  const defaultSettings = {
    enabled: null,
    theme: 'dark',
    ...presets.default,
    customCss: ''
  };

  const formatVal = (key, val) => {
    if (key === 'hueRotate') return `${val}°`;
    if (key === 'colorTemp') return `${val}K`;
    if (key === 'blur') return `${val}px`;
    if (key === 'textBoost') {
      const levels = ['Off', 'Low', 'Med', 'High'];
      return levels[val] || 'Off';
    }
    return `${val}%`;
  };

  const updateSliderBackground = (slider) => {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--val', `${percentage}%`);
  };

  const updateThemeUI = (theme) => {
    currentTheme = theme;
    if (theme === 'light') {
      siteThemeBtn.textContent = '☀️';
      siteThemeBtn.title = 'Light (Customized) style active. Click to switch to Dark.';
      invertGroup.classList.add('hidden');
      hueGroup.classList.add('hidden');
    } else {
      siteThemeBtn.textContent = '🌙';
      siteThemeBtn.title = 'Dark (Inverted) style active. Click to switch to Light.';
      invertGroup.classList.remove('hidden');
      hueGroup.classList.remove('hidden');
    }
  };

  const updateIgnoreImagesUI = (state) => {
    ignoreImagesState = state;
    if (state) {
      ignoreImagesBtn.classList.add('active');
    } else {
      ignoreImagesBtn.classList.remove('active');
    }
  };

  // Load Custom Presets into select
  const loadCustomPresets = (storageData) => {
    const customOptions = presetSelect.querySelectorAll('option[data-custom="true"]');
    customOptions.forEach(opt => opt.remove());

    Object.keys(storageData).forEach(key => {
      if (key.startsWith('preset:')) {
        const name = key.replace('preset:', '');
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `★ ${name}`;
        option.setAttribute('data-custom', 'true');
        presetSelect.appendChild(option);
      }
    });
  };

  // Load initial state
  chrome.storage.local.get(null, (result) => {
    loadCustomPresets(result);

    const isGlobalEnabled = result.global !== undefined ? result.global : true;
    const isAutoSync = result.autoSync !== undefined ? result.autoSync : false;
    const globalMode = result.globalMode || 'blacklist';

    globalToggle.checked = isGlobalEnabled;
    autoSyncToggle.checked = isAutoSync;
    modeSelect.value = globalMode;

    if (isAutoSync) {
      globalToggle.disabled = true;
      globalToggle.parentElement.style.opacity = '0.5';
    }

    let siteSettings = result[storageKey];
    let siteEnabled = false;
    let theme = 'dark';
    
    if (!siteSettings) {
      siteSettings = { ...defaultSettings };
      siteEnabled = isGlobalEnabled && globalMode === 'blacklist';
      theme = globalMode === 'blacklist' ? 'dark' : 'light';
    } else {
      theme = siteSettings.theme || 'dark';
      if (siteSettings.enabled !== null && siteSettings.enabled !== undefined) {
         siteEnabled = siteSettings.enabled;
      } else {
         siteEnabled = isGlobalEnabled && globalMode === 'blacklist';
      }
    }
    
    siteToggle.checked = siteEnabled;
    updateThemeUI(theme);
    
    for (const key in sliders) {
      const val = siteSettings[key] !== undefined ? siteSettings[key] : defaultSettings[key];
      sliders[key].value = val;
      values[key].textContent = formatVal(key, val);
      updateSliderBackground(sliders[key]);
    }

    updateIgnoreImagesUI(siteSettings.ignoreImages !== undefined ? siteSettings.ignoreImages : true);
    customCssInput.value = siteSettings.customCss || '';
  });

  const getUiSettings = () => ({
    enabled: siteToggle.checked,
    theme: currentTheme,
    brightness: parseInt(sliders.brightness.value),
    contrast: parseInt(sliders.contrast.value),
    grayscale: parseInt(sliders.grayscale.value),
    sepia: parseInt(sliders.sepia.value),
    invert: parseInt(sliders.invert.value),
    hueRotate: parseInt(sliders.hueRotate.value),
    saturate: parseInt(sliders.saturate.value),
    colorTemp: parseInt(sliders.colorTemp.value),
    blueLight: parseInt(sliders.blueLight.value),
    blur: parseInt(sliders.blur.value),
    opacity: parseInt(sliders.opacity.value),
    bgDim: parseInt(sliders.bgDim.value),
    textBoost: parseInt(sliders.textBoost.value),
    imageDim: parseInt(sliders.imageDim.value),
    ignoreImages: ignoreImagesState,
    customCss: customCssInput.value
  });

  const previewSettings = () => {
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'previewSettings',
        settings: getUiSettings()
      }).catch(() => {});
    }
  };

  const saveAndApply = () => {
    const siteSettings = getUiSettings();

    const toSave = {};
    if (host !== 'Unknown Site') {
      toSave[storageKey] = siteSettings;
    }
    chrome.storage.local.set(toSave);

    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'updateSettings',
        settings: siteSettings
      }).catch(err => {});
    }
  };

  const syncGlobals = () => {
    chrome.tabs.query({}, (tabs) => {
      for (const t of tabs) {
        chrome.tabs.sendMessage(t.id, {
          action: 'syncGlobals'
        }).catch(() => {});
      }
    });
  };

  // Preset Selection Listener
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    let targetPreset = null;

    if (presets[val]) {
      targetPreset = presets[val];
    } else if (val.startsWith('preset:')) {
      chrome.storage.local.get([val], (res) => {
        if (res[val]) {
          applyPresetObject(res[val]);
        }
      });
      return;
    }

    if (targetPreset) {
      applyPresetObject(targetPreset);
    }
  });

  const applyPresetObject = (presetObj) => {
    for (const key in sliders) {
      if (presetObj[key] !== undefined) {
        sliders[key].value = presetObj[key];
        values[key].textContent = formatVal(key, presetObj[key]);
        updateSliderBackground(sliders[key]);
      }
    }
    if (presetObj.ignoreImages !== undefined) {
      updateIgnoreImagesUI(presetObj.ignoreImages);
    }
    saveAndApply();
  };

  // Save Custom Preset
  savePresetBtn.addEventListener('click', () => {
    const presetName = prompt('Enter a name for your custom preset:');
    if (!presetName || !presetName.trim()) return;

    const cleanName = presetName.trim();
    const presetKey = `preset:${cleanName}`;
    const currentValues = {};
    for (const key in sliders) {
      currentValues[key] = parseInt(sliders[key].value);
    }
    currentValues.ignoreImages = ignoreImagesState;

    chrome.storage.local.set({ [presetKey]: currentValues }, () => {
      chrome.storage.local.get(null, (res) => {
        loadCustomPresets(res);
        presetSelect.value = presetKey;
      });
    });
  });

  // Toggle CSS Panel
  cssBtn.addEventListener('click', () => {
    cssPanel.classList.toggle('hidden');
  });

  // Toggle Ignore Images
  ignoreImagesBtn.addEventListener('click', () => {
    updateIgnoreImagesUI(!ignoreImagesState);
    saveAndApply();
  });

  // Global Listeners
  globalToggle.addEventListener('change', () => {
    chrome.storage.local.set({ global: globalToggle.checked });
    syncGlobals();
    
    if (modeSelect.value === 'blacklist') {
      siteToggle.checked = globalToggle.checked;
      saveAndApply();
    }
  });

  autoSyncToggle.addEventListener('change', () => {
    chrome.storage.local.set({ autoSync: autoSyncToggle.checked });
    
    if (autoSyncToggle.checked) {
      globalToggle.disabled = true;
      globalToggle.parentElement.style.opacity = '0.5';
    } else {
      globalToggle.disabled = false;
      globalToggle.parentElement.style.opacity = '1';
    }
    syncGlobals();
  });

  modeSelect.addEventListener('change', () => {
    chrome.storage.local.set({ globalMode: modeSelect.value });
    syncGlobals();
  });

  // Site control listeners
  siteToggle.addEventListener('change', saveAndApply);
  
  siteThemeBtn.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateThemeUI(nextTheme);
    saveAndApply();
  });

  // Sliders
  for (const key in sliders) {
    sliders[key].addEventListener('input', (e) => {
      values[key].textContent = formatVal(key, e.target.value);
      updateSliderBackground(e.target);
      previewSettings();
    });

    sliders[key].addEventListener('change', () => {
      saveAndApply();
    });
  }

  // Custom CSS Listener with debounce
  let cssTimeout;
  customCssInput.addEventListener('input', () => {
    clearTimeout(cssTimeout);
    cssTimeout = setTimeout(() => {
      saveAndApply();
    }, 400);
  });

  // Individual reset buttons
  const resetIcons = document.querySelectorAll('.f-rst');
  resetIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      const targetKey = e.target.getAttribute('data-target');
      if (sliders[targetKey]) {
        sliders[targetKey].value = defaultSettings[targetKey];
        values[targetKey].textContent = formatVal(targetKey, defaultSettings[targetKey]);
        updateSliderBackground(sliders[targetKey]);
        saveAndApply();
      }
    });
  });

  // Reset all for current site
  resetBtn.addEventListener('click', () => {
    if (host !== 'Unknown Site') {
      chrome.storage.local.remove(storageKey, () => {
        const isGlobal = globalToggle.checked;
        const mode = modeSelect.value;
        siteToggle.checked = isGlobal && mode === 'blacklist';
        currentTheme = mode === 'blacklist' ? 'dark' : 'light';
        updateThemeUI(currentTheme);
        
        for (const key in sliders) {
          sliders[key].value = defaultSettings[key];
          values[key].textContent = formatVal(key, defaultSettings[key]);
          updateSliderBackground(sliders[key]);
        }
        updateIgnoreImagesUI(true);
        customCssInput.value = '';
        presetSelect.value = 'default';
        
        if (tab && tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: { ...defaultSettings, enabled: siteToggle.checked, theme: currentTheme }
          }).catch(() => {});
        }
      });
    }
  });

  // Export Settings
  exportBtn.addEventListener('click', () => {
    chrome.storage.local.get(null, (data) => {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `antigravity-config-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // Import Settings
  importBtn.addEventListener('click', () => {
    importFile.click();
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (typeof importedData === 'object' && importedData !== null) {
          chrome.storage.local.set(importedData, () => {
            alert('Settings imported successfully!');
            window.location.reload();
          });
        } else {
          alert('Invalid configuration file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  });
});
