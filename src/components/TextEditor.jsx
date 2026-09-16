import { useState } from 'react'
import { IText, Gradient } from 'fabric'
import { Type, Bold, Italic, AlignCenter, Underline, Sparkles } from 'lucide-react'
import { useDesignerStore } from '../store/useDesignerStore'

const FONTS = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Impact', value: 'Impact' },
  { label: 'Comic Sans', value: 'Comic Sans MS' },
  { label: 'Courier', value: 'Courier New' },
  { label: 'Trebuchet', value: 'Trebuchet MS' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Palatino', value: 'Palatino' },
  { label: 'Garamond', value: 'Garamond' },
  { label: 'Futura', value: 'Futura' },
]

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316',
  '#EAB308', '#22C55E', '#3B82F6', '#A855F7',
  '#EC4899', '#06B6D4', '#8B5CF6', '#6B7280',
]

const GRADIENT_PRESETS = [
  { label: 'Sunset', from: '#F97316', to: '#EC4899' },
  { label: 'Ocean', from: '#06B6D4', to: '#3B82F6' },
  { label: 'Forest', from: '#22C55E', to: '#166534' },
  { label: 'Candy', from: '#EC4899', to: '#A855F7' },
  { label: 'Gold', from: '#EAB308', to: '#F97316' },
  { label: 'Night', from: '#4338CA', to: '#111827' },
]

const TEXT_ALIGN = ['left', 'center', 'right']

export default function TextEditor() {
  const { fabricCanvas, pushHistory } = useDesignerStore()

  const [text, setText] = useState('Your Text Here')
  const [font, setFont] = useState('Impact')
  const [size, setSize] = useState(36)
  const [color, setColor] = useState('#000000')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [align, setAlign] = useState('center')
  const [curved, setCurved] = useState(false)
  const [useGradient, setUseGradient] = useState(false)
  const [gradientPreset, setGradientPreset] = useState(GRADIENT_PRESETS[0])
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [lineHeight, setLineHeight] = useState(1.2)
  const [strokeColor, setStrokeColor] = useState('#FFFFFF')
  const [strokeWidth, setStrokeWidth] = useState(0)

  const addText = () => {
    if (!fabricCanvas || !text.trim()) return

    if (curved) {
      addCurvedText()
      return
    }

    const itext = new IText(text, {
      left: 200,
      top: 200,
      fontFamily: font,
      fontSize: size,
      fill: color,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      underline,
      textAlign: align,
      charSpacing: letterSpacing * 10,
      lineHeight,
      stroke: strokeWidth > 0 ? strokeColor : null,
      strokeWidth: strokeWidth || 0,
      originX: 'center',
      originY: 'center',
      id: `text_${Date.now()}`,
    })

    if (useGradient) {
      const gradient = new Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: itext.width || 200, y2: 0 },
        colorStops: [
          { offset: 0, color: gradientPreset.from },
          { offset: 1, color: gradientPreset.to },
        ],
      })
      itext.set('fill', gradient)
    }

    fabricCanvas.add(itext)
    fabricCanvas.setActiveObject(itext)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  const addCurvedText = () => {
    if (!fabricCanvas) return
    const chars = text.split('')
    const radius = 80 + size * 0.4
    const startAngle = -Math.PI * 0.6
    const totalAngle = Math.PI * 1.2
    const angleStep = chars.length > 1 ? totalAngle / (chars.length - 1) : 0
    const cx = 200, cy = 240

    chars.forEach((char, i) => {
      if (char === ' ') return
      const angle = startAngle + i * angleStep
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      const rotDeg = (angle + Math.PI / 2) * (180 / Math.PI)

      const t = new IText(char, {
        left: x, top: y,
        fontFamily: font,
        fontSize: Math.max(size * 0.65, 10),
        fill: color,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        angle: rotDeg,
        originX: 'center',
        originY: 'center',
        id: `curved_${Date.now()}_${i}`,
      })
      fabricCanvas.add(t)
    })

    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id', '_locked'])))
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm font-medium text-gray-700">Add Text</p>

      {/* Text input */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          placeholder="Enter your text…"
        />
      </div>

      {/* Font family */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Font</label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          style={{ fontFamily: font }}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Size + Spacing + Line Height */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] text-gray-500">Size: {size}</label>
          <input type="range" min={8} max={150} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-gray-500">Space: {letterSpacing}</label>
          <input type="range" min={-5} max={30} value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-gray-500">Height: {lineHeight}</label>
          <input type="range" min={0.8} max={2.5} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
      </div>

      {/* Style buttons */}
      <div className="flex gap-1.5">
        {[
          { label: 'B', icon: Bold, active: bold, set: setBold, title: 'Bold' },
          { label: 'I', icon: Italic, active: italic, set: setItalic, title: 'Italic' },
          { label: 'U', icon: Underline, active: underline, set: setUnderline, title: 'Underline' },
          { label: 'Arc', icon: AlignCenter, active: curved, set: setCurved, title: 'Curved text' },
        ].map(({ icon: Icon, active, set, title }) => (
          <button
            key={title}
            onClick={() => set(!active)}
            title={title}
            className={`flex-1 flex items-center justify-center py-2 rounded-lg border text-xs transition-colors ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        {TEXT_ALIGN.map((a) => (
          <button
            key={a}
            onClick={() => setAlign(a)}
            title={`Align ${a}`}
            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-colors ${align === a ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
          >
            {a === 'left' ? '≡' : a === 'center' ? '☰' : '⋮'}
          </button>
        ))}
      </div>

      {/* Color section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">Color</label>
          <button
            onClick={() => setUseGradient(!useGradient)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${useGradient ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            <Sparkles className="w-3 h-3" />
            Gradient
          </button>
        </div>

        {useGradient ? (
          <div className="grid grid-cols-3 gap-1.5">
            {GRADIENT_PRESETS.map((g) => (
              <button
                key={g.label}
                onClick={() => setGradientPreset(g)}
                className={`h-8 rounded-lg border-2 transition-all text-xs font-medium text-white shadow-sm ${gradientPreset.label === g.label ? 'border-indigo-500 scale-105' : 'border-transparent hover:scale-105'}`}
                style={{ background: `linear-gradient(to right, ${g.from}, ${g.to})` }}
              >
                {g.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${color === c ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300' : 'border-transparent'}`}
                style={{ backgroundColor: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #d1d5db' : 'none' }}
              />
            ))}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer" title="Custom" />
          </div>
        )}
      </div>

      {/* Stroke / outline */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Outline Width: {strokeWidth}px</label>
        <div className="flex gap-2 items-center">
          <input type="range" min={0} max={10} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="flex-1 accent-indigo-500" />
          <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer shrink-0" title="Outline color" />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 min-h-[50px] flex items-center justify-center overflow-hidden">
        <span
          style={{
            fontFamily: font,
            fontSize: Math.min(size * 0.45, 32),
            color: useGradient ? 'transparent' : color,
            background: useGradient ? `linear-gradient(to right, ${gradientPreset.from}, ${gradientPreset.to})` : 'none',
            WebkitBackgroundClip: useGradient ? 'text' : 'unset',
            WebkitTextFillColor: useGradient ? 'transparent' : 'unset',
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            textDecoration: underline ? 'underline' : 'none',
            textAlign: align,
            letterSpacing: `${letterSpacing}px`,
            WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth * 0.4}px ${strokeColor}` : 'none',
          }}
        >
          {text || 'Preview'}
        </span>
      </div>

      {/* Add button */}
      <button
        onClick={addText}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium text-sm transition-colors shadow-sm"
      >
        <Type className="w-4 h-4" />
        Add to Design
      </button>
    </div>
  )
}
