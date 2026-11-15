'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { ArrowRight, Camera, Check, ChevronRight, Clock3, ExternalLink, FileText, Info, ShieldCheck, Upload } from 'lucide-react'
import { HEALTH_MODULES, NASA_SOURCES, statusForReading, type HealthModule, type HealthReading, type ModuleId, type RangeConfig } from './data'
import { Delta, ModuleIcon, StatusBadge, TrendChart } from './shared'

const EMPTY_RANGE: RangeConfig = { normalLow: '', normalHigh: '', criticalLow: '', criticalHigh: '', source: '' }

function RangeEditor({ range, onSave }: { range?: RangeConfig; onSave: (range: RangeConfig) => void }) {
  const [draft, setDraft] = useState<RangeConfig>(range ?? EMPTY_RANGE)
  const [error, setError] = useState('')
  const update = (key: keyof RangeConfig, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const low = Number(draft.normalLow)
    const high = Number(draft.normalHigh)
    if (!draft.source.trim() || draft.normalLow === '' || draft.normalHigh === '' || !Number.isFinite(low) || !Number.isFinite(high) || low > high) {
      setError('Enter both normal bounds and the validated source or mission protocol.')
      return
    }
    if ((draft.criticalLow !== '' && Number(draft.criticalLow) >= low) || (draft.criticalHigh !== '' && Number(draft.criticalHigh) <= high)) {
      setError('Critical bounds must be outside the normal range.')
      return
    }
    setError('')
    onSave(draft)
  }
  return <details className="range-details"><summary><ShieldCheck aria-hidden="true" /> Configure mission reference range <span>Optional · no thresholds supplied</span></summary>
    <form className="range-form" onSubmit={handleSave}>
      <p>Enter values only from a validated clinical reference or your mission medical protocol. ASTROCARE does not provide thresholds. Values stay in this demo session.</p>
      <div className="range-inputs">
        <label>Normal low<input type="number" step="any" value={draft.normalLow} onChange={(event) => update('normalLow', event.target.value)} /></label>
        <label>Normal high<input type="number" step="any" value={draft.normalHigh} onChange={(event) => update('normalHigh', event.target.value)} /></label>
        <label>Critical low (optional)<input type="number" step="any" value={draft.criticalLow} onChange={(event) => update('criticalLow', event.target.value)} /></label>
        <label>Critical high (optional)<input type="number" step="any" value={draft.criticalHigh} onChange={(event) => update('criticalHigh', event.target.value)} /></label>
      </div>
      <label>Source / protocol name<input required value={draft.source} onChange={(event) => update('source', event.target.value)} placeholder="Validated reference or mission protocol" /></label>
      <div className="range-footer"><span>Red configured results point to mission escalation procedures.</span><button className="secondary-button" type="submit">Apply for this metric</button></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {range?.source && <p className="success-note"><Check aria-hidden="true" /> Active for new readings: {range.source}</p>}
    </form>
  </details>
}

