import { useRef } from 'react'
import { FabricImage } from 'fabric'
import { Upload, Image } from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'

export default function UploadPanel() {
  const fileInputRef = useRef(null)
  const { fabricCanvas, pushHistory } = useDesignerStore()

  const addImageToCanvas = async (url) => {
    if (!fabricCanvas) return
    const img = await FabricImage.fromURL(url)
    const maxW = 120
    if (img.width > maxW) {
      img.scaleToWidth(maxW)
    }
    img.set({
      left: 140,
      top: 130,
      id: `img_${Date.now()}`,
    })
    fabricCanvas.add(img)
    fabricCanvas.setActiveObject(img)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id'])))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => addImageToCanvas(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => addImageToCanvas(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm font-medium text-gray-700">Upload Your Image</p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
      >
        <div className="w-12 h-12 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
          <Upload className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Drop image here</p>
          <p className="text-xs text-gray-400 mt-0.5">or click to browse</p>
        </div>
        <p className="text-xs text-gray-400">PNG, JPG, SVG, WEBP</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Quick tip */}
      <div className="bg-indigo-50 rounded-lg p-3 flex gap-2">
        <Image className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-xs text-indigo-700 leading-relaxed">
          For best results, use PNG images with a transparent background. Images are auto-placed in the print area.
        </p>
      </div>
    </div>
  )
}
