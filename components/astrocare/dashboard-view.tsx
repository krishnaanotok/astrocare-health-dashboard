'use client'

import type { CSSProperties } from 'react'
import { ArrowRight, Bell, CalendarDays, Check, ChevronRight, ClipboardList, Clock3, Moon, ShieldCheck } from 'lucide-react'
import { AnatomyModel } from './anatomy-model'
import { HEALTH_MODULES, ROUTINE_TASKS, type HealthReading, type HealthStatus, type ModuleId } from './data'
import { EmptyState, ModuleIcon, RoutineBadge, StatusBadge, TaskCheck } from './shared'

export type MissionAlert = {
  id: string
  status: 'attention' | 'critical'
  title: string
  detail: string
  moduleId?: ModuleId
  action: string
}

export function DashboardView({
  readings, selectedModule, onSelectModule, onOpenModule, onOpenView,
  tasks, onToggleTask, alerts,
}: {
  readings: HealthReading[]
  selectedModule: ModuleId
  onSelectModule: (id: ModuleId) => void
  onOpenModule: () => void
  onOpenView: (view: 'history' | 'alerts' | 'medicines' | 'research') => void
  tasks: Record<string, boolean>
  onToggleTask: (id: string) => void
  alerts: MissionAlert[]
}) {
  const module = HEALTH_MODULES.find((item) => item.id === selectedModule) ?? HEALTH_MODULES[0]
  const latest = readings.filter((reading) => reading.moduleId === module.id).sort((a, b) => b.timestamp - a.timestamp)[0]
  const completeCount = Object.values(tasks).filter(Boolean).length
  const completedSystems = new Set(readings.map((item) => item.moduleId)).size
  const latestBySystem = HEALTH_MODULES.map((item) => readings.filter((reading) => reading.moduleId === item.id).sort((a, b) => b.timestamp - a.timestamp)[0]).filter(Boolean)
  const overallStatus: HealthStatus = latestBySystem.some((item) => item.status === 'critical') ? 'critical'
    : latestBySystem.some((item) => item.status === 'attention') ? 'attention'
      : latestBySystem.length === 0 ? 'none' : 'unconfigured'
  const dateLabel = 'Sunday, Nov 15, 2026'

  return (
    <div className="view-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> MISSION HEALTH · QUICK CHECK-IN</div>
          <h1>Your health, at a glance.</h1>
          <p className="welcome-copy">A calm two-minute check-in for a long way from home.</p>
        </div>
        <div className="mission-date"><CalendarDays aria-hidden="true" /><span><strong>{dateLabel}</strong><small>Riley Chen · mission day 143 · simulated</small></span></div>
      </section>

      <section className="summary-grid" aria-label="Mission health summary">
        <article className="summary-card overall-card">
          <div className="summary-label"><span className="summary-icon"><ShieldCheck aria-hidden="true" /></span><span>OVERALL STATUS</span></div>
          <StatusBadge status={overallStatus} label={overallStatus === 'none' ? 'Not assessed' : overallStatus === 'unconfigured' ? 'Partial data · no overall rating' : undefined} />
          <p>{readings.length ? 'Individual entries are not a full health assessment.' : 'No health measurements have been recorded in this session.'}</p>
        </article>
        <article className="summary-card">
          <div className="summary-label"><span className="summary-icon blue"><ClipboardList aria-hidden="true" /></span><span>ASSESSMENTS</span></div>
          <div className="summary-number">{completedSystems}<span> / 7 systems</span></div>
          <p>{completedSystems ? 'Systems with an entry in this session.' : 'No assessments logged today.'}</p>
        </article>
        <article className="summary-card">
          <div className="summary-label"><span className="summary-icon amber"><Bell aria-hidden="true" /></span><span>ALERTS & REMINDERS</span></div>
          <div className="summary-number">{alerts.length}<span> active</span></div>
          <p>{alerts.length ? 'Review each item and follow mission procedures.' : 'No configured alert conditions are active.'}</p>
          <button className="text-link" type="button" onClick={() => onOpenView('alerts')}>Open alert center <ArrowRight aria-hidden="true" /></button>
        </article>
        <article className="summary-card rhythm-card">
          <div className="summary-label"><span className="summary-icon cyan"><Check aria-hidden="true" /></span><span>TODAY’S ROUTINE</span></div>
          <div className="ring-row">
            <div className="progress-ring" style={{ '--progress': `${(completeCount / ROUTINE_TASKS.length) * 100}%` } as CSSProperties} aria-label={`${completeCount} of ${ROUTINE_TASKS.length} routine items completed`}>
              <div><strong>{completeCount}</strong><small>of {ROUTINE_TASKS.length}</small></div>
            </div>
            <div><strong>{completeCount === ROUTINE_TASKS.length ? 'Routine complete' : `${ROUTINE_TASKS.length - completeCount} to go`}</strong><small>Consistency, not perfection.</small></div>
          </div>
          <RoutineBadge completed={completeCount} />
        </article>
      </section>

      <section className="dashboard-main-grid">
        <article className="panel body-panel">
          <div className="section-heading">
            <div><div className="eyebrow">BODY SYSTEMS</div><h2>How are you feeling?</h2><p>Select a system to see the latest check-in and a suggested next step.</p></div>
            <span className="interactive-hint"><span className="pulse-dot" /> Interactive model</span>
          </div>
          <div className="body-detail-layout">
            <div className="body-model-wrap">
              <AnatomyModel selected={selectedModule} onSelect={onSelectModule} />
              <div className="body-legend"><span><i className="legend-dot cyan-dot" /> Selected system</span><span><i className="legend-dot grey-dot" /> No reading</span></div>
            </div>
            <div className="system-detail" aria-live="polite">
              <div className="system-detail-icon"><ModuleIcon module={module} /></div>
              <div className="eyebrow">SELECTED SYSTEM</div>
              <h3>{module.title}</h3>
              <p>{module.effects}</p>
              <div className="latest-readout">
                <div><small>LATEST MEASUREMENT</small><strong>{latest ? `${latest.value}${latest.unit ? ` ${latest.unit}` : ''}` : 'No measurement yet'}</strong></div>
                <StatusBadge status={latest?.status ?? 'none'} />
              </div>
              <p className="detail-action">{latest ? 'Review the entry and its configured range in the module.' : 'Start with an approved assessment or a short note.'}</p>
              <button className="primary-button" type="button" onClick={onOpenModule}>Open assessment <ArrowRight aria-hidden="true" /></button>
              <div className="text-link-row"><button className="text-link" type="button" onClick={() => onOpenView('history')}>View history <ChevronRight aria-hidden="true" /></button></div>
            </div>
          </div>
          <div className="system-chip-row" aria-label="Choose a health module">
            {HEALTH_MODULES.map((item) => <button type="button" key={item.id} className={`system-chip ${selectedModule === item.id ? 'selected' : ''}`} aria-pressed={selectedModule === item.id} onClick={() => onSelectModule(item.id)}><ModuleIcon module={item} />{item.title}</button>)}
          </div>
        </article>

        <aside className="panel routine-panel" aria-labelledby="routine-title">
          <div className="panel-topline"><div><div className="eyebrow">DAILY RHYTHM</div><h2 id="routine-title">Your checklist</h2></div><Clock3 aria-hidden="true" className="muted-icon" /></div>
          <p className="panel-intro">A few honest notes help you see patterns. Your medical cadence takes priority.</p>
          <div className="routine-list">
            {ROUTINE_TASKS.map((task) => <TaskCheck key={task.id} title={task.title} hint={task.hint} done={Boolean(tasks[task.id])} onClick={() => onToggleTask(task.id)} />)}
          </div>
          <div className="routine-footnote"><Moon aria-hidden="true" /><span>No points for hiding symptoms or skipping an assessment.</span></div>
        </aside>
      </section>

      <section className="panel alerts-panel" aria-labelledby="alerts-title">
        <div className="section-heading compact-heading"><div><div className="eyebrow">MISSION AWARENESS</div><h2 id="alerts-title">Alerts & pending actions</h2></div><button className="text-link" type="button" onClick={() => onOpenView('alerts')}>View all <ArrowRight aria-hidden="true" /></button></div>
        {alerts.length ? <div className="alert-preview-list">{alerts.slice(0, 3).map((alert) => <article key={alert.id} className={`alert-preview ${alert.status}`}><span className="alert-preview-icon">{alert.status === 'critical' ? <Bell aria-hidden="true" /> : <Clock3 aria-hidden="true" />}</span><div><strong>{alert.title}</strong><p>{alert.detail}</p>{alert.status === 'critical' && <b>Follow the mission medical escalation protocol now.</b>}</div><button className="icon-button" type="button" aria-label={`Open ${alert.title}`} onClick={() => alert.moduleId ? (onSelectModule(alert.moduleId), onOpenModule()) : onOpenView('alerts')}><ChevronRight aria-hidden="true" /></button></article>)}</div> : <EmptyState title="Nothing needs your attention right now" body="Configured ranges, user-set schedules and the sample inventory will appear here when an alert condition is triggered." action={<button className="text-link" type="button" onClick={() => onOpenView('medicines')}>Review inventory <ArrowRight aria-hidden="true" /></button>} />}
        <div className="pending-note"><Clock3 aria-hidden="true" /><span>Routine tasks are pending until you complete them; they are not marked “missed” unless you set a due date.</span></div>
      </section>
    </div>
  )
}
