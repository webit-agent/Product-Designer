import { useRef } from 'react'
import { useDesignerStore } from '../store/useDesignerStore'

const SHIRT_COLORS = [
  // Row 1 — Neutrals
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#E5E7EB' },
  { label: 'Gray', value: '#9CA3AF' },
  { label: 'Charcoal', value: '#374151' },
  { label: 'Black', value: '#111827' },
  // Row 2 — Blues
  { label: 'Ice Blue', value: '#DBEAFE' },
  { label: 'Sky', value: '#38BDF8' },
  { label: 'Royal', value: '#1d4ed8' },
  { label: 'Navy', value: '#1e3a5f' },
  { label: 'Midnight', value: '#0f172a' },
  // Row 3 — Greens
  { label: 'Mint', value: '#A7F3D0' },
  { label: 'Sage', value: '#6EE7B7' },
  { label: 'Forest', value: '#166534' },
  { label: 'Olive', value: '#4D7C0F' },
  { label: 'Emerald', value: '#059669' },
  // Row 4 — Reds / Warm
  { label: 'Pink', value: '#FBCFE8' },
  { label: 'Rose', value: '#F43F5E' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Crimson', value: '#991B1B' },
  { label: 'Maroon', value: '#7f1d1d' },
  // Row 5 — Warm tones
  { label: 'Peach', value: '#FED7AA' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Yellow', value: '#EAB308' },
  { label: 'Cream', value: '#FEF3C7' },
  // Row 6 — Purples
  { label: 'Lavender', value: '#E9D5FF' },
  { label: 'Violet', value: '#8B5CF6' },
  { label: 'Purple', value: '#7e22ce' },
  { label: 'Indigo', value: '#4338CA' },
  { label: 'Plum', value: '#581c87' },
]

export default function ColorPicker() {
  const { shirtColor, setShirtColor } = useDesignerStore()
  const customInputRef = useRef(null)

  return (
    <div className="space-y-2">
      {/* Swatch grid */}
      <div className="grid grid-cols-10 gap-1.5">
        {SHIRT_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => setShirtColor(c.value)}
            title={c.label}
            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
              shirtColor === c.value
                ? 'border-indigo-500 scale-110 shadow-md ring-2 ring-indigo-300'
                : 'border-transparent'
            }`}
            style={{
              backgroundColor: c.value,
              boxShadow: c.value === '#FFFFFF' ? 'inset 0 0 0 1px #d1d5db' : undefined,
            }}
          />
        ))}
      </div>

      {/* Custom color row */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer overflow-hidden shrink-0"
          onClick={() => customInputRef.current?.click()}
          style={{ backgroundColor: shirtColor }}
          title="Pick custom color"
        />
        <input
          ref={customInputRef}
          type="color"
          value={shirtColor}
          onChange={(e) => setShirtColor(e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={shirtColor.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setShirtColor(v)
          }}
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300 uppercase"
          placeholder="#FFFFFF"
          maxLength={7}
        />
        <span className="text-xs text-gray-400 truncate hidden sm:block">
          {SHIRT_COLORS.find(c => c.value.toLowerCase() === shirtColor.toLowerCase())?.label || 'Custom'}
        </span>
      </div>
    </div>
  )
}
