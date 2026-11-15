'use client'

import type { ReactNode } from 'react'
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowUpRight,
  BadgeCheck, Bone, Brain, Check, CheckCircle2, Circle, Eye, Heart, Info,
  Leaf, Pill, ShieldCheck, Wind,
} from 'lucide-react'
import {
  CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  ChartContainer, ChartTooltipContent,
} from '@/components/ui/chart'
import type { HealthModule, HealthReading, HealthStatus } from './data'

const iconMap = {
  heart: Heart, wind: Wind, bone: Bone, brain: Brain, eye: Eye, leaf: Leaf, pill: Pill,
} as const

export function ModuleIcon({ module, className = '' }: { module: HealthModule; className?: string }) {
  const Icon = iconMap[module.icon as keyof typeof iconMap] ?? Activity
  return <Icon aria-hidden="true" className={className} />
}

const statusIcon = {
  none: Circle,
  unconfigured: Info,
  within: CheckCircle2,
  attention: AlertTriangle,
  critical: AlertCircle,
} as const

const statusClass = {
  none: 'status-neutral',
  unconfigured: 'status-unconfigured',
  within: 'status-within',
  attention: 'status-attention',
  critical: 'status-critical',
} as const

const statusLabel: Record<HealthStatus, string> = {
  none: 'No measurement yet',
  unconfigured: 'Range not configured',
  within: 'Within configured range',
  attention: 'Needs attention',
  critical: 'Potentially critical',
}

export function StatusBadge({ status, label }: { status: HealthStatus; label?: string }) {
  const Icon = statusIcon[status]
  return <span className={`status-badge ${statusClass[status]}`}><Icon aria-hidden="true" />{label ?? statusLabel[status]}</span>
}

export function TrendChart({ readings, metricLabel, unit }: { readings: HealthReading[]; metricLabel: string; unit: string }) {
  const data = [...readings]
    .filter((reading) => reading.numericValue !== null)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((reading) => ({
      time: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(reading.timestamp),
      value: reading.numericValue as number,
      unit: reading.unit,
    }))
  if (data.length < 2) return <div className="chart-empty"><Activity aria-hidden="true" /><span>{data.length ? 'One reading recorded. Add another to see a trend.' : 'No numeric readings to chart yet.'}</span></div>
  return (
    <div className="trend-chart">
      <ChartContainer config={{ value: { label: metricLabel, color: 'var(--chart-1)' } }} className="chart-canvas" aria-label={`${metricLabel} trend chart`}>
        <LineChart accessibilityLayer data={data} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 5" />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={9} minTickGap={24} />
          <YAxis width={42} tickLine={false} axisLine={false} tickMargin={8} />
          <Tooltip content={<ChartTooltipContent labelKey="time" />} />
          <Line dataKey="value" name={metricLabel} type="monotone" stroke="var(--color-value)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-value)' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ChartContainer>
      <p className="chart-note">{metricLabel}{unit ? ` · ${unit}` : ''}. Direction is shown only; no clinical interpretation is applied.</p>
    </div>
  )
}

export function Delta({ latest, previous }: { latest?: HealthReading; previous?: HealthReading }) {
  if (!latest || !previous || latest.numericValue === null || previous.numericValue === null) {
    return <span className="delta-muted">{latest ? 'Trend: one recorded point' : 'Trend: no readings'}</span>
  }
  const delta = latest.numericValue - previous.numericValue
  if (delta === 0) return <span className="delta-muted">Unchanged · numeric direction only</span>
  const Icon = delta > 0 ? ArrowUpRight : ArrowDownRight
  return <span className="delta-muted"><Icon aria-hidden="true" />{delta > 0 ? '+' : ''}{delta} {latest.unit} · direction only</span>
}

export function MissionDisclaimer() {
  return <footer className="medical-disclaimer"><ShieldCheck aria-hidden="true" /><p><strong>Educational demo only.</strong> ASTROCARE is not a medical device, does not diagnose or prescribe, and does not replace the flight surgeon or mission medical team. Follow the mission medical escalation protocol for urgent concerns.</p></footer>
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Activity aria-hidden="true" /></span><strong>{title}</strong><p>{body}</p>{action}</div>
}

export function TaskCheck({ done, onClick, title, hint }: { done: boolean; onClick: () => void; title: string; hint: string }) {
  return <button type="button" className={`routine-task ${done ? 'is-done' : ''}`} aria-pressed={done} onClick={onClick}>
    <span className="task-check">{done ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}</span>
    <span className="task-copy"><strong>{title}</strong><small>{hint}</small></span>
  </button>
}

export function AlertIcon({ critical = false }: { critical?: boolean }) {
  const Icon = critical ? AlertCircle : AlertTriangle
  return <Icon aria-hidden="true" />
}

export function RoutineBadge({ completed }: { completed: number }) {
  return completed >= 6
    ? <span className="honesty-badge"><BadgeCheck aria-hidden="true" /> Consistent reporter</span>
    : <span className="honesty-note"><Info aria-hidden="true" /> Honest check-ins count</span>
}

