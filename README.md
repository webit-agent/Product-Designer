# 👕 Product Designer Pro Studio

An interactive, canvas-based Product Designer web application built with **React 19**, **Fabric.js 7**, **Tailwind CSS v4**, and **Zustand**. It allows users to customize mockups (T-shirts, hoodies, mugs, caps, tote bags, phone cases, and tank tops) in real time with graphics, custom text, curved/arc typography, gradients, layers, and high-resolution exports.

---

## 🚀 Live Demo & Development Status

- **Status:** Running & Managed via **PM2**
- **Port:** `5173` (Host: `0.0.0.0`)
- **App URL:** `http://localhost:5173/`

---

## ⚡ PM2 Process Management

The application is deployed and kept alive using **PM2**, ensuring continuous uptime, background execution, and automatic restarts.

### Quick PM2 Commands

| Action | Command |
|---|---|
| **Check Status** | `pm2 status` or `pm2 list` |
| **View Live Logs** | `pm2 logs product-designer` |
| **View Recent Logs (No stream)** | `pm2 logs product-designer --lines 50 --nostream` |
| **Restart Application** | `pm2 restart product-designer` |
| **Stop Application** | `pm2 stop product-designer` |
| **Start / Launch Process** | `pm2 start "npm run dev -- --host 0.0.0.0 --port 5173" --name product-designer` |
| **Monitor Metrics (CPU / Mem)** | `pm2 monit` |

### PM2 Process Details
- **Process Name:** `product-designer`
- **Process ID:** `0`
- **Interpreter:** Node.js
- **Default Working Directory:** `/workspaces/Product-Designer`
- **Log Files Location:**
  - Standard Output: `~/.pm2/logs/product-designer-out.log`
  - Error Output: `~/.pm2/logs/product-designer-error.log`

---

## ✨ Features

### 1. Multi-Product Mockup Preview
- **8 Product Types:**
  - 👕 **T-Shirt** (Front & Back views)
  - 🧥 **Hoodie** (Front with zipper/pocket & Back view)
  - ☕ **Mug** (Curved ceramic gradient & handle)
  - 🧢 **Snapback Cap** (Crown panels, brim, and sweatband)
  - 👜 **Tote Bag** (Canvas texture, gussets, and handles)
  - 📱 **Phone Case** (Camera cutouts and side buttons)
  - 🎽 **Tank Top** (Athletic cut with armholes and seams)
- **Dynamic Printable Area:** Automatically calculates and displays dashed boundary guides tailored to each product geometry.
- **30+ Product Colors:** Organized swatch palette (neutrals, blues, greens, warm tones, purples) + custom HEX color picker.

### 2. Design Input & Typography
- **Image Upload:** Drag-and-drop zone and native file picker supporting PNG, JPG, SVG, and WEBP.
- **Clipart Library:** Built-in vector cliparts (Stars, Hearts, Lightning, Skulls, Flowers, Flames, Diamonds, Crowns, Waves, etc.).
- **Advanced Text Engine:**
  - 12 curated fonts (Impact, Georgia, Arial, Futura, Comic Sans, etc.)
  - Font size, letter-spacing, and line-height sliders
  - Bold, Italic, and Underline formatting
  - **Curved / Arc Text:** Real-time circular text path generation
  - **Gradient Text:** 6 multi-stop gradient presets (Sunset, Ocean, Forest, Candy, Gold, Night)
  - **Text Outline:** Configurable stroke width and outline color

### 3. Canvas Manipulation & Controls
- **Transformations:** Move, scale, rotate, flip horizontally, and flip vertically.
- **Alignment:** Quick buttons to center elements horizontally or vertically within the print area.
- **Layer Stacking:** Full layer manager with lock/unlock, visibility toggles, bring forward, send backward, duplicate, and delete.
- **Canvas Guides & Helpers:**
  - Toggleable measurement grid overlay
  - Snap-to-center magnetic guide
  - Zoom controls (40% to 200%) with reset
- **History (Undo / Redo):** Up to 50 state snapshots with full keyboard shortcut support (`Ctrl+Z`, `Ctrl+Y`).
- **Keyboard Shortcuts:** `Del`/`Backspace` to delete, `Ctrl+D` to duplicate, `Ctrl+Z` to undo, `Ctrl+Y` to redo.

### 4. Output & Export Center
- **Full Mockup PNG:** 2× resolution mockup with product texture and background.
- **Print-Ready PNG:** 3× resolution image cropped strictly to the printable area.
- **Transparent PNG:** Artwork-only export without shirt background for direct print vendors.
- **Vector SVG Export:** Scalable vector format export.

---

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Canvas Library:** [Fabric.js 7](https://fabricjs.com/)
- **State Management:** [Zustand 5](https://zustand-demo.pmnd.rs/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Process Manager:** [PM2](https://pm2.keymetrics.io/)

---

## 📁 Project Structure

```
Product-Designer/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── DesignCanvas.jsx     # Fabric.js canvas, isolated DOM container, zoom & alignment
│   │   ├── ColorPicker.jsx      # Product color swatches & custom HEX input
│   │   ├── DesignGallery.jsx    # Vector clipart gallery
│   │   ├── ErrorBoundary.jsx    # React error boundary
│   │   ├── LayersPanel.jsx      # Layer stack, locks, show/hide, ordering
│   │   ├── MockupPicker.jsx     # Product switcher (T-shirt, hoodie, mug, etc.)
│   │   ├── PreviewModal.jsx     # 300 DPI PNG/SVG export modal
│   │   ├── PropertiesPanel.jsx  # Element transforms, position, size, fill
│   │   ├── TextEditor.jsx       # Typography, curved text, gradients, outlines
│   │   ├── ToolPanel.jsx        # Sidebar navigation container
│   │   └── UploadPanel.jsx      # Drag-and-drop image upload
│   ├── lib/
│   │   └── mockups.js           # SVG generator models & printable area coordinates
│   ├── store/
│   │   └── useDesignerStore.js  # Zustand state store
│   ├── App.jsx                  # Main studio interface & toolbar
│   ├── index.css                # Tailwind CSS imports
│   └── main.jsx                 # Application entry point with ErrorBoundary
├── package.json
├── vite.config.js
└── README.md
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/webit-agent/Product-Designer.git
cd Product-Designer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
