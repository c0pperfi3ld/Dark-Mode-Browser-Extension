# Antigravity Dark Mode 🌘

> **A high-performance, ultra-customizable dark mode extension for modern web browsers.**

Antigravity transforms the web into a highly personalized reading experience. Built with a focus on performance, aesthetics, and granular control, it uses hardware-accelerated CSS variables to invert and adjust colors without the heavy DOM-mutation overhead of traditional dark mode extensions.

![Antigravity UI Preview](https://via.placeholder.com/800x400?text=Antigravity+Dark+Mode+UI) <!-- Replace with actual screenshot -->

## ✨ Features

- **Zero-Scrollbar, High-Density UI**: A modern, slick, "one-go" layout panel providing instant access to all 14 sliders.
- **Granular Control Engine**:
  - **Core adjustments**: Brightness, Contrast, Grayscale, Sepia
  - **Color engine**: Invert, Hue Rotate, Saturation, **Color Temperature (2700K - 6500K)**
  - **Comfort**: Blue Light Filter, Focus Blur, Opacity, Background Dimmer
  - **Readability**: Text Contrast Boost, Image Dimmer
- **Smart Image Protection**: Easily toggle image inversion. Media elements (`<img>`, `<video>`, `<svg>`, backgrounds) dynamically preserve their original colors while the rest of the page remains dark.
- **Robust Preset System**: Includes highly tuned defaults (Night Owl, Reading, Cinema, etc.) and the ability to save your own custom configurations instantly.
- **Zero DOM Mutation**: Operates entirely on native CSS Custom Properties and `mix-blend-mode` overlays injected at the root HTML level, ensuring minimal memory consumption and buttery-smooth performance.
- **Site-Specific Isolation**: Settings are mapped locally per-hostname. Tweaking settings on one site will not bleed over to another.
- **Import / Export**: Port your setups seamlessly across devices via JSON export.

## 🚀 Installation

1. Clone or download this repository.
   ```bash
   git clone https://github.com/yourusername/antigravity-dark-mode.git
   ```
2. Open Chrome/Edge/Brave and navigate to the Extensions page (`chrome://extensions/`).
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `Antigravity` directory.
5. Pin the extension to your toolbar and enjoy!

## ⚙️ How it Works

Unlike older extensions that loop through every element on the page to change colors (causing layout thrashing and lag), Antigravity injects a single, static `<style>` block containing hardware-accelerated CSS filters (e.g., `invert()`, `hue-rotate()`) mapped to dynamic CSS variables. The popup simply updates the variable values (like `--ag-brightness`) on the `html` root element.

## 🛠️ Tech Stack

- **Vanilla JavaScript**: Lightweight and robust, no bloated frameworks.
- **CSS3 / Variables**: Maximum rendering efficiency and dynamic styling.
- **Chrome Extension Manifest V3**: Secure, modern background service workers.

## 📝 Roadmap

- Sync configuration securely across cloud storage.
- Auto-detect optimal text contrast based on background luminescence.
- More robust visual debugging for custom CSS injection.

## 📄 License

MIT License. See [LICENSE](LICENSE) for more information.
