import { Upload, Grid, Type, Layers } from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'
import UploadPanel from './UploadPanel'
import DesignGallery from './DesignGallery'
import TextEditor from './TextEditor'
import LayersPanel from './LayersPanel'
import ColorPicker from './ColorPicker'
import PropertiesPanel from './PropertiesPanel'

const TABS = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'designs', label: 'Designs', icon: Grid },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'layers', label: 'Layers', icon: Layers },
]

export default function ToolPanel() {
  const { activeTab, setActiveTab } = useDesignerStore()

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Product color section */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Color</p>
        <ColorPicker />
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2 ${
              activeTab === id
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'upload' && <UploadPanel />}
        {activeTab === 'designs' && <DesignGallery />}
        {activeTab === 'text' && <TextEditor />}
        {activeTab === 'layers' && <LayersPanel />}
      </div>

      {/* Properties panel for selected element */}
      <PropertiesPanel />
    </div>
  )
}
