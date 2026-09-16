import { FabricImage } from 'fabric'
import { useDesignerStore } from '../store/useDesignerStore'

// Pre-made design gallery items (SVG data URLs)
const makeSvgUrl = (svgBody, viewBox = '0 0 100 100') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${svgBody}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const GALLERY_ITEMS = [
  {
    id: 'star',
    label: 'Star',
    url: makeSvgUrl(`<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>`),
  },
  {
    id: 'heart',
    label: 'Heart',
    url: makeSvgUrl(`<path d="M50 80 C10 55 5 20 25 10 C35 5 47 12 50 20 C53 12 65 5 75 10 C95 20 90 55 50 80Z" fill="#EF4444"/>`),
  },
  {
    id: 'lightning',
    label: 'Lightning',
    url: makeSvgUrl(`<polygon points="60,5 30,55 55,55 40,95 70,45 45,45" fill="#A78BFA"/>`),
  },
  {
    id: 'skull',
    label: 'Skull',
    url: makeSvgUrl(`<ellipse cx="50" cy="45" rx="30" ry="28" fill="#374151"/>
      <rect x="30" y="65" width="40" height="18" rx="4" fill="#374151"/>
      <line x1="40" y1="65" x2="40" y2="83" stroke="#f9fafb" stroke-width="2"/>
      <line x1="50" y1="65" x2="50" y2="83" stroke="#f9fafb" stroke-width="2"/>
      <line x1="60" y1="65" x2="60" y2="83" stroke="#f9fafb" stroke-width="2"/>
      <ellipse cx="40" cy="45" rx="8" ry="9" fill="#f9fafb"/>
      <ellipse cx="60" cy="45" rx="8" ry="9" fill="#f9fafb"/>
      <ellipse cx="40" cy="46" rx="4" ry="5" fill="#374151"/>
      <ellipse cx="60" cy="46" rx="4" ry="5" fill="#374151"/>
      <ellipse cx="50" cy="58" rx="4" ry="3" fill="#f9fafb"/>`),
  },
  {
    id: 'flower',
    label: 'Flower',
    url: makeSvgUrl(`<circle cx="50" cy="50" r="12" fill="#FDE68A"/>
      <ellipse cx="50" cy="22" rx="9" ry="14" fill="#F9A8D4"/>
      <ellipse cx="50" cy="78" rx="9" ry="14" fill="#F9A8D4"/>
      <ellipse cx="22" cy="50" rx="14" ry="9" fill="#F9A8D4"/>
      <ellipse cx="78" cy="50" rx="14" ry="9" fill="#F9A8D4"/>
      <ellipse cx="30" cy="30" rx="9" ry="14" fill="#FDA4AF" transform="rotate(-45 30 30)"/>
      <ellipse cx="70" cy="30" rx="9" ry="14" fill="#FDA4AF" transform="rotate(45 70 30)"/>
      <ellipse cx="30" cy="70" rx="9" ry="14" fill="#FDA4AF" transform="rotate(45 30 70)"/>
      <ellipse cx="70" cy="70" rx="9" ry="14" fill="#FDA4AF" transform="rotate(-45 70 70)"/>
      <circle cx="50" cy="50" r="12" fill="#FDE68A"/>`),
  },
  {
    id: 'diamond',
    label: 'Diamond',
    url: makeSvgUrl(`<polygon points="50,5 85,35 50,95 15,35" fill="#60A5FA" stroke="#3B82F6" stroke-width="1.5"/>
      <polygon points="50,5 85,35 50,45 15,35" fill="#93C5FD"/>`),
  },
  {
    id: 'flame',
    label: 'Flame',
    url: makeSvgUrl(`<path d="M50 95 C20 80 10 60 25 40 C28 55 35 58 42 52 C38 40 42 20 50 5 C56 20 52 35 60 40 C68 45 72 30 70 20 C82 35 90 55 70 75 C67 62 60 58 55 62 C60 72 58 85 50 95Z" fill="#F97316"/>`),
  },
  {
    id: 'peace',
    label: 'Peace',
    url: makeSvgUrl(`<circle cx="50" cy="50" r="40" fill="none" stroke="#6EE7B7" stroke-width="6"/>
      <line x1="50" y1="10" x2="50" y2="90" stroke="#6EE7B7" stroke-width="6"/>
      <line x1="50" y1="50" x2="17" y2="75" stroke="#6EE7B7" stroke-width="6"/>
      <line x1="50" y1="50" x2="83" y2="75" stroke="#6EE7B7" stroke-width="6"/>`),
  },
  {
    id: 'crown',
    label: 'Crown',
    url: makeSvgUrl(`<polygon points="10,70 10,30 30,50 50,10 70,50 90,30 90,70" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
      <rect x="10" y="70" width="80" height="12" rx="3" fill="#F59E0B"/>
      <circle cx="50" cy="18" r="5" fill="#EF4444"/>
      <circle cx="24" cy="42" r="4" fill="#EF4444"/>
      <circle cx="76" cy="42" r="4" fill="#EF4444"/>`),
  },
  {
    id: 'music',
    label: 'Music Note',
    url: makeSvgUrl(`<ellipse cx="35" cy="75" rx="16" ry="12" fill="#818CF8"/>
      <rect x="49" y="20" width="7" height="57" fill="#818CF8"/>
      <rect x="49" y="20" width="30" height="7" fill="#818CF8"/>
      <rect x="49" y="38" width="30" height="7" fill="#818CF8"/>
      <ellipse cx="72" cy="58" rx="16" ry="12" fill="#818CF8"/>`),
  },
  {
    id: 'rocket',
    label: 'Rocket',
    url: makeSvgUrl(`<path d="M50 8 C38 30 35 55 40 75 L60 75 C65 55 62 30 50 8Z" fill="#CBD5E1"/>
      <ellipse cx="50" cy="38" rx="10" ry="12" fill="#60A5FA"/>
      <path d="M40 70 C35 80 28 85 25 90 L45 85Z" fill="#EF4444"/>
      <path d="M60 70 C65 80 72 85 75 90 L55 85Z" fill="#EF4444"/>
      <path d="M40 75 C42 85 50 90 58 90 C56 85 52 82 50 80 C48 82 44 85 42 90 C46 88 50 90 58 90" fill="#FCA5A5" opacity="0.5"/>
      <ellipse cx="50" cy="38" rx="5" ry="6" fill="#DBEAFE"/>`),
  },
  {
    id: 'wave',
    label: 'Wave',
    url: makeSvgUrl(`<path d="M5 50 Q20 30 35 50 Q50 70 65 50 Q80 30 95 50" fill="none" stroke="#38BDF8" stroke-width="7" stroke-linecap="round"/>
      <path d="M5 65 Q20 45 35 65 Q50 85 65 65 Q80 45 95 65" fill="none" stroke="#0EA5E9" stroke-width="7" stroke-linecap="round"/>
      <path d="M5 35 Q20 15 35 35 Q50 55 65 35 Q80 15 95 35" fill="none" stroke="#7DD3FC" stroke-width="7" stroke-linecap="round"/>`),
  },
]

export default function DesignGallery() {
  const { fabricCanvas, pushHistory } = useDesignerStore()

  const addToCanvas = async (item) => {
    if (!fabricCanvas) return
    const img = await FabricImage.fromURL(item.url)
    img.scaleToWidth(80)
    img.set({
      left: 160,
      top: 140,
      id: `gallery_${item.id}_${Date.now()}`,
    })
    fabricCanvas.add(img)
    fabricCanvas.setActiveObject(img)
    fabricCanvas.renderAll()
    pushHistory(JSON.stringify(fabricCanvas.toJSON(['_type', 'id'])))
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm font-medium text-gray-700">Designs &amp; Clipart</p>
      <div className="grid grid-cols-3 gap-2">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => addToCanvas(item)}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group cursor-pointer"
          >
            <img src={item.url} alt={item.label} className="w-12 h-12 object-contain" />
            <span className="text-xs text-gray-500 group-hover:text-indigo-600">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
