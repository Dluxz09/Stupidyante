import { Mail, Image, FileText, ShieldCheck, Timer, ScanLine, BrainCircuit } from 'lucide-react'

const Placeholder = ({ name }) => (
  <div className="p-6 font-serif text-xl">{name} coming soon…</div>
)

export const APPS = [
  { id: 'cor',     title: 'COR Scanner',      icon: ScanLine,     component: () => <Placeholder name="COR Scanner" /> },
  { id: 'notes',   title: 'Sanctuary Notes',  icon: FileText,     component: () => <Placeholder name="Notes" /> },
  { id: 'quiz',    title: 'BrainForge',       icon: BrainCircuit, component: () => <Placeholder name="BrainForge" /> },
  { id: 'vault',   title: 'EnvVault',         icon: ShieldCheck,  component: () => <Placeholder name="EnvVault" /> },
  { id: 'focus',   title: 'Focus Hub',        icon: Timer,        component: () => <Placeholder name="Focus Hub" /> },
]