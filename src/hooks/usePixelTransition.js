import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

const BLOCK_SIZE = 60

export function usePixelTransition() {
  const gridRef   = useRef(null)
  const blocksRef = useRef([])

  const buildGrid = useCallback(() => {
    const container = gridRef.current
    if (!container) return

    container.innerHTML = ''
    blocksRef.current = []

    const cols    = Math.ceil(window.innerWidth  / BLOCK_SIZE)
    const rows    = Math.ceil(window.innerHeight / BLOCK_SIZE) + 1
    const offsetX = (window.innerWidth  - cols * BLOCK_SIZE) / 2
    const offsetY = (window.innerHeight - rows * BLOCK_SIZE) / 2

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const block = document.createElement('div')
        block.style.cssText = `
          position: absolute;
          width:  ${BLOCK_SIZE}px;
          height: ${BLOCK_SIZE}px;
          left:   ${c * BLOCK_SIZE + offsetX}px;
          top:    ${r * BLOCK_SIZE + offsetY}px;
          background: #050510;
        `
        container.appendChild(block)
        blocksRef.current.push(block)
      }
    }

    gsap.set(blocksRef.current, { opacity: 0 })
  }, [])

  useEffect(() => {
    buildGrid()
    window.addEventListener('resize', buildGrid)
    return () => window.removeEventListener('resize', buildGrid)
  }, [buildGrid])

  const transition = useCallback((onMidpoint) => {
    const blocks = blocksRef.current

    gsap.to(blocks, {
      opacity:  1,
      duration: 0.05,
      ease:     'power2.inOut',
      stagger:  { amount: 0.5, from: 'random' },
      onComplete: () => {
        onMidpoint()
        gsap.to(blocks, {
          opacity:  0,
          duration: 0.05,
          delay:    0.15,
          ease:     'power2.inOut',
          stagger:  { amount: 0.5, from: 'random' },
        })
      },
    })
  }, [])

  return { gridRef, transition }
}