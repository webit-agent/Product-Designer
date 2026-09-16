// Mockup SVG generators for different product types

export const MOCKUP_TYPES = [
  { id: 'tshirt', label: 'T-Shirt', icon: '👕' },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥' },
  { id: 'mug', label: 'Mug', icon: '☕' },
  { id: 'cap', label: 'Cap', icon: '🧢' },
  { id: 'tote', label: 'Tote Bag', icon: '👜' },
  { id: 'phone', label: 'Phone Case', icon: '📱' },
  { id: 'hoodie_back', label: 'Hoodie Back', icon: '🧥' },
  { id: 'tank', label: 'Tank Top', icon: '🎽' },
]

export function getMockupUrl(type, color, side) {
  let svg = ''
  switch (type) {
    case 'tshirt':
      svg = getTshirtSvg(color, side)
      break
    case 'hoodie':
      svg = getHoodieSvg(color, 'front')
      break
    case 'hoodie_back':
      svg = getHoodieSvg(color, 'back')
      break
    case 'mug':
      svg = getMugSvg(color)
      break
    case 'cap':
      svg = getCapSvg(color)
      break
    case 'tote':
      svg = getToteSvg(color)
      break
    case 'phone':
      svg = getPhoneSvg(color)
      break
    case 'tank':
      svg = getTankSvg(color)
      break
    default:
      svg = getTshirtSvg(color, 'front')
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Printable area configs per mockup type [left, top, width, height]
export const PRINT_AREAS = {
  tshirt:      { left: 130, top: 110, width: 140, height: 185 },
  hoodie:      { left: 140, top: 120, width: 120, height: 150 },
  hoodie_back: { left: 130, top: 105, width: 140, height: 185 },
  mug:         { left: 95,  top: 115, width: 210, height: 150 },
  cap:         { left: 130, top: 130, width: 140, height: 90  },
  tote:        { left: 120, top: 100, width: 160, height: 200 },
  phone:       { left: 115, top: 95,  width: 170, height: 260 },
  tank:        { left: 135, top: 95,  width: 130, height: 185 },
}

// Canvas dims per mockup
export const CANVAS_DIMS = {
  tshirt:      { width: 400, height: 450 },
  hoodie:      { width: 400, height: 460 },
  hoodie_back: { width: 400, height: 460 },
  mug:         { width: 400, height: 380 },
  cap:         { width: 400, height: 300 },
  tote:        { width: 400, height: 450 },
  phone:       { width: 400, height: 450 },
  tank:        { width: 400, height: 440 },
}

// ── SVG Generators ──────────────────────────────────────────────

function getTshirtSvg(color, side) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450">
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${shadowColor}"/>
      </filter>
      <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color, 8)}"/>
        <stop offset="100%" stop-color="${darken(color, 8)}"/>
      </linearGradient>
    </defs>
    <path d="M100 80 L55 165 L125 185 L125 385 L275 385 L275 185 L345 165 L300 80 L240 58 C235 82 215 102 200 102 C185 102 165 82 160 58 Z"
      fill="url(#shirtGrad)" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
    <path d="M100 80 L55 165 L125 185 L148 105 Z" fill="${darken(color,5)}" stroke="${strokeColor}" stroke-width="1"/>
    <path d="M300 80 L345 165 L275 185 L252 105 Z" fill="${darken(color,5)}" stroke="${strokeColor}" stroke-width="1"/>
    <path d="M160 58 C162 80 185 102 200 102 C215 102 238 80 240 58 L230 50 C224 72 213 88 200 88 C187 88 176 72 170 50 Z"
      fill="${darken(color,3)}" stroke="${strokeColor}" stroke-width="1"/>
    ${side === 'back' ? `<text x="200" y="210" text-anchor="middle" font-family="sans-serif" font-size="13" fill="${isLight(color)?'#6b7280':'#9ca3af'}" opacity="0.6" letter-spacing="4">BACK</text>` : ''}
    <!-- Fabric texture lines -->
    <line x1="200" y1="100" x2="200" y2="385" stroke="${isLight(color)?'#00000008':'#ffffff08'}" stroke-width="1"/>
  </svg>`
}

function getHoodieSvg(color, side) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${shadowColor}"/></filter>
      <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color,8)}"/>
        <stop offset="100%" stop-color="${darken(color,8)}"/>
      </linearGradient>
    </defs>
    <!-- Main body -->
    <path d="M95 100 L50 185 L120 205 L120 395 L280 395 L280 205 L350 185 L305 100 L260 75 C255 95 230 130 200 135 C170 130 145 95 140 75 Z"
      fill="url(#hoodGrad)" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Left sleeve -->
    <path d="M95 100 L50 185 L120 205 L145 115 Z" fill="${darken(color,5)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Right sleeve -->
    <path d="M305 100 L350 185 L280 205 L255 115 Z" fill="${darken(color,5)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Hood -->
    <path d="M140 75 C138 45 148 20 165 10 C178 3 190 0 200 0 C210 0 222 3 235 10 C252 20 262 45 260 75 C248 65 230 130 200 135 C170 130 152 65 140 75 Z"
      fill="${darken(color,3)}" stroke="${strokeColor}" stroke-width="1.2"/>
    <!-- Hood opening -->
    <ellipse cx="200" cy="75" rx="35" ry="40" fill="${darken(color,8)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Pocket -->
    ${side === 'front' ? `<path d="M155 310 Q200 305 245 310 L248 370 Q200 375 152 370 Z" fill="${darken(color,6)}" stroke="${strokeColor}" stroke-width="1"/>` : ''}
    <!-- Zipper (front only) -->
    ${side === 'front' ? `<line x1="200" y1="135" x2="200" y2="395" stroke="${isLight(color)?'#9ca3af':'#6b7280'}" stroke-width="2.5" stroke-dasharray="4,3"/>` : ''}
    ${side === 'back' ? `<text x="200" y="200" text-anchor="middle" font-family="sans-serif" font-size="13" fill="${isLight(color)?'#6b7280':'#9ca3af'}" opacity="0.6" letter-spacing="4">BACK</text>` : ''}
  </svg>`
}

