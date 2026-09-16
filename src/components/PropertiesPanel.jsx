import { useDesignerStore } from '../store/useDesignerStore'
import { Move, RotateCcw, Maximize2, Layers, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PropertiesPanel() {
  const { fabricCanvas, selectedObject, pushHistory } = useDesignerStore()
  const [props, setProps] = useState(null)

  useEffect(() => {
    if (!selectedObject) {
      setProps(null)
      return
    }
    refreshProps()
  }, [selectedObject]) // eslint-disable-line

  const refreshProps = () => {
    if (!selectedObject) return
    setProps({
      left: Math.round(selectedObject.left || 0),
      top: Math.round(selectedObject.top || 0),
      width: Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1)),
      height: Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1)),
      angle: Math.round(selectedObject.angle || 0),
      opacity: Math.round((selectedObject.opacity ?? 1) * 100),
      fill: selectedObject.fill || '#000000',
    })
  }

  const update = (key, value) => {
    if (!selectedObject || !fabricCanvas) return
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
    setProps((p) => ({ ...p, [key]: value }))
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id'])))
  }

  const deleteSelected = () => {
    if (!fabricCanvas || !selectedObject) return
    fabricCanvas.remove(selectedObject)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id'])))
  }

  if (!props) return null

  return (
    <div className="border-t border-gray-100 p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</p>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-gray-400 flex items-center gap-1"><Move className="w-3 h-3" />X</label>
          <input
            type="number"
            value={props.left}
            onChange={(e) => update('left', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Y</label>
          <input
            type="number"
            value={props.top}
            onChange={(e) => update('top', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-gray-400 flex items-center gap-1"><Maximize2 className="w-3 h-3" />W</label>
          <input
            type="number"
            value={props.width}
            onChange={(e) => update('width', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">H</label>
          <input
            type="number"
            value={props.height}
            onChange={(e) => update('height', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400 flex items-center gap-1"><RotateCcw className="w-3 h-3" />Rotation: {props.angle}°</label>
        <input
          type="range"
          min={-180}
          max={180}
          value={props.angle}
          onChange={(e) => update('angle', Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400 flex items-center gap-1"><Layers className="w-3 h-3" />Opacity: {props.opacity}%</label>
        <input
          type="range"
          min={0}
          max={100}
          value={props.opacity}
          onChange={(e) => update('opacity', Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Fill color (text only) */}
      {selectedObject?.type === 'i-text' || selectedObject?.type === 'text' ? (
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Color</label>
          <input
            type="color"
            value={props.fill}
            onChange={(e) => update('fill', e.target.value)}
            className="w-full h-8 border border-gray-200 rounded-lg cursor-pointer"
          />
        </div>
      ) : null}

      {/* Delete */}
      <button
        onClick={deleteSelected}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete Element
      </button>
    </div>
  )
}
