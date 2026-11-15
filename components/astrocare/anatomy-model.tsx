'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import type { ModuleId } from './data'

export function AnatomyModel({ selected, onSelect }: { selected: ModuleId; onSelect: (id: ModuleId) => void }) {
  const activate = (event: KeyboardEvent<SVGGElement>, id: ModuleId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(id)
    }
  }
  const part = (id: ModuleId, label: string, children: ReactNode) => (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Select ${label} module`}
      aria-pressed={selected === id}
      className={`anatomy-hotspot ${selected === id ? 'is-selected' : ''}`}
      onClick={() => onSelect(id)}
      onKeyDown={(event) => activate(event, id)}
    >
      <title>{label}</title>
      {children}
    </g>
  )

  return (
    <svg className="anatomy-svg" viewBox="0 0 250 500" role="group" aria-label="Interactive astronaut body systems. Use Tab and Enter or Space to select a system.">
      <defs>
        <radialGradient id="body-glow"><stop stopColor="#0e7490" stopOpacity=".24" /><stop offset="1" stopColor="#0e7490" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="125" cy="265" rx="92" ry="215" fill="url(#body-glow)" />
      <path className="anatomy-silhouette" d="M102 37c0-15 10-25 23-25s23 10 23 25v18c0 11-6 20-15 24l-4 13c26 5 47 16 58 33l13 76c3 13-7 24-20 24h-7l-4 89 18 140c2 14-9 25-23 25h-4c-12 0-21-9-22-21l-17-118-17 118c-2 12-10 21-22 21h-4c-14 0-25-11-23-25l18-140-4-89h-7c-13 0-23-11-20-24l13-76c11-17 32-28 58-33l-4-13c-9-4-15-13-15-24V37Z" />
      <path className="anatomy-outline" d="M125 93v82m-34-50-26 94m94-94 26 94m-94 0 6 82m50-82-6 82m-33-55 33 0m-29 92-9 74m39-74 9 74" />
      {part('mental-cognitive', 'Mental and cognitive', <path className="anatomy-region anatomy-head" d="M111 30c0-9 6-15 14-15s14 6 14 15v19c0 8-6 15-14 15s-14-7-14-15V30Z" />)}
      {part('vision-neurological', 'Vision and neurological', <g className="anatomy-region"><path d="M111 42q7-7 14 0-7 7-14 0Zm14 0q7-7 14 0-7 7-14 0Z" /><circle cx="118" cy="42" r="2" /><circle cx="132" cy="42" r="2" /></g>)}
      {part('cardiovascular', 'Cardiovascular', <path className="anatomy-region" d="M125 142c-8-11-22-2-16 9l16 18 16-18c6-11-8-20-16-9Z" />)}
      {part('respiratory', 'Respiratory', <g className="anatomy-region"><path d="M118 121c-8 8-10 24-8 37 5 8 13 5 15-2v-30c0-7-3-9-7-5Zm14 0c8 8 10 24 8 37-5 8-13 5-15-2v-30c0-7 3-9 7-5Z" /></g>)}
      {part('musculoskeletal', 'Musculoskeletal', <g className="anatomy-bone"><path d="m90 132-16 72m86-72 16 72M98 255l-2 62m56-62 2 62m-27-102v32m-9 11 18 0" /><circle cx="73" cy="207" r="5" /><circle cx="177" cy="207" r="5" /><circle cx="95" cy="322" r="5" /><circle cx="155" cy="322" r="5" /></g>)}
      {part('nutrition-immune', 'Nutrition and immune', <g className="anatomy-region"><path d="M106 188q19-12 38 0v30q-19 12-38 0Z" /><path d="M113 200c5-5 8 5 13 0s8 5 13 0" className="anatomy-region-line" /></g>)}
      <g className={`anatomy-hotspot med-marker ${selected === 'medicine' ? 'is-selected' : ''}`} role="button" tabIndex={0} aria-label="Select medicine management module" aria-pressed={selected === 'medicine'} onClick={() => onSelect('medicine')} onKeyDown={(event) => activate(event, 'medicine')}>
        <title>Medicine management</title><rect x="171" y="240" width="42" height="44" rx="10" className="anatomy-region" /><path d="M184 262h16m-8-8v16" className="anatomy-marker-cross" />
      </g>
    </svg>
  )
}
