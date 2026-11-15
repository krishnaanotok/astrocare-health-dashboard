'use client'

import { ExternalLink, FlaskConical, Info, Sparkles } from 'lucide-react'
import { NASA_SOURCES } from './data'

const nasaFindings = [
  ['NASA-supported context', 'NASA Human Research Program studies health and performance in spaceflight to help protect crew on future exploration missions.', 'Source: Human Research Program'],
  ['Spaceflight risks', 'NASA describes cardiovascular adaptation, hypoxia, altered immune responses, bone changes, reduced fitness, SANS, behavioral health, sleep and sensorimotor risks among its research topics.', 'Source: Risks of Human Spaceflight'],
  ['Standard Measures', 'NASA’s Standard Measures research collects observations across systems and time, including sleep reports, activity/light exposure, samples, cognition, sensorimotor function and strength.', 'Source: Spaceflight Standard Measures'],
  ['CIPHER', 'NASA’s CIPHER program takes an integrated, multi-system research approach that includes bone/joint health, brain and behavior, cardiovascular function, exercise, balance, vision and biomarkers.', 'Source: CIPHER'],
]

const proposedFeatures = [
  'A quick, personal mission-day check-in with an interactive body-system map.',
  'Configurable reference ranges and critical rules supplied by a validated reference or mission protocol; ASTROCARE ships with none.',
  'A session-only measurement log, trend chart, user-set due dates, daily checklist and configurable inventory reminders.',
  'Camera/file selection, keyboard and tap inputs; no image upload, connected-device feed, medical interpretation or automatic prescription in this demo.',
]

export function ResearchView() {
  return <div className="view-stack">
    <section className="welcome-row"><div><div className="eyebrow">EVIDENCE & PRODUCT BOUNDARIES</div><h1>Research & references</h1><p className="welcome-copy">What NASA research supports, and what ASTROCARE only proposes.</p></div><span className="count-pill"><FlaskConical aria-hidden="true" /> Source-linked</span></section>
    <div className="research-grid">
      <section className="panel research-panel"><div className="panel-topline"><div><div className="eyebrow">NASA RESEARCH FOUNDATION</div><h2>NASA-supported context</h2></div><FlaskConical aria-hidden="true" className="muted-icon" /></div>
        <p className="research-intro">The summaries below are attributed to the linked NASA pages. NASA’s research does not endorse ASTROCARE, its workflow or any entry in this demo.</p>
        <div className="research-finding-list">{nasaFindings.map(([title, text, source]) => <article className="research-finding" key={title}><span className="finding-marker"><Info aria-hidden="true" /></span><div><h3>{title}</h3><p>{text}</p><small>{source}</small></div></article>)}</div>
        <div className="source-list-heading"><h3>Primary sources</h3><span>Checked 15 Nov 2026</span></div>
        <div className="source-list">{NASA_SOURCES.map((source) => <a href={source.url} key={source.id} target="_blank" rel="noreferrer" className="reference-link"><span className="reference-icon"><FlaskConical aria-hidden="true" /></span><span><strong>{source.title}</strong><small>{source.url.replace('https://', '')}</small><small>Publication/update date: not surfaced in the page content available for this review.</small></span><ExternalLink aria-hidden="true" className="reference-external" /></a>)}</div>
      </section>
      <aside className="panel proposed-panel"><div className="panel-topline"><div><div className="eyebrow">PRODUCT DESIGN · NOT NASA DATA</div><h2>Proposed ASTROCARE features</h2></div><Sparkles aria-hidden="true" className="muted-icon" /></div><p>These are design concepts, not NASA protocols, validated instruments, datasets or endorsements.</p><ul className="proposed-list">{proposedFeatures.map((feature) => <li key={feature}><span><Info aria-hidden="true" /></span>{feature}</li>)}</ul>
        <div className="boundary-callout"><strong>Reference ranges are intentionally blank.</strong><p>Configure them only from validated clinical references and mission-specific medical protocols. A numeric comparison is not a diagnosis.</p></div>
        <div className="boundary-callout"><strong>Guidance has a human handoff.</strong><p>For urgent symptoms or a red configured result, use the mission medical escalation protocol and contact the flight surgeon.</p></div>
      </aside>
    </div>
  </div>
}
