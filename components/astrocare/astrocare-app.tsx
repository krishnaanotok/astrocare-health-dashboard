'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Bell, BookOpen, ChevronDown, HeartPulse, History, Home, Info, Pill, ShieldCheck, Telescope } from 'lucide-react'
import { HEALTH_MODULES, ROUTINE_TASKS, type HealthReading, type InventoryItem, type ModuleId, type RangeConfig } from './data'
import { AlertsView } from './alerts-view'
import { DashboardView, type MissionAlert } from './dashboard-view'
import { HistoryView } from './history-view'
import { MedicineView, inventoryAlerts } from './medicine-view'
import { ModuleView } from './module-view'
import { ResearchView } from './research-view'
import { MissionDisclaimer, ModuleIcon } from './shared'

type PageView = 'dashboard' | 'modules' | 'history' | 'alerts' | 'medicines' | 'research'
const DEMO_INVENTORY: InventoryItem[] = [{
  id: 'simulated-supply', name: 'SIMULATED · Example supply item A', quantity: 2, unit: 'packs',
  expiry: '2026-12-20', lowStockAt: 3, expiryWindowDays: 45,
  storage: 'Example only · not a real medication or storage instruction', simulated: true,
}]

const navigation: { id: PageView; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'modules', label: 'Health modules', icon: HeartPulse },
  { id: 'history', label: 'Health history', icon: History },
  { id: 'alerts', label: 'Alerts & reminders', icon: Bell },
  { id: 'medicines', label: 'Medicine inventory', icon: Pill },
  { id: 'research', label: 'Research & references', icon: BookOpen },
]
const pageTitles: Record<PageView, string> = {
  dashboard: 'Overview', modules: 'Health modules', history: 'Health history',
  alerts: 'Alerts & reminders', medicines: 'Medicine inventory', research: 'Research & references',
}

