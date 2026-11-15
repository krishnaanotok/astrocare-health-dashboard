export type ModuleId =
  | 'cardiovascular'
  | 'respiratory'
  | 'musculoskeletal'
  | 'mental-cognitive'
  | 'vision-neurological'
  | 'nutrition-immune'
  | 'medicine'

export type HealthStatus = 'none' | 'unconfigured' | 'within' | 'attention' | 'critical'
export type ConcernLevel = '' | 'none' | 'attention' | 'critical'
export type MetricKind = 'number' | 'text' | 'choice'

export type MetricDefinition = {
  id: string
  label: string
  unit: string
  kind: MetricKind
  options?: string[]
  helper: string
}

export type RangeConfig = {
  normalLow: string
  normalHigh: string
  criticalLow: string
  criticalHigh: string
  source: string
}

export type HealthReading = {
  id: string
  moduleId: ModuleId
  moduleTitle: string
  metricId: string
  metricLabel: string
  value: string
  numericValue: number | null
  unit: string
  timestamp: number
  status: Exclude<HealthStatus, 'none'>
  concern: Exclude<ConcernLevel, ''>
  rangeSource?: string
  note?: string
}

export type HealthModule = {
  id: ModuleId
  title: string
  summary: string
  icon: string
  effects: string
  assessmentSteps: string[]
  meaning: string
  why: string
  hazards: string
  symptoms: string
  prevention: string
  contact: string
  sources: string[]
  metrics: MetricDefinition[]
}

export const NASA_SOURCES = [
  { id: 'hrp', title: 'Human Research Program', url: 'https://www.nasa.gov/hrp/' },
  { id: 'risks', title: 'Risks of Human Spaceflight', url: 'https://www.nasa.gov/hrp/risks/' },
  { id: 'standard', title: 'Spaceflight Standard Measures', url: 'https://www.nasa.gov/reference/standard-measures/' },
  { id: 'cipher', title: 'CIPHER Research', url: 'https://www.nasa.gov/about-cipher/' },
  { id: 'roadmap', title: 'Human Research Roadmap', url: 'https://humanresearchroadmap.nasa.gov/' },
] as const