function MetricInput({ metric, value, onChange }: { metric: HealthModule['metrics'][number]; value: string; onChange: (value: string) => void }) {
  if (metric.kind === 'choice') return <fieldset className="choice-field"><legend>{metric.label}<span className="required-mark"> *</span></legend><div className="choice-grid">{metric.options?.map((option) => <button key={option} type="button" className={`choice-button ${value === option ? 'active' : ''}`} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div><p className="field-help">{metric.helper}</p></fieldset>
  if (metric.kind === 'text') return <label className="field-label">{metric.label}<span className="required-mark"> *</span><textarea required value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter the observation or approved result" rows={3} /><small>{metric.helper}</small></label>
  return <label className="field-label">{metric.label}{metric.unit ? ` (${metric.unit})` : ''}<span className="required-mark"> *</span><input required type="number" inputMode="decimal" step="any" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter device reading" /><small>{metric.helper}</small></label>
}

export function ModuleView({
  moduleId, readings, ranges, dueDate, onSelectModule, onSaveRange, onAddReading, onSetDueDate,
}: {
  moduleId: ModuleId
  readings: HealthReading[]
  ranges: Record<string, RangeConfig>
  dueDate?: string
  onSelectModule: (id: ModuleId) => void
  onSaveRange: (key: string, value: RangeConfig) => void
  onAddReading: (reading: HealthReading) => void
  onSetDueDate: (value: string) => void
}) {
  const module = HEALTH_MODULES.find((item) => item.id === moduleId) ?? HEALTH_MODULES[0]
  const [metricId, setMetricId] = useState(module.metrics[0].id)
  const [value, setValue] = useState('')
  const [concern, setConcern] = useState('')
  const [note, setNote] = useState('')
  const [attachment, setAttachment] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const metric = module.metrics.find((item) => item.id === metricId) ?? module.metrics[0]
  const rangeKey = `${module.id}:${metric.id}`
  const selectedRange = ranges[rangeKey]
  const moduleReadings = readings.filter((reading) => reading.moduleId === module.id)
  const selectedReadings = moduleReadings.filter((reading) => reading.metricId === metric.id).sort((a, b) => b.timestamp - a.timestamp)
  const latest = selectedReadings[0]
  const previous = selectedReadings[1]
  const sourceIds = module.sources.map((id) => NASA_SOURCES.find((source) => source.id === id)).filter(Boolean)

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    setAttachment(event.target.files?.[0]?.name ?? '')
  }
  const submitReading = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!value.trim() || !concern) {
      setSaveMessage('Choose a response for each required field before recording.')
      return
    }
    const cleanConcern = concern as 'none' | 'attention' | 'critical'
    const status = statusForReading(value.trim(), metric.kind, selectedRange, cleanConcern)
    const numericValue = metric.kind === 'number' && Number.isFinite(Number(value)) ? Number(value) : null
    const entry: HealthReading = {
      id: crypto.randomUUID(), moduleId: module.id, moduleTitle: module.title,
      metricId: metric.id, metricLabel: metric.label, value: value.trim(), numericValue,
      unit: metric.unit, timestamp: Date.now(), status, concern: cleanConcern,
      rangeSource: selectedRange?.source || undefined, note: note.trim() || undefined,
    }
    onAddReading(entry)
    setSaveMessage(`Recorded for this session. ${status === 'critical' ? 'Follow the mission medical escalation protocol now.' : status === 'attention' ? 'Review with the mission medical team.' : status === 'within' ? 'Within your configured range; this is not a diagnosis.' : 'No health status calculated because the range is not configured.'}`)
    setValue('')
    setConcern('')
    setNote('')
  }

  const statusImplication = latest?.status === 'critical'
    ? 'This configured rule or your severe-symptom report requires immediate mission-protocol escalation.'
    : latest?.status === 'attention'
      ? 'A configured range or your report asks for review; it does not identify a cause.'
      : latest?.status === 'within'
        ? 'This entry is within the range you supplied. It cannot establish that you are healthy.'
        : 'A measurement without a configured protocol range is recorded but not clinically classified.'

  return <div className="view-stack">
    <section className="welcome-row module-welcome">
      <div><div className="eyebrow">ASSESSMENTS · {module.title.toUpperCase()}</div><h1>{module.title}</h1><p className="welcome-copy">{module.summary}</p></div>
      <div className="module-progress-pill"><span className="module-icon-large"><ModuleIcon module={module} /></span><span><strong>Session entry</strong><small>No data leaves this tab</small></span></div>
    </section>

    <div className="module-layout">
      <aside className="panel module-picker" aria-label="Health modules">
        <div className="eyebrow">SEVEN HEALTH MODULES</div>
        {HEALTH_MODULES.map((item) => {
          const count = readings.filter((reading) => reading.moduleId === item.id).length
          return <button key={item.id} type="button" className={`module-picker-item ${item.id === module.id ? 'active' : ''}`} aria-current={item.id === module.id ? 'page' : undefined} onClick={() => onSelectModule(item.id)}><ModuleIcon module={item} /><span><strong>{item.title}</strong><small>{count ? `${count} session ${count === 1 ? 'entry' : 'entries'}` : 'No measurement yet'}</small></span><ChevronRight aria-hidden="true" /></button>
        })}
      </aside>
      <section className="module-content">
        <article className="panel guidance-panel">
          <div className="module-intro-row"><span className="module-icon-large"><ModuleIcon module={module} /></span><div><div className="eyebrow">SPACEFLIGHT CONTEXT</div><h2>What to know</h2></div></div>
          <p className="module-effect">{module.effects}</p>
          <div className="source-chip-row">{sourceIds.map((source) => source && <a key={source.id} className="source-chip" href={source.url} target="_blank" rel="noreferrer">NASA · {source.title}</a>)}</div>
          <details className="guidance-details"><summary>Plain-language guidance for this system</summary><div className="guidance-grid">
            <div><strong>What does this indicator mean?</strong><p>{module.meaning}</p></div>
            <div><strong>Why does it matter in space?</strong><p>{module.why}</p></div>
            <div><strong>How can spaceflight affect it?</strong><p>{module.hazards}</p></div>
            <div><strong>What should I watch for?</strong><p>{module.symptoms}</p></div>
            <div><strong>What preventive steps help?</strong><p>{module.prevention}</p></div>
            <div><strong>When should I contact the medical team?</strong><p>{module.contact}</p></div>
          </div></details>
        </article>

        <div className="module-bottom-grid">
          <article className="panel assessment-panel">
            <div className="panel-topline"><div><div className="eyebrow">GUIDED CHECK-IN</div><h2>Record an observation</h2></div><span className="time-estimate"><Clock3 aria-hidden="true" /> About 2 min</span></div>
            <div className="instruction-callout"><Info aria-hidden="true" /><div><strong>Use your mission protocol</strong><ol>{module.assessmentSteps.map((step) => <li key={step}>{step}</li>)}</ol></div></div>
            <form className="assessment-form" onSubmit={submitReading}>
              <label className="field-label">Measurement or observation<select value={metricId} onChange={(event) => { setMetricId(event.target.value); setValue(''); setSaveMessage('') }}>{module.metrics.map((item) => <option key={item.id} value={item.id}>{item.label}{item.unit ? ` · ${item.unit}` : ''}</option>)}</select></label>
              <MetricInput metric={metric} value={value} onChange={setValue} />
              <label className="field-label">How are you feeling about this check-in?<select required value={concern} onChange={(event) => setConcern(event.target.value)}><option value="">Select one…</option><option value="none">No new concern to report</option><option value="attention">New or worsening concern — request review</option><option value="critical">Severe or sudden symptom — escalate now</option></select><small>Self-reported only; the app does not triage symptoms.</small></label>
              <label className="field-label">Optional context<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Conditions, device, protocol name or context" rows={2} /></label>
              <div className="input-methods"><span className="input-method-label">INPUT METHODS</span><span className="method-chip active"><FileText aria-hidden="true" /> Keyboard / tap</span><label className="method-chip file-method"><Camera aria-hidden="true" /> Capture photo<input type="file" accept="image/*" capture="environment" onChange={pickFile} /></label><label className="method-chip file-method"><Upload aria-hidden="true" /> Select image<input type="file" accept="image/*" onChange={pickFile} /></label></div>
              <p className="upload-note">{attachment ? `Selected locally: ${attachment}. Not uploaded or saved.` : 'Images stay local and are not uploaded or attached to the entry in this demo.'}</p>
              <button className="primary-button submit-button" type="submit">Record check-in <ArrowRight aria-hidden="true" /></button>
              {saveMessage && <p className="save-message" role="status">{saveMessage}</p>}
            </form>
            {metric.kind === 'number' && <RangeEditor key={rangeKey} range={selectedRange} onSave={(range) => onSaveRange(rangeKey, range)} />}
            <div className="device-note"><span className="device-indicator" /> Connected devices <strong>Not connected</strong><span>· No sensor data is received.</span></div>
          </article>

          <aside className="module-side-column">
            <article className="panel outcome-panel">
              <div className="eyebrow">LATEST · {metric.label.toUpperCase()}</div>
              {latest ? <>
                <div className="latest-value">{latest.value}<small>{latest.unit}</small></div>
                <StatusBadge status={latest.status} />
                <div className="outcome-lines"><p><span>Previous</span><strong>{previous ? `${previous.value}${previous.unit ? ` ${previous.unit}` : ''}` : 'No previous entry'}</strong></p><p><span>Trend</span><strong><Delta latest={latest} previous={previous} /></strong></p><p><span>Possible implication</span><strong>{statusImplication}</strong></p></div>
                <div className={`next-action ${latest.status === 'critical' ? 'critical-action' : ''}`}><ShieldCheck aria-hidden="true" /><span><strong>Recommended next step</strong>{latest.status === 'critical' ? 'Follow the mission medical escalation protocol now and contact the flight surgeon through mission channels.' : latest.status === 'attention' ? 'Recheck only as your protocol directs; contact the mission medical team for guidance.' : latest.status === 'within' ? 'Continue with your mission plan; a normal-range entry is not a diagnosis.' : module.contact}</span></div>
              </> : <div className="module-empty"><StatusBadge status="none" /><p>No measurements in this session. Your previous measurement will appear here after you record an entry.</p></div>}
              <div className="protocol-config"><span><ShieldCheck aria-hidden="true" /> Active range source</span><strong>{selectedRange?.source ?? 'Not configured'}</strong></div>
            </article>
            <article className="panel chart-panel"><div className="eyebrow">MEASUREMENT HISTORY</div><h2>{metric.label} trend</h2><TrendChart readings={selectedReadings} metricLabel={metric.label} unit={metric.unit} /></article>
            <article className="panel schedule-panel"><div className="eyebrow">MISSION CADENCE</div><h2>Next due date</h2><p>Set from your assigned schedule. No schedule is assumed.</p><label className="field-label">Assessment due date<input aria-label={`${module.title} assessment due date`} type="date" value={dueDate ?? ''} onChange={(event) => onSetDueDate(event.target.value)} /></label><small>{dueDate ? 'Reminders use this date; only you can change the schedule.' : 'No due date set.'}</small></article>
          </aside>
        </div>

        <article className="panel action-panel"><div><div className="eyebrow">ASTROCARE PROPOSED WORKFLOW</div><h2>Preventive actions</h2><p>{module.prevention}</p></div><button className="quiet-button" type="button" onClick={() => document.querySelector('.guidance-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Read guidance <ExternalLink aria-hidden="true" /></button></article>
      </section>
    </div>
  </div>
}

