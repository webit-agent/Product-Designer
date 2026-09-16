import { X, Download, ZoomIn, Crop } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDesignerStore } from '../store/useDesignerStore'
import { PRINT_AREAS } from '../lib/mockups'

export default function PreviewModal({ onClose }) {
  const { fabricCanvas, mockupType } = useDesignerStore()
  const [previewUrl, setPreviewUrl] = useState(null)
  const [cropUrl, setCropUrl] = useState(null)
  const [activeTab, setActiveTab] = useState('full')

  useEffect(() => {
    if (!fabricCanvas) return

    // Hide print area overlay
    const objects = fabricCanvas.getObjects()
    const printArea = objects.find(o => o._type === 'printArea')
    const gridObj = objects.find(o => o._type === 'grid')
    if (printArea) printArea.set('visible', false)
    if (gridObj) gridObj.set('visible', false)
    fabricCanvas.renderAll()

    // Full mockup export (2x)
    const fullDataUrl = fabricCanvas.toDataURL({ format: 'png', multiplier: 2, quality: 1 })
    setPreviewUrl(fullDataUrl)

    // Cropped to printable area (3x for print quality)
    const pa = PRINT_AREAS[mockupType] || PRINT_AREAS.tshirt
    const croppedDataUrl = fabricCanvas.toDataURL({
      format: 'png',
      multiplier: 3,
      quality: 1,
      left: pa.left,
      top: pa.top,
      width: pa.width,
      height: pa.height,
    })
    setCropUrl(croppedDataUrl)

    // Restore
    if (printArea) printArea.set('visible', true)
    if (gridObj) gridObj.set('visible', true)
    fabricCanvas.renderAll()
  }, [fabricCanvas, mockupType])

  const handleDownload = (url, suffix) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = `design-${mockupType}-${suffix}-${Date.now()}.png`
    link.click()
  }

  const currentUrl = activeTab === 'full' ? previewUrl : cropUrl

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-5 h-5 text-indigo-500" />
            <h2 className="font-semibold text-gray-800">Preview & Export</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 shrink-0">
          <button
            onClick={() => setActiveTab('full')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'full' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Full Mockup
          </button>
          <button
            onClick={() => setActiveTab('crop')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'crop' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Crop className="w-3.5 h-3.5" />
            Print-Ready (Cropped)
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto p-6 bg-[#f1f1f1] flex items-center justify-center min-h-[280px]">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Design preview"
              className="max-w-full max-h-[420px] rounded-xl shadow-lg object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-400 rounded-full animate-spin" />
              <span className="text-sm">Generating preview…</span>
            </div>
          )}
        </div>

        {/* Info bar */}
        {activeTab === 'crop' && (
          <div className="bg-indigo-50 px-6 py-2 text-xs text-indigo-700 flex items-center gap-1.5 shrink-0">
            <Crop className="w-3.5 h-3.5 shrink-0" />
            Cropped to printable area at 3× resolution — ready for print upload
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Editing
          </button>
          <button
            onClick={() => handleDownload(currentUrl, activeTab)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