export const HEALTH_MODULES: HealthModule[] = [
  {
    id: 'cardiovascular', title: 'Cardiovascular', summary: 'Heart rhythm, blood pressure and circulation observations.', icon: 'heart',
    effects: 'NASA describes cardiovascular adaptations as a spaceflight risk: weightlessness changes blood circulation and how the heart and blood vessels function.',
    assessmentSteps: ['Use only the mission-approved monitor and the positioning instructions you were given.', 'Record the displayed value and measurement conditions exactly; do not change your activity or medication based on this page.'],
    meaning: 'These readings describe selected heart and circulation signals at one moment; they are not a stand-alone health assessment.',
    why: 'Circulation and cardiovascular function can adapt in weightlessness, so consistent, protocol-led observations matter on long missions.',
    hazards: 'Microgravity changes fluid distribution and circulation. NASA studies cardiovascular adaptations; ASTROCARE does not estimate your personal risk.',
    symptoms: 'Notice and report new chest discomfort, faintness, unusual palpitations, shortness of breath or a marked change from your usual state.',
    prevention: 'Follow the mission medical team’s monitoring, exercise and countermeasure plan. Log measurements using the assigned device and protocol.',
    contact: 'For sudden or severe symptoms, follow the mission medical escalation protocol now. For new or recurring changes, contact the flight surgeon or medical team.',
    sources: ['risks', 'standard', 'cipher'],
    metrics: [
      { id: 'heart-rate', label: 'Heart rate', unit: 'bpm', kind: 'number', helper: 'Enter the device reading; only the mission team can set an appropriate reference range.' },
      { id: 'systolic', label: 'Systolic blood pressure', unit: 'mmHg', kind: 'number', helper: 'Record the value exactly as shown by the approved monitor.' },
      { id: 'diastolic', label: 'Diastolic blood pressure', unit: 'mmHg', kind: 'number', helper: 'Record the value exactly as shown by the approved monitor.' },
      { id: 'ecg', label: 'ECG observation', unit: '', kind: 'text', helper: 'Record the approved device result or a note for medical review.' },
      { id: 'circulation', label: 'Circulation / symptom note', unit: '', kind: 'text', helper: 'Describe what you noticed, when it started and what you were doing.' },
    ],
  },
  {
    id: 'respiratory', title: 'Respiratory', summary: 'Oxygen saturation, breathing rate and breathing observations.', icon: 'wind',
    effects: 'NASA identifies hypoxia as a spaceflight risk and notes that spacesuit work can involve low-oxygen and high-carbon-dioxide hazards.',
    assessmentSteps: ['Use the assigned sensor and follow its mission-specific placement and rest instructions.', 'Log the display and any breathing symptoms. Do not adjust spacecraft or suit life-support settings from this app.'],
    meaning: 'Oxygen saturation and breathing rate are observations, not a diagnosis and not a substitute for cabin or suit monitoring.',
    why: 'Oxygen availability and carbon-dioxide exposure are safety concerns in spaceflight; mission systems and procedures remain authoritative.',
    hazards: 'NASA discusses hypoxia and low-oxygen/high-CO₂ conditions in the spaceflight context. ASTROCARE cannot detect cabin or suit air quality.',
    symptoms: 'Report unusual breathlessness, dizziness, headache, confusion or a sudden change in breathing. These symptoms can have many causes.',
    prevention: 'Follow approved equipment, suit and cabin procedures. Never use this dashboard to modify life-support equipment or delay a report.',
    contact: 'For sudden breathing difficulty, confusion or severe symptoms, use the mission escalation protocol immediately. Otherwise contact the flight surgeon or medical team about new changes.',
    sources: ['risks', 'standard', 'cipher'],
    metrics: [
      { id: 'spo2', label: 'SpO₂', unit: '%', kind: 'number', helper: 'Use the approved sensor and protocol; no reference range is supplied by ASTROCARE.' },
      { id: 'resp-rate', label: 'Respiratory rate', unit: 'breaths/min', kind: 'number', helper: 'Count or use the approved device exactly as directed by the mission protocol.' },
      { id: 'breathing', label: 'Breathing check-in', unit: '', kind: 'choice', options: ['As usual', 'Different than usual', 'Difficult', 'Prefer not to say'], helper: 'Choose what best describes your experience; this selection is not interpreted as a diagnosis.' },
    ],
  },
  {
    id: 'musculoskeletal', title: 'Musculoskeletal', summary: 'Strength, bone-health assessments and exercise logs.', icon: 'bone',
    effects: 'NASA identifies reduced cardiorespiratory and musculoskeletal fitness and spaceflight-induced bone changes as risks; exercise is studied as a countermeasure.',
    assessmentSteps: ['Follow the assigned exercise, strength or bone-assessment protocol; do not add an unapproved test or workload.', 'Enter the instrument result or exercise details, including the protocol name when available.'],
    meaning: 'Strength, exercise and bone-assessment records help your team follow change over time; an entry alone cannot measure bone density.',
    why: 'Without normal gravity, muscle and bone loading changes. NASA studies fitness and bone changes during spaceflight.',
    hazards: 'Microgravity changes mechanical loading. The effect varies by person and mission; this app does not estimate bone loss or fracture risk.',
    symptoms: 'Record unusual weakness, pain, reduced function or difficulty completing a normally manageable task.',
    prevention: 'Use only the flight team’s exercise and countermeasure plan. Log work completed and report pain or a change in capability.',
    contact: 'Follow the mission escalation protocol for sudden injury or severe pain. Contact the flight surgeon for persistent pain, a new limitation or a concerning trend.',
    sources: ['risks', 'standard', 'cipher'],
    metrics: [
      { id: 'strength', label: 'Strength assessment', unit: 'protocol units', kind: 'number', helper: 'Use the unit and method from your assigned assessment; do not compare unlike tests.' },
      { id: 'bone', label: 'Bone-health assessment', unit: '', kind: 'text', helper: 'Log a mission-approved assessment result or its completion status.' },
      { id: 'exercise', label: 'Exercise log', unit: 'minutes', kind: 'number', helper: 'Log completed activity from the assigned plan; this is not a workout prescription.' },
      { id: 'muscle-note', label: 'Strength / movement note', unit: '', kind: 'text', helper: 'Describe a change in movement, discomfort or capability.' },
    ],
  },
  {
    id: 'mental-cognitive', title: 'Mental & Cognitive', summary: 'Mood, stress, sleep, fatigue and cognitive check-ins.', icon: 'brain',
    effects: 'NASA studies behavioral health, performance, isolation and sleep on long-duration missions. The check-ins here are proposed ASTROCARE features, not validated clinical tests.',
    assessmentSteps: ['Choose a private moment and answer based on how you feel now; there is no “right” answer.', 'Use the same personal tracking approach over time and add a note if you want the medical team to follow up.'],
    meaning: 'Mood, sleep and fatigue entries are self-reports. They are useful context, not a screening result or cognitive diagnosis.',
    why: 'Isolation, confinement, demanding schedules and distance from Earth can affect wellbeing, sleep and performance.',
    hazards: 'NASA research examines behavioral health and sleep. Individual responses differ, and an app score cannot evaluate your mental health.',
    symptoms: 'Notice sustained distress, disrupted sleep, difficulty concentrating, unusual withdrawal or a change that concerns you.',
    prevention: 'Protect scheduled rest, use crew and ground-support routines, and check in honestly. No badge or score rewards hiding symptoms.',
    contact: 'If you may harm yourself or someone else, or feel unsafe, contact the mission medical team immediately through the established protocol. For other persistent changes, contact the flight surgeon.',
    sources: ['risks', 'standard', 'cipher'],
    metrics: [
      { id: 'mood', label: 'Mood check-in', unit: '', kind: 'choice', options: ['Good', 'Okay', 'Low', 'Prefer not to say'], helper: 'A personal check-in, not a validated mental-health scale.' },
      { id: 'sleep', label: 'Sleep duration', unit: 'hours', kind: 'number', helper: 'Enter your observed sleep duration; no target is set here.' },
      { id: 'fatigue', label: 'Fatigue check-in', unit: '', kind: 'choice', options: ['Rested', 'Some fatigue', 'Very fatigued', 'Prefer not to say'], helper: 'A personal check-in, not a medical score.' },
      { id: 'cognition', label: 'Memory / cognitive note', unit: '', kind: 'text', helper: 'Use only an assigned mission test; record observations, not a self-diagnosis.' },
    ],
  },
  {
    id: 'vision-neurological', title: 'Vision & Neurological', summary: 'Vision changes, eye symptoms, balance and coordination.', icon: 'eye',
    effects: 'NASA studies Spaceflight-Associated Neuro-ocular Syndrome (SANS), vision changes and altered sensorimotor/vestibular function.',
    assessmentSteps: ['Complete only the assigned vision, eye or balance assessment, using the equipment and conditions in its protocol.', 'Record the result and any new symptoms; do not use this page to clear yourself for a mission task.'],
    meaning: 'Vision and balance observations help the medical team track change. They do not confirm or rule out SANS or another condition.',
    why: 'NASA identifies SANS and sensorimotor changes as human-spaceflight research risks.',
    hazards: 'Spaceflight can affect eye/brain structures and orientation systems; personal effects and causes vary.',
    symptoms: 'Report blurred or double vision, new eye discomfort, flashes, headache, dizziness or changes in balance/coordination.',
    prevention: 'Follow scheduled eye and sensorimotor protocols and use handholds or other mission safety procedures as instructed.',
    contact: 'Follow the mission escalation protocol for sudden vision loss, severe headache or major coordination change. Contact the flight surgeon about any new or persistent symptom.',
    sources: ['risks', 'standard', 'cipher'],
    metrics: [
      { id: 'vision', label: 'Vision assessment', unit: '', kind: 'text', helper: 'Record the approved chart/device result or note that the exam is complete.' },
      { id: 'eye-symptom', label: 'Eye symptom check-in', unit: '', kind: 'choice', options: ['None noticed', 'Change noticed', 'Prefer not to say'], helper: 'A self-report only; it does not screen for SANS.' },
      { id: 'balance', label: 'Balance / coordination note', unit: '', kind: 'text', helper: 'Record a change or an assigned sensorimotor test result.' },
    ],
  },
  {
    id: 'nutrition-immune', title: 'Nutrition & Immune', summary: 'Food, water, nutrition notes and scheduled biomarkers.', icon: 'leaf',
    effects: 'NASA studies inadequate food and nutrition and altered immune responses; Standard Measures includes nutrition, fluid, saliva and other research observations.',
    assessmentSteps: ['Use the crew food and fluid record or the assigned instrument; enter only what you observed.', 'Log blood, saliva or other biomarkers only when collected under an approved protocol.'],
    meaning: 'Intake logs and biomarkers provide context for the medical team; they do not identify a deficiency or infection by themselves.',
    why: 'A nutritious diet supports crew health and performance. Spaceflight stressors may also affect immune responses.',
    hazards: 'NASA studies nutrition and immune changes. ASTROCARE does not estimate nutrient needs, diagnose infection or interpret a lab result.',
    symptoms: 'Report persistent inability to eat or drink, repeated vomiting, unusual rash or other new symptoms through mission channels.',
    prevention: 'Follow the approved menu, hydration and sample-collection plan. Do not start supplements or alter intake targets based on this app.',
    contact: 'Use the mission escalation protocol for severe or sudden symptoms. Contact the flight surgeon about persistent intake concerns, symptoms or biomarker results.',
    sources: ['risks', 'standard', 'cipher'],
    metrics: [
      { id: 'water', label: 'Water intake', unit: 'mL', kind: 'number', helper: 'Log from your mission record; ASTROCARE does not set a hydration target.' },
      { id: 'food', label: 'Food / meal record', unit: '', kind: 'text', helper: 'Summarize items from the approved food log.' },
      { id: 'nutrition', label: 'Nutrition observation', unit: '', kind: 'text', helper: 'Record a nutrition note or question for the medical team.' },
      { id: 'biomarker', label: 'Biomarker / immune result', unit: '', kind: 'text', helper: 'Enter only a protocol-approved result with its source; this app does not interpret labs.' },
    ],
  },
  {
    id: 'medicine', title: 'Medicine Management', summary: 'Inventory, expiry, storage notes and usage records.', icon: 'pill',
    effects: 'ASTROCARE proposes an inventory log and configurable stock/expiry reminders. NASA references listed here do not supply a medication manifest, dose or treatment rule.',
    assessmentSteps: ['Compare the physical kit with the mission-approved manifest and storage instructions.', 'Record the item, quantity, expiry and usage exactly; resolve discrepancies with the medical team.'],
    meaning: 'An inventory reminder flags a record to review; it is not an instruction to take, stop or change a medication.',
    why: 'Long missions require an accurate, mission-approved supply and storage record. The dashboard cannot verify the contents of a kit.',
    hazards: 'Storage, expiry and use instructions depend on the specific item and mission protocol; no generic rule is substituted here.',
    symptoms: 'Report a suspected adverse effect, missing/damaged item, storage excursion or uncertainty about use to the medical team.',
    prevention: 'Reconcile against the approved manifest and storage requirements. Never use this app to choose a medicine or change a dose.',
    contact: 'For a dosing error, adverse reaction or urgent concern, follow the mission medical escalation protocol. Contact the flight surgeon before acting on an inventory discrepancy.',
    sources: ['hrp', 'standard'],
    metrics: [
      { id: 'usage', label: 'Usage record', unit: '', kind: 'text', helper: 'Record an action already taken under the mission prescription and protocol; never use this to choose treatment.' },
      { id: 'storage', label: 'Storage / reconciliation note', unit: '', kind: 'text', helper: 'Record a manifest check, storage concern or discrepancy for medical review.' },
    ],
  },
]

