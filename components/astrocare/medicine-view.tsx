'use client'

import { useState, type FormEvent } from 'react'
import { AlertTriangle, CalendarDays, PackageCheck, Plus, ShieldCheck } from 'lucide-react'
import type { InventoryItem } from './data'
import { EmptyState } from './shared'

export function inventoryAlerts(items: InventoryItem[], now = Date.now()) {
  return items.flatMap((item) => {
    const alerts: { id: string; title: string; detail: string }[] = []
    if (item.quantity <= item.lowStockAt) alerts.push({ id: `${item.id}-stock`, title: 'Low-stock review', detail: `${item.name}: ${item.quantity} ${item.unit} on record; review against the mission manifest (configured reminder: ${item.lowStockAt}).` })
    const days = Math.ceil((new Date(`${item.expiry}T23:59:59Z`).getTime() - now) / 86400000)
    if (Number.isFinite(days) && days <= item.expiryWindowDays) alerts.push({ id: `${item.id}-expiry`, title: days < 0 ? 'Expiry date passed — review now' : 'Expiry review due', detail: `${item.name}: recorded expiry ${item.expiry}${days >= 0 ? ` · ${days} days remaining` : ''}. Follow mission storage and disposition procedures.` })
    return alerts
  })
}

export function MedicineView({ items, onAddItem, onRemoveItem }: { items: InventoryItem[]; onAddItem: (item: InventoryItem) => void; onRemoveItem: (id: string) => void }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('units')
  const [expiry, setExpiry] = useState('')
  const [lowStockAt, setLowStockAt] = useState('')
  const [expiryWindowDays, setExpiryWindowDays] = useState('')
  const [storage, setStorage] = useState('')
  const [message, setMessage] = useState('')
  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const count = Number(quantity)
    const stockLimit = Number(lowStockAt)
    const expiryWindow = Number(expiryWindowDays)
    if (!name.trim() || !expiry || !Number.isInteger(count) || count < 0 || !Number.isInteger(stockLimit) || stockLimit < 0 || !Number.isInteger(expiryWindow) || expiryWindow < 0) {
      setMessage('Enter a name, expiry date and valid non-negative whole-number inventory reminders.')
      return
    }
    onAddItem({ id: crypto.randomUUID(), name: name.trim(), quantity: count, unit, expiry, lowStockAt: stockLimit, expiryWindowDays: expiryWindow, storage: storage.trim() || 'Not recorded', simulated: false })
    setName(''); setQuantity(''); setExpiry(''); setLowStockAt(''); setExpiryWindowDays(''); setStorage('')
    setMessage('Inventory item added to this session only.')
  }
  const alerts = inventoryAlerts(items)

  return <div className="view-stack">
    <section className="welcome-row"><div><div className="eyebrow">SUPPLY TRACKING · NO PRESCRIBING</div><h1>Medicine management</h1><p className="welcome-copy">Track an approved manifest, storage notes and usage records. This tool never recommends a medicine or dose.</p></div><span className="count-pill">{items.length} inventory {items.length === 1 ? 'item' : 'items'}</span></section>
    <div className="inventory-grid">
      <section className="panel inventory-panel"><div className="panel-topline"><div><div className="eyebrow">MISSION KIT</div><h2>Inventory & reminders</h2></div><PackageCheck aria-hidden="true" className="muted-icon" /></div>
        <div className="inventory-safety"><ShieldCheck aria-hidden="true" /><p>Reminder thresholds are operational settings, not medical guidance. Compare every item with the mission-approved manifest, storage instructions and flight surgeon’s protocol.</p></div>
        {items.length ? <div className="inventory-list">{items.map((item) => {
          const itemAlerts = inventoryAlerts([item])
          return <article className="inventory-item" key={item.id}><div className="inventory-item-top"><div><h3>{item.name}</h3><div className="inventory-meta">{item.simulated && <span className="simulated-tag">SIMULATED</span>}<span>Recorded stock · {item.quantity} {item.unit}</span></div></div><span className="inventory-icon"><PackageCheck aria-hidden="true" /></span></div>
            <div className="inventory-facts"><div><small>EXPIRY RECORDED</small><strong>{item.expiry}</strong></div><div><small>STORAGE NOTE</small><strong>{item.storage || 'Not recorded'}</strong></div><div><small>LOW-STOCK REMINDER</small><strong>At or below {item.lowStockAt} {item.unit}</strong></div><div><small>EXPIRY REMINDER</small><strong>{item.expiryWindowDays} days before date</strong></div></div>
            {itemAlerts.length > 0 && <div className="inventory-alerts">{itemAlerts.map((alert) => <div className="inventory-warning" key={alert.id}><AlertTriangle aria-hidden="true" /><span><strong>{alert.title}</strong>{alert.detail}</span></div>)}</div>}
            <button className="quiet-button remove-item" type="button" onClick={() => onRemoveItem(item.id)}>Remove from session</button>
          </article>
        })}</div> : <EmptyState title="Inventory is empty" body="Add items exactly as shown on the mission-approved manifest. No medication data is supplied by this demo." />}
        <div className="inventory-count"><CalendarDays aria-hidden="true" /><span>{alerts.length ? `${alerts.length} inventory reminder${alerts.length === 1 ? '' : 's'} to review.` : 'No inventory reminder is currently triggered.'} Review the physical kit and protocol before acting.</span></div>
      </section>
      <section className="panel inventory-form-panel"><div className="eyebrow">SESSION-ONLY RECORD</div><h2>Add inventory item</h2><p>Use the exact item name and storage rules from your approved manifest. No dose or treatment suggestions are provided.</p>
        <form className="assessment-form" onSubmit={addItem}>
          <label className="field-label">Manifest item name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Exact mission inventory label" /></label>
          <div className="field-row"><label className="field-label">Quantity<input required type="number" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label className="field-label">Count unit<input required value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="packs, units…" /></label></div>
          <label className="field-label">Recorded expiry date<input required type="date" value={expiry} onChange={(event) => setExpiry(event.target.value)} /></label>
          <div className="field-row"><label className="field-label">Low-stock reminder at<input required type="number" min="0" step="1" value={lowStockAt} onChange={(event) => setLowStockAt(event.target.value)} placeholder="Set from manifest" /></label><label className="field-label">Expiry reminder window (days)<input required type="number" min="0" step="1" value={expiryWindowDays} onChange={(event) => setExpiryWindowDays(event.target.value)} placeholder="Set from protocol" /></label></div>
          <label className="field-label">Storage requirements or note<textarea value={storage} onChange={(event) => setStorage(event.target.value)} rows={2} placeholder="Use the approved storage guidance" /></label>
          <button className="primary-button submit-button" type="submit"><Plus aria-hidden="true" /> Add to this session</button>
          {message && <p className="save-message" role="status">{message}</p>}
        </form>
        <div className="inventory-footnote"><AlertTriangle aria-hidden="true" /><span>Expiry and stock reminders are yellow review notices, not automatic instructions to use, stop or replace an item. Contact mission medical staff for decisions.</span></div>
      </section>
    </div>
  </div>
}
