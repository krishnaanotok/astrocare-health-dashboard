'use client'

import { AlertCircle, AlertTriangle, ArrowRight, BellRing, Clock3 } from 'lucide-react'
import { HEALTH_MODULES } from './data'
import type { MissionAlert } from './dashboard-view'
import { EmptyState } from './shared'

export function AlertsView({ alerts, onOpenModule }: { alerts: MissionAlert[]; onOpenModule: (id: NonNullable<MissionAlert['moduleId']>) => void }) {
  const critical = alerts.filter((alert) => alert.status === 'critical')
  return <div className="view-stack">
    <section className="welcome-row"><div><div className="eyebrow">MISSION AWARENESS</div><h1>Alerts & reminders</h1><p className="welcome-copy">Only configured ranges, set schedules, reported concerns and inventory rules can trigger an item.</p></div><span className="count-pill"><BellRing aria-hidden="true" /> {alerts.length} active</span></section>
    {critical.length > 0 && <section className="escalation-banner" role="alert"><AlertCircle aria-hidden="true" /><div><strong>Potentially critical report or configured result</strong><p>Follow the mission medical escalation protocol now. Contact the flight surgeon or medical team through established mission channels. ASTROCARE does not diagnose or provide an emergency service.</p></div></section>}
    {alerts.length ? <div className="alert-center-list">{alerts.map((alert) => {
      const module = HEALTH_MODULES.find((item) => item.id === alert.moduleId)
      return <article className={`alert-center-item ${alert.status}`} key={alert.id}><span className="alert-center-icon">{alert.status === 'critical' ? <AlertCircle aria-hidden="true" /> : alert.title.includes('due') || alert.title.includes('Missed') ? <Clock3 aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}</span><div className="alert-center-copy"><div className="alert-row-title"><strong>{alert.title}</strong><span className={`alert-level ${alert.status}`}>{alert.status === 'critical' ? 'Potentially critical' : 'Review'}</span></div><p>{alert.detail}</p>{alert.status === 'critical' && <p className="red-action-copy">{alert.action}</p>}{module && <button className="text-link" type="button" onClick={() => onOpenModule(module.id)}>Open {module.title} <ArrowRight aria-hidden="true" /></button>}</div></article>
    })}</div> : <section className="panel"><EmptyState title="No active alerts" body="No configured alert condition has fired. Unconfigured ranges are not evaluated, and no health values are pre-filled." /></section>}
    <section className="panel pending-panel"><div className="eyebrow">PENDING IS NOT MISSED</div><h2>Assessment reminders</h2><p>A due date becomes a reminder only after you enter the date from your mission schedule. A check-in due today or overdue is shown above in amber; this app never invents a cadence.</p><div className="alert-legend"><span className="alert-level attention"><AlertTriangle aria-hidden="true" /> Yellow · review / reassess</span><span className="alert-level critical"><AlertCircle aria-hidden="true" /> Red · follow mission escalation protocol</span></div></section>
  </div>
}
