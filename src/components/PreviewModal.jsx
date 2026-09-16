import { useState, useEffect } from 'react'
import { X, Download, ZoomIn, Crop, Sparkles, Code2 } from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'
import { PRINT_AREAS } from '../lib/mockups'

export default function PreviewModal({ onClose }) {
  const fabricCanvas = useDesignerStore((s) => s.fabricCanvas)
  const mockupType = useDesignerStore((s) => s.mockupType)

  const [previewUrl, setPreviewUrl] = useState(null)
  const [cropUrl, setCropUrl] = useState(null)
  const [transparentUrl, setTransparentUrl] = useState(null)
  const [svgString, setSvgString] = useState('')
  const [activeTab, setActiveTab] = useState('full')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!fabricCanvas) return
    setLoading(true)

    // Delay slightly to ensure canvas is fully settled
    const timer = setTimeout(() => {
      try {
        const objects = fabricCanvas.getObjects()
        const printArea = objects.find((o) => o._type === 'printArea')
        const gridObj = objects.find((o) => o._type === 'grid')
        const shirt = objects.find((o) => o._type === 'shirt')

        // 1. Full Mockup with shirt
        if (printArea) printArea.set('visible', false)
        if (gridObj) gridObj.set('visible', false)
        fabricCanvas.renderAll()

        const fullDataUrl = fabricCanvas.toDataURL({
          format: 'png',
          multiplier: 2,
          quality: 1,
        })
        setPreviewUrl(fullDataUrl)

        // 2. Cropped to print area
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

        // 3. Transparent background (design only)
        if (shirt) shirt.set('visible', false)
        fabricCanvas.backgroundColor = 'transparent'
        fabricCanvas.renderAll()

        const transpDataUrl = fabricCanvas.toDataURL({
          format: 'png',
          multiplier: 3,
          quality: 1,
          left: pa.left,
          top: pa.top,
          width: pa.width,
          height: pa.height,
        })
        setTransparentUrl(transpDataUrl)

        // SVG string export
        const svgOut = fabricCanvas.toSVG({
          viewBox: {
            x: pa.left,
            y: pa.top,
            width: pa.width,
            height: pa.height,
          },
          width: `${pa.width}px`,
          height: `${pa.height}px`,
        })
        setSvgString(svgOut)

        // Restore canvas state
        if (shirt) shirt.set('visible', true)
        if (printArea) printArea.set('visible', true)
        if (gridObj) gridObj.set('visible', true)
        fabricCanvas.backgroundColor = '#f8fafc'
        fabricCanvas.renderAll()
      } catch (err) {
        console.error('Export error:', err)
      } finally {
        setLoading(false)
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [fabricCanvas, mockupType])

  const handleDownloadPNG = (url, suffix) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = `product-${mockupType}-${suffix}-${Date.now()}.png`
    link.click()
  }

  const handleDownloadSVG = () => {
    if (!svgString) return
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `product-${mockupType}-vector-${Date.now()}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getActiveContent = () => {
    if (activeTab === 'full') return previewUrl
    if (activeTab === 'crop') return cropUrl
    if (activeTab === 'transparent') return transparentUrl
    return null
  }

  const currentUrl = getActiveContent()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ZoomIn className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Preview & Export Center</h2>
              <p className="text-[11px] text-gray-400 capitalize">{mockupType} Mockup Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5 shrink-0">
          {[
            { id: 'full', label: 'Full Mockup', icon: ZoomIn },
            { id: 'crop', label: 'Print-Ready', icon: Crop },
            { id: 'transparent', label: 'Transparent PNG', icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                activeTab === id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Preview Viewport */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100 flex items-center justify-center min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-xs font-medium">Generating high-res export…</span>
            </div>
          ) : currentUrl ? (
            <div
              className={`rounded-2xl p-4 flex items-center justify-center max-w-full ${
                activeTab === 'transparent'
                  ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-white border border-gray-200'
                  : 'bg-transparent'
              }`}
            >
              <img
                src={currentUrl}
                alt="Design preview"
                className="max-w-full max-h-[380px] rounded-xl shadow-lg object-contain"
              />
            </div>
          ) : (
            <div className="text-xs text-gray-400">Preview not available</div>
          )}
        </div>

        {/* Tab Info Notes */}
        <div className="bg-indigo-50/60 px-6 py-2.5 text-xs text-indigo-700 flex items-center justify-between shrink-0 border-t border-indigo-100">
          <span className="flex items-center gap-1.5">
            {activeTab === 'full' && 'Full product mockup rendered at 2× resolution.'}
            {activeTab === 'crop' && 'Print-ready file cropped to printable boundary at 3× resolution.'}
            {activeTab === 'transparent' && 'Transparent background PNG containing only your artwork.'}
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-500">
            300 DPI High-Res
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadSVG}
            disabled={!svgString}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Download vector SVG format"
          >
            <Code2 className="w-4 h-4" />
            Export SVG
          </button>
          <button
            onClick={() => handleDownloadPNG(currentUrl, activeTab)}
            disabled={!currentUrl || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download {activeTab === 'transparent' ? 'Transparent PNG' : 'High-Res PNG'}
          </button>
        </div>
      </div>
    </div>
  )
}
