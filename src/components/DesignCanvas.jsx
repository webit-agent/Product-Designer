import { useEffect, useRef, useCallback } from 'react'
import { Canvas, FabricImage, Rect, Line, Group } from 'fabric'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Magnet,
  AlignCenterHorizontal,
  AlignCenterVertical,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'
import { getMockupUrl, PRINT_AREAS, CANVAS_DIMS } from '../lib/mockups'

export default function DesignCanvas() {
  const containerRef = useRef(null)
  const fabricRef = useRef(null)
  const mockupImgRef = useRef(null)
  const printAreaRef = useRef(null)
  const gridGroupRef = useRef(null)
  const isMountedRef = useRef(true)
  const loadIdRef = useRef(0)

  // Granular Zustand subscriptions to avoid unnecessary re-renders
  const mockupType = useDesignerStore((s) => s.mockupType)
  const shirtColor = useDesignerStore((s) => s.shirtColor)
  const zoom = useDesignerStore((s) => s.zoom)
  const setZoom = useDesignerStore((s) => s.setZoom)
  const showGrid = useDesignerStore((s) => s.showGrid)
  const setShowGrid = useDesignerStore((s) => s.setShowGrid)
  const snapEnabled = useDesignerStore((s) => s.snapEnabled)
  const setSnapEnabled = useDesignerStore((s) => s.setSnapEnabled)

  // Sync layers from canvas safely
  const syncLayers = useCallback((canvas) => {
    if (!canvas || !isMountedRef.current) return
    const objects = canvas.getObjects().filter(
      (o) => o._type !== 'printArea' && o._type !== 'shirt' && o._type !== 'grid' && o._type !== 'guide'
    )
    useDesignerStore.getState().setLayers([...objects].reverse())
  }, [])

  // Save history state
  const saveHistory = useCallback((canvas) => {
    if (!canvas || !isMountedRef.current) return
    useDesignerStore.getState().pushHistory(
      JSON.stringify(canvas.toJSON(['_type', 'id', '_locked']))
    )
  }, [])

  // Build grid overlay
  const buildGrid = useCallback((canvas, dims) => {
    if (!canvas) return
    if (gridGroupRef.current) {
      canvas.remove(gridGroupRef.current)
      gridGroupRef.current = null
    }
    const lines = []
    const spacing = 20
    for (let x = 0; x <= dims.width; x += spacing) {
      lines.push(
        new Line([x, 0, x, dims.height], {
          stroke: '#4f46e518',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
      )
    }
    for (let y = 0; y <= dims.height; y += spacing) {
      lines.push(
        new Line([0, y, dims.width, y], {
          stroke: '#4f46e518',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
      )
    }
    const group = new Group(lines, {
      selectable: false,
      evented: false,
      _type: 'grid',
    })
    canvas.insertAt(1, group)
    gridGroupRef.current = group
    canvas.renderAll()
  }, [])

  // Load mockup SVG image safely
  const loadMockup = useCallback(async (canvas, type, color) => {
    if (!canvas || !isMountedRef.current) return
    const currentLoadId = ++loadIdRef.current
    try {
      const dims = CANVAS_DIMS[type] || CANVAS_DIMS.tshirt
      const url = getMockupUrl(type, color, 'front')
      const img = await FabricImage.fromURL(url)
      
      if (!isMountedRef.current || loadIdRef.current !== currentLoadId) {
        return
      }

      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        _type: 'shirt',
      })
      img.scaleToWidth(dims.width)
      img.scaleToHeight(dims.height)

      if (mockupImgRef.current) {
        canvas.remove(mockupImgRef.current)
      }
      canvas.insertAt(0, img)
      mockupImgRef.current = img
      canvas.renderAll()
    } catch (err) {
      console.warn('Mockup load error:', err)
    }
  }, [])

  // Apply printable area + canvas dimensions
  const applyMockupConfig = useCallback((canvas, type) => {
    if (!canvas) return
    const dims = CANVAS_DIMS[type] || CANVAS_DIMS.tshirt
    const pa = PRINT_AREAS[type] || PRINT_AREAS.tshirt
    canvas.setWidth(dims.width)
    canvas.setHeight(dims.height)

    if (printAreaRef.current) {
      canvas.remove(printAreaRef.current)
    }
    const printArea = new Rect({
      left: pa.left,
      top: pa.top,
      width: pa.width,
      height: pa.height,
      fill: 'transparent',
      stroke: '#4f46e5',
      strokeWidth: 1.5,
      strokeDashArray: [6, 4],
      selectable: false,
      evented: false,
      _type: 'printArea',
    })
    canvas.add(printArea)
    printAreaRef.current = printArea
    return dims
  }, [])

  // Initialize Fabric Canvas once imperatively inside the container
  useEffect(() => {
    isMountedRef.current = true
    const container = containerRef.current
    if (!container) return

    // Clean previous DOM elements in container to avoid duplicate canvases
    container.innerHTML = ''
    const canvasEl = document.createElement('canvas')
    container.appendChild(canvasEl)

    const initialDims = CANVAS_DIMS.tshirt
    const canvas = new Canvas(canvasEl, {
      width: initialDims.width,
      height: initialDims.height,
      backgroundColor: '#f8fafc',
      preserveObjectStacking: true,
    })
    fabricRef.current = canvas
    useDesignerStore.getState().setFabricCanvas(canvas)

    applyMockupConfig(canvas, 'tshirt')
    loadMockup(canvas, 'tshirt', '#FFFFFF')

    // Object events
    canvas.on('object:added', (e) => {
      if (e.target && e.target._type !== 'shirt' && e.target._type !== 'printArea' && e.target._type !== 'grid') {
        if (printAreaRef.current) canvas.bringObjectToFront(printAreaRef.current)
        if (gridGroupRef.current) canvas.bringObjectToFront(gridGroupRef.current)
        syncLayers(canvas)
      }
    })

    canvas.on('object:removed', (e) => {
      if (e.target && e.target._type !== 'shirt' && e.target._type !== 'printArea' && e.target._type !== 'grid') {
        syncLayers(canvas)
      }
    })

    canvas.on('object:modified', (e) => {
      syncLayers(canvas)
      saveHistory(canvas)

      // Snap to center
      const obj = e.target
      if (!obj) return
      const store = useDesignerStore.getState()
      if (!store.snapEnabled) return
      const canvasCenterX = canvas.getWidth() / 2
      const canvasCenterY = canvas.getHeight() / 2
      const objCenterX = obj.getCenterPoint().x
      const objCenterY = obj.getCenterPoint().y
      const snapDist = 14
      let snapped = false
      if (Math.abs(objCenterX - canvasCenterX) < snapDist) {
        obj.set('left', canvasCenterX - obj.getScaledWidth() / 2)
        snapped = true
      }
      if (Math.abs(objCenterY - canvasCenterY) < snapDist) {
        obj.set('top', canvasCenterY - obj.getScaledHeight() / 2)
        snapped = true
      }
      if (snapped) canvas.renderAll()
    })

    canvas.on('selection:created', (e) => {
      useDesignerStore.getState().setSelectedObject(e.selected?.[0] || null)
    })
    canvas.on('selection:updated', (e) => {
      useDesignerStore.getState().setSelectedObject(e.selected?.[0] || null)
    })
    canvas.on('selection:cleared', () => {
      useDesignerStore.getState().setSelectedObject(null)
    })

    // Keyboard shortcuts
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const store = useDesignerStore.getState()
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        store.undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        store.redo()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject()
        if (active && active._type !== 'shirt' && active._type !== 'printArea' && !active._locked) {
          canvas.remove(active)
          canvas.renderAll()
          saveHistory(canvas)
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        const active = canvas.getActiveObject()
        if (active && !active._locked) {
          active.clone().then((clone) => {
            clone.set({ left: (clone.left || 0) + 15, top: (clone.top || 0) + 15 })
            canvas.add(clone)
            canvas.setActiveObject(clone)
            canvas.renderAll()
            saveHistory(canvas)
          })
        }
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      isMountedRef.current = false
      window.removeEventListener('keydown', handleKey)
      try {
        canvas.dispose().catch(() => {})
      } catch {}
      fabricRef.current = null
      useDesignerStore.getState().setFabricCanvas(null)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, []) // eslint-disable-line

  // Handle Mockup Type and Color changes together
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !isMountedRef.current) return
    const dims = applyMockupConfig(canvas, mockupType)
    loadMockup(canvas, mockupType, shirtColor)
    if (showGrid) {
      buildGrid(canvas, dims)
    }
  }, [mockupType, shirtColor, applyMockupConfig, loadMockup, showGrid, buildGrid])

  // Handle Grid toggle
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !isMountedRef.current) return
    if (showGrid) {
      const dims = CANVAS_DIMS[mockupType] || CANVAS_DIMS.tshirt
      buildGrid(canvas, dims)
    } else {
      if (gridGroupRef.current) {
        canvas.remove(gridGroupRef.current)
        gridGroupRef.current = null
        canvas.renderAll()
      }
    }
  }, [showGrid, mockupType, buildGrid])

  // Handle Zoom
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !isMountedRef.current) return
    canvas.setZoom(zoom)
    const dims = CANVAS_DIMS[mockupType] || CANVAS_DIMS.tshirt
    canvas.setWidth(dims.width * zoom)
    canvas.setHeight(dims.height * zoom)
    canvas.renderAll()
  }, [zoom, mockupType])

  // Helper actions
  const handleZoomIn = () => setZoom(Math.min(2, parseFloat((zoom + 0.1).toFixed(1))))
  const handleZoomOut = () => setZoom(Math.max(0.4, parseFloat((zoom - 0.1).toFixed(1))))
  const handleZoomReset = () => setZoom(1)

  const centerHorizontally = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active._locked) return
    const canvasCenterX = canvas.getWidth() / (2 * zoom)
    active.set('left', canvasCenterX - active.getScaledWidth() / 2)
    canvas.renderAll()
    saveHistory(canvas)
  }

  const centerVertically = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active._locked) return
    const canvasCenterY = canvas.getHeight() / (2 * zoom)
    active.set('top', canvasCenterY - active.getScaledHeight() / 2)
    canvas.renderAll()
    saveHistory(canvas)
  }

  const rotateActive = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active._locked) return
    active.set('angle', ((active.angle || 0) + 90) % 360)
    canvas.renderAll()
    saveHistory(canvas)
  }

  const flipXActive = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active._locked) return
    active.set('flipX', !active.flipX)
    canvas.renderAll()
    saveHistory(canvas)
  }

  const flipYActive = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active._locked) return
    active.set('flipY', !active.flipY)
    canvas.renderAll()
    saveHistory(canvas)
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Canvas Toolbar Controls */}
      <div className="flex items-center flex-wrap justify-center gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/80 px-3 py-1.5">
        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg min-w-[50px] text-center transition-colors"
            title="Reset zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* View helpers */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-lg transition-colors ${
            showGrid ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title="Toggle grid overlay"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setSnapEnabled(!snapEnabled)}
          className={`p-1.5 rounded-lg transition-colors ${
            snapEnabled ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title="Toggle snap-to-center"
        >
          <Magnet className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomReset}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Fit view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* Quick alignment and transform actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={centerHorizontally}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Center element horizontally"
          >
            <AlignCenterHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={centerVertically}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Center element vertically"
          >
            <AlignCenterVertical className="w-4 h-4" />
          </button>
          <button
            onClick={rotateActive}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Rotate 90° clockwise"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={flipXActive}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Flip horizontally"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={flipYActive}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Flip vertically"
          >
            <FlipVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas container: completely isolated from React's children reconciliation */}
      <div
        ref={containerRef}
        className="relative rounded-2xl shadow-xl bg-slate-50 border border-gray-200 overflow-hidden flex items-center justify-center transition-shadow"
        style={{ minWidth: 320, minHeight: 350 }}
      />

      {/* Helper Legend */}
      <div className="flex items-center flex-wrap justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-indigo-500 border-dashed rounded-sm" />
          Printable Area
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600 font-mono text-[10px]">Del</kbd>
          Delete
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600 font-mono text-[10px]">Ctrl+D</kbd>
          Duplicate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600 font-mono text-[10px]">Ctrl+Z</kbd>
          Undo
        </span>
      </div>
    </div>
  )
}
