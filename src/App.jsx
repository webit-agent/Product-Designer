import { useState, useEffect } from 'react'
import { Undo2, Redo2, Eye, Shirt, Trash2, HelpCircle, X } from 'lucide-react'
import DesignCanvas from './components/DesignCanvas'
import ToolPanel from './components/ToolPanel'
import PreviewModal from './components/PreviewModal'
import MockupPicker from './components/MockupPicker'
import { useDesignerStore } from './store/useDesignerStore'

const SHORTCUTS = [
  { keys: ['Ctrl', 'Z'], desc: 'Undo' },
  { keys: ['Ctrl', 'Y'], desc: 'Redo' },
  { keys: ['Ctrl', 'D'], desc: 'Duplicate' },
  { keys: ['Delete'], desc: 'Delete selected' },
  { keys: ['Click'], desc: 'Select object' },
  { keys: ['Drag'], desc: 'Move object' },
]

export default function App() {
  const { undo, redo, historyStack, redoStack, clearCanvas } = useDesignerStore()
  const [showPreview, setShowPreview] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  // Global keyboard shortcuts handled in DesignCanvas via window.addEventListener
  // But we still support undo/redo from the header buttons
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-800 text-base leading-none block">Tee Designer</span>
              <span className="text-[10px] text-gray-400 leading-none">Pro Studio</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Mockup picker */}
          <div className="flex-1 overflow-hidden">
            <MockupPicker />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={undo}
              disabled={historyStack.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Redo</span>
            </button>

            <div className="w-px h-5 bg-gray-200 mx-0.5" />

            {/* Clear canvas */}
            {confirmClear ? (
              <div className="flex items-center gap-1 bg-red-50 rounded-lg px-2 py-1 border border-red-200">
                <span className="text-xs text-red-600">Clear all?</span>
                <button
                  onClick={() => { clearCanvas(); setConfirmClear(false) }}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 px-1"
                >Yes</button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-1"
                >No</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Clear canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${showHelp ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
              title="Keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-200 mx-0.5" />

            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>Preview & Export</span>
            </button>
          </div>
        </div>

        {/* Shortcuts tooltip bar */}
        {showHelp && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex items-center gap-4 overflow-x-auto">
            <span className="text-xs font-semibold text-gray-500 shrink-0">Shortcuts:</span>
            {SHORTCUTS.map((s) => (
              <div key={s.desc} className="flex items-center gap-1.5 shrink-0">
                {s.keys.map((k) => (
                  <kbd key={k} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-600 shadow-sm">{k}</kbd>
                ))}
                <span className="text-xs text-gray-500">{s.desc}</span>
              </div>
            ))}
            <button onClick={() => setShowHelp(false)} className="ml-auto shrink-0 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-5">
        <div className="flex gap-5 h-full">
          {/* Canvas area — takes remaining space */}
          <div className="flex-1 flex flex-col items-center justify-start pt-2 min-w-0">
            <DesignCanvas />
          </div>

          {/* Tool panel — fixed width sidebar */}
          <div className="w-[320px] shrink-0 flex flex-col" style={{ minHeight: 620 }}>
            <ToolPanel />
          </div>
        </div>
      </main>

      {/* Preview modal */}
      {showPreview && <PreviewModal onClose={() => setShowPreview(false)} />}
    </div>
  )
}