function getMugSvg(color) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 380">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${shadowColor}"/></filter>
      <linearGradient id="mugGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${darken(color,12)}"/>
        <stop offset="20%" stop-color="${lighten(color,5)}"/>
        <stop offset="80%" stop-color="${color}"/>
        <stop offset="100%" stop-color="${darken(color,15)}"/>
      </linearGradient>
      <linearGradient id="topGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color,15)}"/>
        <stop offset="100%" stop-color="${color}"/>
      </linearGradient>
    </defs>
    <!-- Mug body -->
    <path d="M75 75 Q78 285 88 310 Q200 330 312 310 Q322 285 325 75 Z"
      fill="url(#mugGrad)" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Mug rim (top ellipse) -->
    <ellipse cx="200" cy="75" rx="125" ry="22" fill="url(#topGrad)" stroke="${strokeColor}" stroke-width="1.5"/>
    <!-- Inner rim dark -->
    <ellipse cx="200" cy="78" rx="110" ry="18" fill="${darken(color,20)}" stroke="${darken(color,25)}" stroke-width="1"/>
    <!-- Handle -->
    <path d="M325 130 Q390 130 390 200 Q390 270 325 270" fill="none" stroke="url(#mugGrad)" stroke-width="28" stroke-linecap="round"/>
    <path d="M325 130 Q378 130 378 200 Q378 270 325 270" fill="none" stroke="${darken(color,10)}" stroke-width="14" stroke-linecap="round"/>
    <!-- Highlight -->
    <path d="M100 120 Q105 220 108 290" stroke="${isLight(color)?'#ffffff40':'#ffffff20'}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <!-- Bottom ellipse -->
    <ellipse cx="200" cy="310" rx="112" ry="16" fill="${darken(color,15)}" stroke="${strokeColor}" stroke-width="1"/>
  </svg>`
}

function getCapSvg(color) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${shadowColor}"/></filter>
      <linearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color,10)}"/>
        <stop offset="100%" stop-color="${darken(color,10)}"/>
      </linearGradient>
    </defs>
    <!-- Brim -->
    <path d="M60 185 Q80 215 200 220 Q320 215 340 185 Q310 170 200 168 Q90 170 60 185 Z"
      fill="${darken(color,20)}" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Brim underside -->
    <path d="M60 185 Q80 215 200 220 Q320 215 340 185" fill="none" stroke="${darken(color,30)}" stroke-width="1"/>
    <!-- Crown -->
    <path d="M90 170 Q90 50 200 30 Q310 50 310 170 Q255 185 200 188 Q145 185 90 170 Z"
      fill="url(#capGrad)" stroke="${strokeColor}" stroke-width="1.5"/>
    <!-- Panel seams -->
    <path d="M200 32 Q200 188 200 188" stroke="${isLight(color)?'#00000015':'#ffffff15'}" stroke-width="1.5" fill="none"/>
    <path d="M148 42 Q145 188 148 188" stroke="${isLight(color)?'#00000010':'#ffffff10'}" stroke-width="1.2" fill="none"/>
    <path d="M252 42 Q255 188 252 188" stroke="${isLight(color)?'#00000010':'#ffffff10'}" stroke-width="1.2" fill="none"/>
    <!-- Button top -->
    <circle cx="200" cy="33" r="8" fill="${darken(color,15)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Sweatband -->
    <path d="M90 170 Q145 182 200 184 Q255 182 310 170 Q255 162 200 160 Q145 162 90 170 Z"
      fill="${darken(color,8)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Snapback adjustment -->
    <rect x="168" y="196" width="64" height="18" rx="3" fill="${darken(color,18)}" stroke="${strokeColor}" stroke-width="1"/>
    <line x1="200" y1="196" x2="200" y2="214" stroke="${darken(color,25)}" stroke-width="1"/>
  </svg>`
}

