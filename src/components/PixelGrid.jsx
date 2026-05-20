import { forwardRef } from 'react'

const PixelGrid = forwardRef((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9999,
        pointerEvents: 'none',
      }}
    />
  )
})

PixelGrid.displayName = 'PixelGrid'

export default PixelGrid