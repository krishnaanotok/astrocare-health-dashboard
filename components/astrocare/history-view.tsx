'use client'

import { useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { HEALTH_MODULES, type HealthReading, type ModuleId } from './data'
import { EmptyState, StatusBadge, TrendChart } from './shared'

export function HistoryView({ readings }: { readings: HealthReading[] }) {
  const [moduleId, setModuleId] = useState<ModuleId | 'all'>('all')
  const [metricId, setMetricId] = useState('all')
  const [period, setPeriod] = useState('all')
  const [query, setQuery] = useState('')
  const modules = moduleId === 'all' ? HEALTH_MODULES : HEALTH_MODULES.filter((item) => item.id === moduleId)
  const metrics = [...new Map(modules.flatMap((item) => item.metrics).map((metric) => [metric.id, metric])).values()]
  const filtered = useMemo(() => readings.filter((reading) => {
    const cutoff = period === 'day' ? Date.now() - 86400000 : period === 'week' ? Date.now() - 7 * 86400000 : 0
    const text = `${reading.moduleTitle} ${reading.metricLabel} ${reading.value} ${reading.note ?? ''}`.toLowerCase()
    return (moduleId === 'all' || reading.moduleId === moduleId)
      && (metricId === 'all' || reading.metricId === metricId)
      && reading.timestamp >= cutoff && text.includes(query.trim().toLowerCase())
  }).sort((a, b) => b.timestamp - a.timestamp), [readings, moduleId, metricId, period, query])
  const chartReadings = filtered.filter((reading) => reading.metricId === metricId && reading.numericValue !== null)
  const chartMetric = metrics.find((metric) => metric.id === metricId)
  const hasSpecificMetric = metricId !== 'all'

  return <div className="view-stack">
    <section className="welcome-row"><div><div className="eyebrow">PERSONAL SESSION LOG</div><h1>Health history</h1><p className="welcome-copy">Browse this session’s entries. A page reload clears the demo history.</p></div><span className="count-pill">{readings.length} {readings.length === 1 ? 'entry' : 'entries'}</span></section>
    <section className="panel history-panel">
      <div className="panel-topline"><div><div className="eyebrow">FILTER & EXPLORE</div><h2>Measurements and notes</h2></div><Filter aria-hidden="true" className="muted-icon" /></div>
      <div className="history-filters">
        <label className="field-label">Health system<select value={moduleId} onChange={(event) => { setModuleId(event.target.value as ModuleId | 'all'); setMetricId('all') }}><option value="all">All systems</option>{HEALTH_MODULES.map((module) => <option value={module.id} key={module.id}>{module.title}</option>)}</select></label>
        <label className="field-label">Measurement<select value={metricId} onChange={(event) => setMetricId(event.target.value)}><option value="all">All measurements</option>{metrics.map((metric) => <option value={metric.id} key={metric.id}>{metric.label}</option>)}</select></label>
        <label className="field-label">Time window<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="all">All session</option><option value="day">Past 24 hours</option><option value="week">Past 7 days</option></select></label>
        <label className="search-field"><span>Search entries</span><span className="search-input"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="System, value or note" /></span></label>
      </div>
      <div className="history-chart-section"><div><div className="eyebrow">TREND</div><h3>{chartMetric ? chartMetric.label : 'Choose one measurement'}</h3></div>{hasSpecificMetric && chartMetric ? <TrendChart readings={chartReadings} metricLabel={chartMetric.label} unit={chartMetric.unit} /> : <p className="chart-choice-note">Choose one measurement above to graph it. Different units are never combined.</p>}</div>
      <div className="history-table-wrap">
        {filtered.length ? <table className="history-table"><thead><tr><th scope="col">Recorded</th><th scope="col">System</th><th scope="col">Measurement</th><th scope="col">Value</th><th scope="col">Status</th></tr></thead><tbody>{filtered.map((reading) => <tr key={reading.id}><td>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(reading.timestamp)}</td><td>{reading.moduleTitle}</td><td>{reading.metricLabel}</td><td>{reading.value}{reading.unit ? ` ${reading.unit}` : ''}</td><td><StatusBadge status={reading.status} /></td></tr>)}</tbody></table> : <EmptyState title="No entries match this filter" body={readings.length ? 'Try a different system, time window or search.' : 'Record an assessment to build a chart and session history. Nothing is pre-filled as a medical measurement.'} />}
      </div>
      <p className="table-note">Range values are stored with the entry only as a demo-session status snapshot. Neither history nor notes persist after reload.</p>
    </section>
  </div>
}
