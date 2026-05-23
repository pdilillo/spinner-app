import { useSpinnerStore } from '../store/useSpinnerStore'

export function SoundToggle() {
  const soundEnabled = useSpinnerStore((s) => s.settings.soundEnabled)
  const toggleSound = useSpinnerStore((s) => s.toggleSound)

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
      aria-label={soundEnabled ? 'Mute celebration sound' : 'Enable celebration sound'}
      aria-pressed={soundEnabled}
    >
      {soundEnabled ? '🔊 Sound on' : '🔇 Muted'}
    </button>
  )
}
