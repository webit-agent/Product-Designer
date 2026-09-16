import { useDesignerStore } from '../store/useDesignerStore'
import { MOCKUP_TYPES } from '../lib/mockups'

export default function MockupPicker() {
  const { mockupType, setMockupType } = useDesignerStore()

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {MOCKUP_TYPES.map((m) => (
        <button
          key={m.id}
          onClick={() => setMockupType(m.id)}
          className={`flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-xl border transition-all text-xs font-medium ${
            mockupType === m.id
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
              : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
          }`}
        >
          <span className="text-lg leading-none">{m.icon}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
