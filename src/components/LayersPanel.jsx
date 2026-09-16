import { Layers, Trash2, Copy, ArrowUp, ArrowDown, Lock, Unlock, Eye, EyeOff, Type, Image } from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'

export default function LayersPanel() {
  const { fabricCanvas, layers, setSelectedObject, pushHistory } = useDesignerStore()

  const selectLayer = (obj) => {
    if (!fabricCanvas || obj._locked) return
    fabricCanvas.setActiveObject(obj)
    fabricCanvas.renderAll()
    setSelectedObject(obj)
  }

  const deleteLayer = (obj) => {
    if (!fabricCanvas || obj._locked) return
    fabricCanvas.remove(obj)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const duplicateLayer = (obj) => {
    if (!fabricCanvas) return
    obj.clone().then((clone) => {
      clone.set({
        left: (clone.left || 0) + 15,
        top: (clone.top || 0) + 15,
        _locked: false,
      })
      fabricCanvas.add(clone)
      fabricCanvas.setActiveObject(clone)
      fabricCanvas.renderAll()
      pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
    })
  }

  const bringForward = (obj) => {
    if (!fabricCanvas) return
    fabricCanvas.bringObjectForward(obj)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const sendBackward = (obj) => {
    if (!fabricCanvas) return
    fabricCanvas.sendObjectBackwards(obj)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const toggleLock = (obj) => {
    if (!fabricCanvas) return
    const locked = !obj._locked
    obj._locked = locked
    obj.set({
      selectable: !locked,
      evented: !locked,
    })
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
    // Force re-render of layers list
    const objects = fabricCanvas.getObjects().filter(
      o => o._type !== 'printArea' && o._type !== 'shirt' && o._type !== 'grid'
    )
    useDesignerStore.getState().setLayers([...objects].reverse())
  }

  const toggleVisibility = (obj) => {
    if (!fabricCanvas) return
    obj.set('visible', !obj.visible)
    fabricCanvas.renderAll()
    // Force re-render
    const objects = fabricCanvas.getObjects().filter(
      o => o._type !== 'printArea' && o._type !== 'shirt' && o._type !== 'grid'
    )
    useDesignerStore.getState().setLayers([...objects].reverse())
  }

  const getLayerLabel = (obj) => {
    if (obj.type === 'i-text' || obj.type === 'text') {
      const t = obj.text?.slice(0, 18) || ''
      return `"${t}${obj.text?.length > 18 ? '…' : ''}"`
    }
    if (obj.type === 'image') return obj.id?.includes('gallery') ? 'Clipart' : 'Image'
    if (obj.type === 'group') return 'Group'
    return obj.type || 'Object'
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-gray-500" />
        <p className="text-sm font-medium text-gray-700">Layers</p>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {layers.length}
        </span>
      </div>

      {layers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
            <Layers className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">No layers yet</p>
            <p className="text-xs text-gray-300 mt-0.5">Upload an image or add text</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {layers.map((obj, i) => (
            <div
              key={obj.id || i}
              onClick={() => selectLayer(obj)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer group ${
                obj._locked
                  ? 'bg-gray-50 border-gray-100 opacity-70'
                  : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/60'
              } ${!obj.visible ? 'opacity-40' : ''}`}
            >
              {/* Type icon */}
              <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                {(obj.type === 'i-text' || obj.type === 'text')
                  ? <Type className="w-3 h-3 text-indigo-500" />
                  : <Image className="w-3 h-3 text-teal-500" />
                }
              </div>

              <span className="flex-1 text-xs text-gray-600 truncate">
                {getLayerLabel(obj)}
              </span>

              {/* Always visible lock/eye */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleVisibility(obj) }}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                title={obj.visible ? 'Hide' : 'Show'}
              >
                {obj.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleLock(obj) }}
                className={`p-1 rounded hover:bg-gray-200 ${obj._locked ? 'text-amber-500' : 'text-gray-400 hover:text-gray-600'}`}
                title={obj._locked ? 'Unlock' : 'Lock'}
              >
                {obj._locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>

              {/* Hover actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); bringForward(obj) }}
                  className="p-1 rounded hover:bg-gray-200 text-gray-400"
                  title="Bring forward"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); sendBackward(obj) }}
                  className="p-1 rounded hover:bg-gray-200 text-gray-400"
                  title="Send backward"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateLayer(obj) }}
                  className="p-1 rounded hover:bg-gray-200 text-gray-400"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteLayer(obj) }}
                  className={`p-1 rounded ${obj._locked ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-red-100 text-red-400'}`}
                  title={obj._locked ? 'Unlock to delete' : 'Delete'}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