function getToteSvg(color) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${shadowColor}"/></filter>
      <linearGradient id="toteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color,5)}"/>
        <stop offset="100%" stop-color="${darken(color,10)}"/>
      </linearGradient>
    </defs>
    <!-- Bag body -->
    <path d="M75 100 Q72 370 80 395 Q200 415 320 395 Q328 370 325 100 Z"
      fill="url(#toteGrad)" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Left handle -->
    <path d="M130 100 Q125 35 155 25 Q175 18 185 40 Q180 70 178 100"
      fill="none" stroke="${darken(color,15)}" stroke-width="14" stroke-linecap="round"/>
    <path d="M130 100 Q125 35 155 25 Q175 18 185 40 Q180 70 178 100"
      fill="none" stroke="${darken(color,8)}" stroke-width="8" stroke-linecap="round"/>
    <!-- Right handle -->
    <path d="M270 100 Q275 35 245 25 Q225 18 215 40 Q220 70 222 100"
      fill="none" stroke="${darken(color,15)}" stroke-width="14" stroke-linecap="round"/>
    <path d="M270 100 Q275 35 245 25 Q225 18 215 40 Q220 70 222 100"
      fill="none" stroke="${darken(color,8)}" stroke-width="8" stroke-linecap="round"/>
    <!-- Top edge fold -->
    <path d="M75 100 Q200 115 325 100" fill="none" stroke="${darken(color,10)}" stroke-width="3"/>
    <!-- Side gussets -->
    <line x1="75" y1="100" x2="80" y2="395" stroke="${darken(color,12)}" stroke-width="2"/>
    <line x1="325" y1="100" x2="320" y2="395" stroke="${darken(color,12)}" stroke-width="2"/>
    <!-- Highlight -->
    <path d="M100 120 Q102 320 105 390" stroke="${isLight(color)?'#ffffff35':'#ffffff15'}" stroke-width="10" stroke-linecap="round" fill="none"/>
  </svg>`
}

function getPhoneSvg(color) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${shadowColor}"/></filter>
      <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color,8)}"/>
        <stop offset="100%" stop-color="${darken(color,12)}"/>
      </linearGradient>
    </defs>
    <!-- Case body -->
    <rect x="75" y="25" width="250" height="400" rx="28" fill="url(#phoneGrad)" stroke="${strokeColor}" stroke-width="2" filter="url(#shadow)"/>
    <!-- Camera bump -->
    <rect x="220" y="38" width="80" height="75" rx="14" fill="${darken(color,18)}" stroke="${strokeColor}" stroke-width="1.5"/>
    <circle cx="245" cy="63" r="16" fill="${darken(color,25)}" stroke="${darken(color,30)}" stroke-width="1"/>
    <circle cx="245" cy="63" r="10" fill="#1a1a1a"/>
    <circle cx="280" cy="63" r="13" fill="${darken(color,25)}" stroke="${darken(color,30)}" stroke-width="1"/>
    <circle cx="280" cy="63" r="8" fill="#1a1a1a"/>
    <circle cx="263" cy="88" r="8" fill="${darken(color,22)}" stroke="${darken(color,28)}" stroke-width="1"/>
    <!-- Flash -->
    <circle cx="293" cy="88" r="5" fill="#fef3c7" stroke="#fde68a" stroke-width="1"/>
    <!-- Screen outline -->
    <rect x="88" y="125" width="224" height="310" rx="10" fill="${darken(color,22)}" stroke="${darken(color,28)}" stroke-width="1"/>
    <!-- Buttons -->
    <rect x="72" y="130" width="5" height="40" rx="2.5" fill="${darken(color,20)}" stroke="${strokeColor}" stroke-width="1"/>
    <rect x="72" y="185" width="5" height="30" rx="2.5" fill="${darken(color,20)}" stroke="${strokeColor}" stroke-width="1"/>
    <rect x="323" y="150" width="5" height="50" rx="2.5" fill="${darken(color,20)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Highlight -->
    <path d="M88 70 Q88 40 115 35" stroke="${isLight(color)?'#ffffff60':'#ffffff25'}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`
}

