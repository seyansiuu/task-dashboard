import { memo } from 'react'

function AmbientBackground({ lowPower = false }) {
  return (
    <div className={`ambient-stage ${lowPower ? 'ambient-low-power' : ''}`}>
      <div className="orb orb-one"></div>
      {!lowPower ? <div className="orb orb-two"></div> : null}
      <div className="cyber-grid"></div>
      <div className="noise-layer"></div>
    </div>
  )
}

export default memo(AmbientBackground)
