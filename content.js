// content.js - Antigravity v2.0
(async () => {
  const host = window.location.hostname;
  const storageKey = `site:${host}`;

  // Default settings schema
  let settings = {
    enabled: null,
    theme: 'dark',
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
    invert: 100,
    hueRotate: 180,
    saturate: 100,
    imageDim: 0,
    // v2.0 Filters & Options
    blueLight: 0,
    colorTemp: 6500,
    blur: 0,
    opacity: 100,
    textBoost: 0,
    bgDim: 0,
    ignoreImages: true,
    customCss: ''
  };

  // Main filter style element
  const styleEl = document.createElement('style');
  styleEl.id = 'antigravity-dark-mode-static-style';

  // Custom CSS style element
  const customStyleEl = document.createElement('style');
  customStyleEl.id = 'antigravity-custom-css-style';

  // Static CSS supporting Dark, Light modes, media re-inversion, dimming, text boost & filters
  const staticCss = `
    /* Dark Mode (Inverted + Color Engine) */
    html[data-ag-active="true"][data-ag-theme="dark"] {
      filter: invert(var(--ag-invert, 100%)) 
              hue-rotate(var(--ag-hue, 180deg)) 
              brightness(var(--ag-brightness, 100%)) 
              contrast(var(--ag-contrast, 100%)) 
              sepia(calc(var(--ag-sepia, 0%) + var(--ag-blue-light, 0%) * 0.4)) 
              grayscale(var(--ag-grayscale, 0%)) 
              saturate(var(--ag-saturate, 100%)) 
              blur(var(--ag-blur, 0px)) 
              opacity(var(--ag-opacity, 100%)) !important;
      background-color: #121212 !important;
    }
    
    /* Light Mode (Customized White Mode) */
    html[data-ag-active="true"][data-ag-theme="light"] {
      filter: brightness(var(--ag-brightness, 100%)) 
              contrast(var(--ag-contrast, 100%)) 
              sepia(calc(var(--ag-sepia, 0%) + var(--ag-blue-light, 0%) * 0.4)) 
              grayscale(var(--ag-grayscale, 0%)) 
              saturate(var(--ag-saturate, 100%)) 
              blur(var(--ag-blur, 0px)) 
              opacity(var(--ag-opacity, 100%)) !important;
    }
    
    /* Re-invert media ONLY in Dark Mode when ignoreImages is true */
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] img, 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] video, 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] iframe, 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] canvas, 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] svg, 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] embed[type="application/x-shockwave-flash"], 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] object[type="application/x-shockwave-flash"], 
    html[data-ag-active="true"][data-ag-theme="dark"][data-ag-ignore-images="true"] [style*="background-image"] {
      filter: invert(var(--ag-invert, 100%)) hue-rotate(var(--ag-hue, 180deg)) !important;
    }
    
    /* Image dimming applies to media in BOTH modes */
    html[data-ag-active="true"] img, 
    html[data-ag-active="true"] video, 
    html[data-ag-active="true"] iframe, 
    html[data-ag-active="true"] canvas, 
    html[data-ag-active="true"] svg, 
    html[data-ag-active="true"] embed[type="application/x-shockwave-flash"], 
    html[data-ag-active="true"] object[type="application/x-shockwave-flash"], 
    html[data-ag-active="true"] [style*="background-image"] {
      opacity: calc(1 - (var(--ag-image-dim, 0) / 100)) !important;
    }

    /* Text Contrast Boost */
    html[data-ag-active="true"][data-ag-text-boost="1"] p,
    html[data-ag-active="true"][data-ag-text-boost="1"] span,
    html[data-ag-active="true"][data-ag-text-boost="1"] h1,
    html[data-ag-active="true"][data-ag-text-boost="1"] h2,
    html[data-ag-active="true"][data-ag-text-boost="1"] h3,
    html[data-ag-active="true"][data-ag-text-boost="1"] h4,
    html[data-ag-active="true"][data-ag-text-boost="1"] h5,
    html[data-ag-active="true"][data-ag-text-boost="1"] h6,
    html[data-ag-active="true"][data-ag-text-boost="1"] a,
    html[data-ag-active="true"][data-ag-text-boost="1"] li {
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.8), 0 0 0.5px currentColor !important;
    }
    html[data-ag-active="true"][data-ag-text-boost="2"] p,
    html[data-ag-active="true"][data-ag-text-boost="2"] span,
    html[data-ag-active="true"][data-ag-text-boost="2"] h1,
    html[data-ag-active="true"][data-ag-text-boost="2"] h2,
    html[data-ag-active="true"][data-ag-text-boost="2"] h3,
    html[data-ag-active="true"][data-ag-text-boost="2"] h4,
    html[data-ag-active="true"][data-ag-text-boost="2"] h5,
    html[data-ag-active="true"][data-ag-text-boost="2"] h6,
    html[data-ag-active="true"][data-ag-text-boost="2"] a,
    html[data-ag-active="true"][data-ag-text-boost="2"] li {
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.9), 0 0 1px currentColor, -0.5px 0 0.5px currentColor !important;
      font-weight: 500 !important;
    }
    html[data-ag-active="true"][data-ag-text-boost="3"] p,
    html[data-ag-active="true"][data-ag-text-boost="3"] span,
    html[data-ag-active="true"][data-ag-text-boost="3"] h1,
    html[data-ag-active="true"][data-ag-text-boost="3"] h2,
    html[data-ag-active="true"][data-ag-text-boost="3"] h3,
    html[data-ag-active="true"][data-ag-text-boost="3"] h4,
    html[data-ag-active="true"][data-ag-text-boost="3"] h5,
    html[data-ag-active="true"][data-ag-text-boost="3"] h6,
    html[data-ag-active="true"][data-ag-text-boost="3"] a,
    html[data-ag-active="true"][data-ag-text-boost="3"] li {
      text-shadow: 0 0 3px rgba(0,0,0,1), 0 0 1px currentColor, 0.5px 0.5px 0.5px currentColor !important;
      font-weight: 600 !important;
    }

    /* Background Dimming Overlay */
    html[data-ag-active="true"]::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, calc(var(--ag-bg-dim, 0) / 100));
      pointer-events: none;
      z-index: 999998;
      display: var(--ag-bg-dim-display, none);
    }
    
    /* Color Temperature Overlay */
    html[data-ag-active="true"]::after {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--ag-color-temp-color, transparent);
      mix-blend-mode: multiply;
      pointer-events: none;
      z-index: 999999;
    }
  `;
  styleEl.textContent = staticCss;

  const injectStyles = () => {
    if (document.documentElement) {
      if (!document.getElementById('antigravity-dark-mode-static-style')) {
        document.documentElement.appendChild(styleEl);
      }
      if (!document.getElementById('antigravity-custom-css-style')) {
        document.documentElement.appendChild(customStyleEl);
      }
    }
  };

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  }

  function applySettings(siteSettings) {
    if (!siteSettings) return;

    const root = document.documentElement;
    if (!root) return;
    
    if (!siteSettings.enabled) {
      root.removeAttribute('data-ag-active');
      root.removeAttribute('data-ag-theme');
      root.removeAttribute('data-ag-text-boost');
      root.removeAttribute('data-ag-ignore-images');
      root.style.removeProperty('--ag-brightness');
      root.style.removeProperty('--ag-contrast');
      root.style.removeProperty('--ag-sepia');
      root.style.removeProperty('--ag-grayscale');
      root.style.removeProperty('--ag-invert');
      root.style.removeProperty('--ag-hue');
      root.style.removeProperty('--ag-saturate');
      root.style.removeProperty('--ag-image-dim');
      root.style.removeProperty('--ag-blue-light');
      root.style.removeProperty('--ag-blur');
      root.style.removeProperty('--ag-opacity');
      root.style.removeProperty('--ag-bg-dim');
      root.style.removeProperty('--ag-bg-dim-display');
      customStyleEl.textContent = '';
      return;
    }

    root.setAttribute('data-ag-active', 'true');
    root.setAttribute('data-ag-theme', siteSettings.theme || 'dark');
    
    const ignoreImages = siteSettings.ignoreImages !== undefined ? siteSettings.ignoreImages : true;
    root.setAttribute('data-ag-ignore-images', ignoreImages ? 'true' : 'false');
    
    const textBoost = siteSettings.textBoost || 0;
    if (textBoost > 0) {
      root.setAttribute('data-ag-text-boost', textBoost.toString());
    } else {
      root.removeAttribute('data-ag-text-boost');
    }
    
    root.style.setProperty('--ag-brightness', `${siteSettings.brightness}%`);
    root.style.setProperty('--ag-contrast', `${siteSettings.contrast}%`);
    root.style.setProperty('--ag-sepia', `${siteSettings.sepia}%`);
    root.style.setProperty('--ag-grayscale', `${siteSettings.grayscale}%`);
    root.style.setProperty('--ag-invert', `${siteSettings.invert !== undefined ? siteSettings.invert : 100}%`);
    root.style.setProperty('--ag-hue', `${siteSettings.hueRotate !== undefined ? siteSettings.hueRotate : 180}deg`);
    root.style.setProperty('--ag-saturate', `${siteSettings.saturate !== undefined ? siteSettings.saturate : 100}%`);
    root.style.setProperty('--ag-image-dim', `${siteSettings.imageDim !== undefined ? siteSettings.imageDim : 0}`);
    
    // v2.0 Properties
    root.style.setProperty('--ag-blue-light', `${siteSettings.blueLight || 0}%`);
    root.style.setProperty('--ag-blur', `${siteSettings.blur || 0}px`);
    root.style.setProperty('--ag-opacity', `${siteSettings.opacity !== undefined ? siteSettings.opacity : 100}%`);
    
    // Color Temp Logic (2700K - 6500K)
    const temp = siteSettings.colorTemp || 6500;
    if (temp < 6500) {
      // Warm tint: max opacity at 2700K is 0.35 of orange/red
      const intensity = (6500 - temp) / (6500 - 2700);
      root.style.setProperty('--ag-color-temp-color', `rgba(255, 140, 0, ${intensity * 0.35})`);
    } else {
      root.style.setProperty('--ag-color-temp-color', 'transparent');
    }

    const bgDim = siteSettings.bgDim || 0;
    root.style.setProperty('--ag-bg-dim', `${bgDim}`);
    root.style.setProperty('--ag-bg-dim-display', bgDim > 0 ? 'block' : 'none');

    // Custom CSS Injection
    customStyleEl.textContent = siteSettings.customCss || '';
  }

  // OS Dark Mode Listener
  const osDarkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  function checkAndApplyGlobals() {
    chrome.storage.local.get(['global', 'autoSync', 'globalMode', storageKey], (result) => {
      const isAutoSync = result.autoSync !== undefined ? result.autoSync : false;
      let isGlobalEnabled = result.global !== undefined ? result.global : true;
      const globalMode = result.globalMode || 'blacklist';

      if (isAutoSync) {
        isGlobalEnabled = osDarkModeQuery.matches;
      }

      let siteSettings = result[storageKey];
      let finalEnabled = false;
      let finalTheme = 'dark';

      if (siteSettings && siteSettings.enabled !== null && siteSettings.enabled !== undefined) {
        finalEnabled = siteSettings.enabled;
        finalTheme = siteSettings.theme || 'dark';
      } else {
        if (globalMode === 'blacklist') {
          finalEnabled = isGlobalEnabled; 
          finalTheme = 'dark';
        } else {
          finalEnabled = false; 
          finalTheme = 'light';
        }
      }

      if (!siteSettings) siteSettings = { ...settings };
      siteSettings.enabled = finalEnabled;
      siteSettings.theme = finalTheme;
      
      applySettings(siteSettings);
    });
  }

  checkAndApplyGlobals();

  osDarkModeQuery.addEventListener('change', () => {
    chrome.storage.local.get(['autoSync'], (res) => {
      if (res.autoSync) {
        checkAndApplyGlobals();
      }
    });
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'previewSettings' || request.action === 'updateSettings') {
      applySettings(request.settings);
      sendResponse({ success: true });
    } else if (request.action === 'syncGlobals' || request.action === 'toggleGlobal') {
      checkAndApplyGlobals();
      sendResponse({ success: true });
    }
  });
})();
