import { useEffect, useRef } from 'react'

const COLORS = ['#FFD700','#00D4FF','#FF6B6B','#00FF88','#FF8C00','#7C4DFF','#FF69B4','#ADFF2F']

export default function Confetti({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const origins = [0.2, 0.5, 0.8]
    const particles = origins.flatMap(ox =>
      Array.from({ length: 55 }, () => ({
        x:       ox * canvas.width + (Math.random() - 0.5) * 80,
        y:       -10,
        vx:      (Math.random() - 0.5) * 7,
        vy:      -(4 + Math.random() * 5),
        gravity: 0.18 + Math.random() * 0.08,
        w:       5 + Math.random() * 8,
        h:       3 + Math.random() * 4,
        rot:     Math.random() * 360,
        rotV:    (Math.random() - 0.5) * 9,
        color:   COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha:   1,
        shape:   Math.random() > 0.35 ? 'rect' : 'circle',
      }))
    )

    let animId

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false

      particles.forEach(p => {
        p.vy  += p.gravity
        p.x   += p.vx
        p.y   += p.vy
        p.rot += p.rotV
        if (p.y > canvas.height + 20) return
        alive = true
        if (p.y > canvas.height * 0.7) p.alpha -= 0.018

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle   = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      if (alive) animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 200 }}
    />
  )
}