import { create } from 'zustand'

export const useDesignerStore = create((set, get) => ({
  // Canvas ref
  fabricCanvas: null,
  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),

  // Active tab
  activeTab: 'upload',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Mockup type
  mockupType: 'tshirt',
  setMockupType: (type) => set({ mockupType: type }),

  // Shirt/product color
  shirtColor: '#FFFFFF',
  setShirtColor: (color) => set({ shirtColor: color }),

  // Shirt side (front/back) — kept for compat
  shirtSide: 'front',
  setShirtSide: (side) => set({ shirtSide: side }),

  // Canvas zoom level
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),

  // Show grid overlay
  showGrid: false,
  setShowGrid: (v) => set({ showGrid: v }),

  // Show snap guides
  snapEnabled: true,
  setSnapEnabled: (v) => set({ snapEnabled: v }),

  // Selected object on canvas
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  // Layers list (mirrored from fabric canvas)
  layers: [],
  setLayers: (newLayers) => {
    const current = get().layers
    if (
      current.length === newLayers.length &&
      current.every((item, idx) => item === newLayers[idx])
    ) {
      return
    }
    set({ layers: newLayers })
  },

  // Undo/redo history stacks
  historyStack: [],
  redoStack: [],

  pushHistory: (json) =>
    set((state) => ({
      historyStack: [...state.historyStack.slice(-49), json], // cap at 50
      redoStack: [],
    })),

  undo: () => {
    const { fabricCanvas, historyStack, redoStack } = get()
    if (!fabricCanvas || historyStack.length === 0) return
    const current = JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked']))
    const previous = historyStack[historyStack.length - 1]
    fabricCanvas.loadFromJSON(previous).then(() => {
      fabricCanvas.renderAll()
      set({
        historyStack: historyStack.slice(0, -1),
        redoStack: [...redoStack, current],
      })
    })
  },

  redo: () => {
    const { fabricCanvas, historyStack, redoStack } = get()
    if (!fabricCanvas || redoStack.length === 0) return
    const current = JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked']))
    const next = redoStack[redoStack.length - 1]
    fabricCanvas.loadFromJSON(next).then(() => {
      fabricCanvas.renderAll()
      set({
        historyStack: [...historyStack, current],
        redoStack: redoStack.slice(0, -1),
      })
    })
  },

  // Clear canvas (keep mockup/printarea)
  clearCanvas: () => {
    const { fabricCanvas } = get()
    if (!fabricCanvas) return
    const toRemove = fabricCanvas
      .getObjects()
      .filter((o) => o._type !== 'shirt' && o._type !== 'printArea' && o._type !== 'grid')
    toRemove.forEach((o) => fabricCanvas.remove(o))
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
    set({ selectedObject: null, layers: [] })
  },
}))