export function AstrocareApp() {
  const [page, setPage] = useState<PageView>('dashboard')
  const [selectedModule, setSelectedModule] = useState<ModuleId>('cardiovascular')
  const [readings, setReadings] = useState<HealthReading[]>([])
  const [ranges, setRanges] = useState<Record<string, RangeConfig>>({})
  const [dueDates, setDueDates] = useState<Record<string, string>>({})
  const [inventory, setInventory] = useState<InventoryItem[]>(DEMO_INVENTORY)
  const [tasks, setTasks] = useState<Record<string, boolean>>(() => Object.fromEntries(ROUTINE_TASKS.map((task) => [task.id, false])))

  const alerts = useMemo<MissionAlert[]>(() => {
    const result: MissionAlert[] = readings.filter((reading) => reading.status === 'critical' || reading.status === 'attention').map((reading) => ({
      id: `reading-${reading.id}`,
      status: reading.status as 'critical' | 'attention',
      title: reading.status === 'critical' ? `${reading.moduleTitle}: potentially critical` : `${reading.moduleTitle}: review / reassessment`,
      detail: reading.concern === 'critical' ? 'Severe or sudden symptoms were self-reported. This is not automated triage.' : reading.concern === 'attention' ? 'A new or worsening concern was self-reported.' : `${reading.metricLabel}: ${reading.value}${reading.unit ? ` ${reading.unit}` : ''}; outside the configured range supplied for this session.`,
      moduleId: reading.moduleId,
      action: 'Follow the mission medical escalation protocol now and contact the flight surgeon through established mission channels.',
    }))
    const today = new Date().toISOString().slice(0, 10)
    for (const module of HEALTH_MODULES) {
      const due = dueDates[module.id]
      if (!due || due > today) continue
      const dueTime = new Date(`${due}T00:00:00Z`).getTime()
      const completedAfterDue = readings.some((reading) => reading.moduleId === module.id && reading.timestamp >= dueTime)
      if (!completedAfterDue) result.push({
        id: `due-${module.id}-${due}`, status: 'attention',
        title: due < today ? `${module.title}: scheduled assessment date passed` : `${module.title}: assessment due today`,
        detail: `Reminder based only on the date you entered (${due}); check your mission cadence.`,
        moduleId: module.id, action: 'Check your mission schedule and contact the medical team if you are unsure what to do next.',
      })
    }
    inventoryAlerts(inventory).forEach((alert) => result.push({
      id: alert.id, status: 'attention', title: alert.title, detail: alert.detail,
      moduleId: 'medicine', action: 'Compare with the mission-approved manifest and storage protocol; ask the medical team before acting.',
    }))
    return result.sort((a, b) => (a.status === 'critical' ? -1 : 1) - (b.status === 'critical' ? -1 : 1))
  }, [readings, dueDates, inventory])

  const openModule = (moduleId = selectedModule) => {
    setSelectedModule(moduleId)
    setPage('modules')
  }
  const toggleTask = (taskId: string) => setTasks((current) => ({ ...current, [taskId]: !current[taskId] }))
  return <div className="app-frame starfield">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <aside className="sidebar">
      <div className="brand-lockup"><span className="brand-mark"><Telescope aria-hidden="true" /></span><span><strong>ASTROCARE</strong><small>FLIGHT HEALTH COMPANION</small></span></div>
      <div className="mission-switcher"><span className="mission-status-dot" /><span><small>SIMULATED MISSION</small><strong>Long-duration demo</strong></span><ChevronDown aria-hidden="true" /></div>
      <nav className="primary-nav" aria-label="Primary navigation">{navigation.map((item) => {
        const Icon = item.icon
        return <button type="button" key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} aria-current={page === item.id ? 'page' : undefined} onClick={() => setPage(item.id)}><Icon aria-hidden="true" /><span>{item.label}</span>{item.id === 'alerts' && alerts.length > 0 && <b>{alerts.length}</b>}</button>
      })}</nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-profile"><div className="profile-avatar">RC</div><div><strong>Riley Chen</strong><small>Demo crew profile</small></div><span className="profile-simulated">SIMULATED</span></div>
      <div className="sidebar-disclaimer"><ShieldCheck aria-hidden="true" /><span>Educational support only.<br />Your flight surgeon leads care.</span></div>
    </aside>

    <div className="main-column">
      <div className="demo-ribbon" role="status"><span className="ribbon-dot" /><strong>SIMULATED DEMO</strong><span>In-memory session only · reload clears check-ins · no connected devices</span></div>
      <header className="topbar"><div><div className="breadcrumb">ASTROCARE <span>/</span> {pageTitles[page]}</div><p className="topbar-mission">Mission day <strong>143</strong><span>·</span> Lunar transit profile <span className="simulated-tag">SIMULATED</span></p></div><div className="topbar-actions"><span className="connection-label"><span className="connection-dot" /> Offline demo</span><button className="topbar-help" type="button" onClick={() => setPage('research')}><InfoIcon /> About data</button></div></header>
      <main id="main-content" className="main-content" tabIndex={-1}>
        {page === 'dashboard' && <DashboardView readings={readings} selectedModule={selectedModule} onSelectModule={setSelectedModule} onOpenModule={() => openModule()} onOpenView={setPage} tasks={tasks} onToggleTask={toggleTask} alerts={alerts} />}
        {page === 'modules' && <ModuleView key={selectedModule} moduleId={selectedModule} readings={readings} ranges={ranges} dueDate={dueDates[selectedModule]} onSelectModule={setSelectedModule} onSaveRange={(key, value) => setRanges((current) => ({ ...current, [key]: value }))} onAddReading={(reading) => setReadings((current) => [reading, ...current])} onSetDueDate={(value) => setDueDates((current) => ({ ...current, [selectedModule]: value }))} />}
        {page === 'history' && <HistoryView readings={readings} />}
        {page === 'alerts' && <AlertsView alerts={alerts} onOpenModule={openModule} />}
        {page === 'medicines' && <MedicineView items={inventory} onAddItem={(item) => setInventory((current) => [item, ...current])} onRemoveItem={(id) => setInventory((current) => current.filter((item) => item.id !== id))} />}
        {page === 'research' && <ResearchView />}
        <MissionDisclaimer />
      </main>
      <footer className="app-footer"><span>ASTROCARE · Personal spaceflight health companion concept</span><span>Not affiliated with or endorsed by NASA.</span></footer>
    </div>
  </div>
}

function InfoIcon() {
  return <Info aria-hidden="true" />
}
