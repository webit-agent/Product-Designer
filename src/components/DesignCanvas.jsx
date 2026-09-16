import { useEffect, useRef, useCallback } from 'react'
import { Canvas, FabricImage, Rect, Line, Group } from 'fabric'
import { ZoomIn, ZoomOut, Maximize2, Grid3X3, Magnet } from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'
import { getMockupUrl, PRINT_AREAS, CANVAS_DIMS } from '../lib/mockups'

const CANVAS_DISPLAY_WIDTH = 420

export default function DesignCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const fabricRef = useRef(null)
  const mockupImgRef = useRef(null)
  const printAreaRef = useRef(null)
  const gridGroupRef = useRef(null)

  const {
    setFabricCanvas,
    mockupType,
    shirtColor,
    setSelectedObject,
    setLayers,
    pushHistory,
    zoom, setZoom,
    showGrid, setShowGrid,
    snapEnabled, setSnapEnabled,
  } = useDesignerStore()

  // Sync layers from canvas
  const syncLayers = useCallback((canvas) => {
    if (!canvas) return
    const objects = canvas.getObjects().filter(
      (o) => o._type !== 'printArea' && o._type !== 'shirt' && o._type !== 'grid'
    )
    setLayers([...objects].reverse())
  }, [setLayers])

  // Save state to undo stack
  const saveHistory = useCallback((canvas) => {
    if (!canvas) return
    pushHistory(JSON.stringify(canvas.toJSON(['_type', 'id', '_locked'])))
  }, [pushHistory])

  // Build grid overlay
  const buildGrid = useCallback((canvas, dims) => {
    if (gridGroupRef.current) {
      canvas.remove(gridGroupRef.current)
      gridGroupRef.current = null
    }
    const lines = []
    const spacing = 20
    for (let x = 0; x <= dims.width; x += spacing) {
      lines.push(new Line([x, 0, x, dims.height], {
        stroke: '#4f46e520', strokeWidth: 1, selectable: false, evented: false,
      }))
    }
    for (let y = 0; y <= dims.height; y += spacing) {
      lines.push(new Line([0, y, dims.width, y], {
        stroke: '#4f46e520', strokeWidth: 1, selectable: false, evented: false,
      }))
    }
    const group = new Group(lines, {
      selectable: false, evented: false, _type: 'grid',
    })
    canvas.insertAt(1, group)
    gridGroupRef.current = group
  }, [])

  // Load mockup image
  const loadMockup = useCallback(async (canvas, type, color) => {
    if (!canvas) return
    const dims = CANVAS_DIMS[type] || CANVAS_DIMS.tshirt
    const url = getMockupUrl(type, color, 'front')
    const img = await FabricImage.fromURL(url)
    img.set({ left: 0, top: 0, selectable: false, evented: false, _type: 'shirt' })
    img.scaleToWidth(dims.width)
    img.scaleToHeight(dims.height)

    if (mockupImgRef.current) canvas.remove(mockupImgRef.current)
    canvas.insertAt(0, img)
    mockupImgRef.current = img
    canvas.renderAll()
  }, [])

  // Update canvas size + printable area when mockup changes
  const applyMockupConfig = useCallback((canvas, type) => {
    const dims = CANVAS_DIMS[type] || CANVAS_DIMS.tshirt
    const pa = PRINT_AREAS[type] || PRINT_AREAS.tshirt
    canvas.setWidth(dims.width)
    canvas.setHeight(dims.height)

    if (printAreaRef.current) canvas.remove(printAreaRef.current)
    const printArea = new Rect({
      left: pa.left, top: pa.top,
      width: pa.width, height: pa.height,
      fill: 'transparent',
      stroke: '#4f46e5',
      strokeWidth: 1.5,
      strokeDashArray: [6, 4],
      selectable: false, evented: false,
      _type: 'printArea',
    })
    canvas.add(printArea)
    printAreaRef.current = printArea
    return dims
  }, [])

  // Initialize fabric canvas once
  useEffect(() => {
    const dims = CANVAS_DIMS.tshirt
    const canvas = new Canvas(canvasRef.current, {
      width: dims.width,
      height: dims.height,
      backgroundColor: '#f3f4f6',
      preserveObjectStacking: true,
    })
    fabricRef.current = canvas
    setFabricCanvas(canvas)

    applyMockupConfig(canvas, 'tshirt')
    loadMockup(canvas, 'tshirt', '#FFFFFF')

    // Object events
    canvas.on('object:added', () => {
      if (printAreaRef.current) canvas.bringObjectToFront(printAreaRef.current)
      if (gridGroupRef.current) canvas.bringObjectToFront(gridGroupRef.current)
      syncLayers(canvas)
    })
    canvas.on('object:removed', () => syncLayers(canvas))
    canvas.on('object:modified', (e) => {
      syncLayers(canvas)
      saveHistory(canvas)

      // Snap to center logic
      const obj = e.target
      if (!obj) return
      const store = useDesignerStore.getState()
      if (!store.snapEnabled) return
      const canvasCenterX = canvas.getWidth() / 2
      const canvasCenterY = canvas.getHeight() / 2
      const objCenterX = obj.getCenterPoint().x
      const objCenterY = obj.getCenterPoint().y
      const snapDist = 12
      let snapped = false
      if (Math.abs(objCenterX - canvasCenterX) < snapDist) {
        obj.set('left', canvasCenterX - (obj.getScaledWidth() / 2))
        snapped = true
      }
      if (Math.abs(objCenterY - canvasCenterY) < snapDist) {
        obj.set('top', canvasCenterY - (obj.getScaledHeight() / 2))
        snapped = true
      }
      if (snapped) canvas.renderAll()
    })

    canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null))
    canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0] || null))
    canvas.on('selection:cleared', () => setSelectedObject(null))

    // Keyboard shortcuts
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const store = useDesignerStore.getState()
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        store.undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        store.redo()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject()
        if (active && active._type !== 'shirt' && active._type !== 'printArea') {
          canvas.remove(active)
          canvas.renderAll()
          saveHistory(canvas)
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        const active = canvas.getActiveObject()
        if (active) {
          active.clone().then(clone => {
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
      canvas.dispose()
      fabricRef.current = null
      setFabricCanvas(null)
      window.removeEventListener('keydown', handleKey)
    }
  }, []) // eslint-disable-line

  // React to mockup type changes
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const dims = applyMockupConfig(canvas, mockupType)
    loadMockup(canvas, mockupType, shirtColor)
    // Rebuild grid if showing
    const store = useDesignerStore.getState()
    if (store.showGrid) buildGrid(canvas, dims)
  }, [mockupType]) // eslint-disable-line

  // React to color changes
  useEffect(() => {
    if (fabricRef.current) loadMockup(fabricRef.current, mockupType, shirtColor)
  }, [shirtColor, mockupType]) // eslint-disable-line

  // React to grid toggle
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    if (showGrid) {
      const dims = CANVAS_DIMS[mockupType] || CANVAS_DIMS.tshirt
      buildGrid(canvas, dims)
    } else {
      if (gridGroupRef.current) {
        canvas.remove(gridGroupRef.current)
        gridGroupRef.current = null
      }
    }
    canvas.renderAll()
  }, [showGrid]) // eslint-disable-line

  // Apply zoom
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.setZoom(zoom)
    const dims = CANVAS_DIMS[mockupType] || CANVAS_DIMS.tshirt
    canvas.setWidth(dims.width * zoom)
    canvas.setHeight(dims.height * zoom)
    canvas.renderAll()
  }, [zoom]) // eslint-disable-line

  const handleZoomIn = () => setZoom(Math.min(2, parseFloat((zoom + 0.1).toFixed(1))))
  const handleZoomOut = () => setZoom(Math.max(0.4, parseFloat((zoom - 0.1).toFixed(1))))
  const handleZoomReset = () => setZoom(1)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Zoom controls */}
      <div className="flex items-center gap-1.5 bg-white rounded-xl shadow border border-gray-100 px-2 py-1.5">
        <button onClick={handleZoomOut} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="Zoom out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={handleZoomReset} className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg min-w-[48px] text-center transition-colors" title="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={handleZoomIn} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="Zoom in">
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-lg transition-colors ${showGrid ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-400'}`}
          title="Toggle grid"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setSnapEnabled(!snapEnabled)}
          className={`p-1.5 rounded-lg transition-colors ${snapEnabled ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-400'}`}
          title="Toggle snap-to-center"
        >
          <Magnet className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomReset}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          title="Fit to view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden shadow-2xl bg-white border border-gray-200"
        style={{ lineHeight: 0 }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 border border-indigo-400 border-dashed rounded-sm" />
          Printable area
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">Del</kbd>
          Delete
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">Ctrl+D</kbd>
          Duplicate
        </span>
      </div>
    </div>
  )
}