export const ROUTINE_TASKS = [
  { id: 'vitals', title: 'Record today’s vitals', hint: 'Use assigned instruments and ranges' },
  { id: 'assessment', title: 'Complete a scheduled assessment', hint: 'Follow your mission cadence' },
  { id: 'exercise', title: 'Log planned exercise', hint: 'Mission-prescribed activity only' },
  { id: 'sleep', title: 'Track sleep & fatigue', hint: 'A short self-check is enough' },
  { id: 'nutrition', title: 'Review food & water', hint: 'Record from the crew log' },
  { id: 'wellbeing', title: 'Check in with yourself', hint: 'Honest reporting matters' },
] as const

export type InventoryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  expiry: string
  lowStockAt: number
  expiryWindowDays: number
  storage: string
  simulated: boolean
}

export function statusForReading(
  value: string,
  kind: MetricKind,
  range: RangeConfig | undefined,
  concern: Exclude<ConcernLevel, ''>,
): Exclude<HealthStatus, 'none'> {
  if (concern === 'critical') return 'critical'
  if (concern === 'attention') return 'attention'
  if (kind !== 'number' || !range?.source.trim() || range.normalLow === '' || range.normalHigh === '') return 'unconfigured'
  const number = Number(value)
  const low = Number(range.normalLow)
  const high = Number(range.normalHigh)
  if (!Number.isFinite(number) || !Number.isFinite(low) || !Number.isFinite(high)) return 'unconfigured'
  if (range.criticalLow !== '' && number <= Number(range.criticalLow)) return 'critical'
  if (range.criticalHigh !== '' && number >= Number(range.criticalHigh)) return 'critical'
  return number >= low && number <= high ? 'within' : 'attention'
}

export function statusText(status: HealthStatus): string {
  return {
    none: 'No measurement yet',
    unconfigured: 'Range not configured',
    within: 'Within configured range',
    attention: 'Needs attention / reassessment',
    critical: 'Potentially critical',
  }[status]
}
