import { useState, useEffect, useCallback } from 'react'
import {
  Move,
  RotateCcw,
  Maximize2,
  Layers,
  Trash2,
  Copy,
  FlipHorizontal,
  FlipVertical,
  AlignCenterHorizontal,
  AlignCenterVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'

export default function PropertiesPanel() {
  const fabricCanvas = useDesignerStore((s) => s.fabricCanvas)
  const selectedObject = useDesignerStore((s) => s.selectedObject)
  const pushHistory = useDesignerStore((s) => s.pushHistory)

  const [props, setProps] = useState(null)

  const refreshProps = useCallback(() => {
    if (!selectedObject) {
      setProps(null)
      return
    }

    // Determine safe color string
    let fillHex = '#000000'
    if (typeof selectedObject.fill === 'string' && selectedObject.fill.startsWith('#')) {
      fillHex = selectedObject.fill
    }

    setProps({
      left: Math.round(selectedObject.left || 0),
      top: Math.round(selectedObject.top || 0),
      width: Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1)),
      height: Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1)),
      angle: Math.round(selectedObject.angle || 0),
      opacity: Math.round((selectedObject.opacity ?? 1) * 100),
      fill: fillHex,
      isGradient: typeof selectedObject.fill === 'object' && selectedObject.fill !== null,
    })
  }, [selectedObject])

  useEffect(() => {
    refreshProps()
  }, [selectedObject, refreshProps])

  const update = (key, value) => {
    if (!selectedObject || !fabricCanvas || selectedObject._locked) return
    if (key === 'opacity') {
      selectedObject.set('opacity', value / 100)
    } else if (key === 'width') {
      selectedObject.set('scaleX', value / (selectedObject.width || 1))
    } else if (key === 'height') {
      selectedObject.set('scaleY', value / (selectedObject.height || 1))
    } else {
      selectedObject.set(key, value)
    }
    fabricCanvas.renderAll()
    setProps((p) => (p ? { ...p, [key]: value } : null))
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const deleteSelected = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    fabricCanvas.remove(selectedObject)
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const duplicateSelected = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    selectedObject.clone().then((clone) => {
      clone.set({
        left: (clone.left || 0) + 15,
        top: (clone.top || 0) + 15,
      })
      fabricCanvas.add(clone)
      fabricCanvas.setActiveObject(clone)
      fabricCanvas.renderAll()
      pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
    })
  }

  const centerH = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    const zoom = fabricCanvas.getZoom() || 1
    const canvasCenterX = fabricCanvas.getWidth() / (2 * zoom)
    selectedObject.set('left', canvasCenterX - selectedObject.getScaledWidth() / 2)
    fabricCanvas.renderAll()
    refreshProps()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const centerV = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    const zoom = fabricCanvas.getZoom() || 1
    const canvasCenterY = fabricCanvas.getHeight() / (2 * zoom)
    selectedObject.set('top', canvasCenterY - selectedObject.getScaledHeight() / 2)
    fabricCanvas.renderAll()
    refreshProps()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const flipX = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    selectedObject.set('flipX', !selectedObject.flipX)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const flipY = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    selectedObject.set('flipY', !selectedObject.flipY)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const bringToFront = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    fabricCanvas.bringObjectToFront(selectedObject)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const sendToBack = () => {
    if (!fabricCanvas || !selectedObject || selectedObject._locked) return
    fabricCanvas.sendObjectToBack(selectedObject)
    // Keep mockup on bottom
    const shirt = fabricCanvas.getObjects().find((o) => o._type === 'shirt')
    if (shirt) fabricCanvas.sendObjectToBack(shirt)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  if (!props || !selectedObject) return null

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text'

  return (
    <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Element Properties
        </p>
        <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
          {selectedObject.type}
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={centerH}
          title="Center Horizontally"
          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <AlignCenterHorizontal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={centerV}
          title="Center Vertically"
          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <AlignCenterVertical className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={flipX}
          title="Flip Horizontal"
          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={flipY}
          title="Flip Vertical"
          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <FlipVertical className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={bringToFront}
          title="Bring to Front"
          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={sendToBack}
          title="Send to Back"
          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Move className="w-3 h-3 text-gray-400" /> X
          </label>
          <input
            type="number"
            value={props.left}
            onChange={(e) => update('left', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500">Y</label>
          <input
            type="number"
            value={props.top}
            onChange={(e) => update('top', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-gray-400" /> Width
          </label>
          <input
            type="number"
            value={props.width}
            onChange={(e) => update('width', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500">Height</label>
          <input
            type="number"
            value={props.height}
            onChange={(e) => update('height', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-gray-400" /> Rotation
          </span>
          <span>{props.angle}°</span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          value={props.angle}
          onChange={(e) => update('angle', Number(e.target.value))}
          className="w-full accent-indigo-500 h-1.5"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-gray-400" /> Opacity
          </span>
          <span>{props.opacity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={props.opacity}
          onChange={(e) => update('opacity', Number(e.target.value))}
          className="w-full accent-indigo-500 h-1.5"
        />
      </div>

      {/* Text Fill Color */}
      {isText && (
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-gray-500">Color</label>
          {props.isGradient ? (
            <div className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 flex items-center justify-between">
              <span>Gradient Fill Applied</span>
              <button
                onClick={() => update('fill', '#000000')}
                className="text-[10px] text-gray-500 hover:text-gray-800 underline"
              >
                Reset to Solid
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={props.fill}
                onChange={(e) => update('fill', e.target.value)}
                className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={props.fill.toUpperCase()}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update('fill', v)
                }}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          )}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={duplicateSelected}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors"
        >
          <Copy className="w-3.5 h-3.5 text-gray-500" />
          Duplicate
        </button>
        <button
          onClick={deleteSelected}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
          Delete
        </button>
      </div>
    </div>
  )
}