function getTankSvg(color) {
  const strokeColor = isLight(color) ? '#d1d5db' : lighten(color, 30)
  const shadowColor = isDark(color) ? '#00000066' : '#00000022'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${shadowColor}"/></filter>
      <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lighten(color,8)}"/>
        <stop offset="100%" stop-color="${darken(color,8)}"/>
      </linearGradient>
    </defs>
    <!-- Body -->
    <path d="M120 60 Q105 80 90 160 L90 390 L310 390 L310 160 Q295 80 280 60 Q255 48 240 55 Q230 80 200 90 Q170 80 160 55 Q145 48 120 60 Z"
      fill="url(#tankGrad)" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Left armhole -->
    <path d="M120 60 Q95 70 90 130" fill="none" stroke="${strokeColor}" stroke-width="1.5"/>
    <!-- Right armhole -->
    <path d="M280 60 Q305 70 310 130" fill="none" stroke="${strokeColor}" stroke-width="1.5"/>
    <!-- Neckline -->
    <path d="M160 55 Q175 80 200 90 Q225 80 240 55 Q220 45 200 43 Q180 45 160 55 Z"
      fill="${darken(color,5)}" stroke="${strokeColor}" stroke-width="1"/>
    <!-- Side seams -->
    <line x1="90" y1="160" x2="90" y2="390" stroke="${darken(color,8)}" stroke-width="1.5"/>
    <line x1="310" y1="160" x2="310" y2="390" stroke="${darken(color,8)}" stroke-width="1.5"/>
    <!-- Highlight -->
    <path d="M110 100 Q108 260 110 380" stroke="${isLight(color)?'#ffffff35':'#ffffff15'}" stroke-width="8" stroke-linecap="round" fill="none"/>
  </svg>`
}

// ── Color Utilities ──────────────────────────────────────────────

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [200, 200, 200]
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
}

function lighten(hex, amount) {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + amount * 2, g + amount * 2, b + amount * 2)
}

function darken(hex, amount) {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r - amount * 2, g - amount * 2, b - amount * 2)
}

function isLight(hex) {
  const [r, g, b] = hexToRgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

function isDark(hex) {
  return !isLight(hex)
}
