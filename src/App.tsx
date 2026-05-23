import { useSpinnerStore } from './store/useSpinnerStore'
import { ListEditor } from './components/ListEditor'
import { ListHub } from './components/ListHub'

function App() {
  const activeListId = useSpinnerStore((s) => s.activeListId)

  return (
    <div className="min-h-screen">
      {activeListId ? <ListEditor /> : <ListHub />}
    </div>
  )
}

export default App
