import React, { useRef, useState } from 'react'

export function LineChartSVG({ series, color = '#4f772d' }: { series: { x: string, y: number }[], color?: string }){
  const width = 800
  const height = 220
  const padding = 32
  const maxY = Math.max(...series.map(s => s.y), 1)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [tooltip, setTooltip] = useState<{visible:boolean, x:number, y:number, label:string, value:number}>({visible:false,x:0,y:0,label:'',value:0})

  const coords = series.map((s, i) => {
    const x = padding + (i / Math.max(series.length - 1, 1)) * (width - padding * 2)
    const y = height - padding - (s.y / maxY) * (height - padding * 2)
    return { x, y }
  })

  const points = coords.map(c => `${c.x},${c.y}`).join(' ')

  function handleMove(e: React.MouseEvent) {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    let nearest = 0
    let bestDist = Infinity
    coords.forEach((c,i)=>{
      const d = Math.abs(c.x - mx)
      if(d < bestDist){ bestDist = d; nearest = i }
    })
    const c = coords[nearest]
    setTooltip({ visible: true, x: c.x + rect.left, y: c.y + rect.top, label: series[nearest].x, value: series[nearest].y })
  }
  function handleLeave(){ setTooltip(t => ({...t, visible:false})) }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-56" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <polyline fill="none" stroke={color} strokeWidth={3} points={points} strokeLinejoin="round" strokeLinecap="round" />
        {coords.map((c,i) => (
          <circle key={i} cx={c.x} cy={c.y} r={5} fill={color} opacity={0.9} />
        ))}
      </svg>
      {tooltip.visible && (
        <div style={{left: tooltip.x + 12, top: tooltip.y - 28}} className="pointer-events-none absolute bg-white border shadow-md rounded px-2 py-1 text-sm">
          <div className="font-semibold">{tooltip.value}</div>
          <div className="text-xs text-gray-500">{tooltip.label}</div>
        </div>
      )}
    </div>
  )
}

export function BarChartSVG({ data, color = '#4f772d' }: { data: { label: string, value: number }[], color?: string }){
  const width = 800
  const height = 260
  const padding = 40
  const maxV = Math.max(...data.map(d => d.value), 1)
  const barWidth = (width - padding * 2) / Math.max(data.length,1)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = useState<{visible:boolean, x:number, y:number, label:string, value:number}>({visible:false,x:0,y:0,label:'',value:0})

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-lg shadow-md mt-6 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
        {data.map((d, i) => {
          const x = padding + i * barWidth + barWidth * 0.15
          const barW = barWidth * 0.7
          const h = (d.value / maxV) * (height - padding * 2)
          const y = height - padding - h
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill={color} rx={4}
                onMouseEnter={()=>{
                  const rect = containerRef.current?.getBoundingClientRect()
                  setTooltip({ visible:true, x: (rect?.left ?? 0) + x + barW/2, y: (rect?.top ?? 0) + y, label:d.label, value:d.value })
                }}
                onMouseLeave={()=>setTooltip(t=>({...t,visible:false}))}
              />
              <text x={x + barW / 2} y={height - padding + 14} fontSize={12} textAnchor="middle" fill="#374151">{d.label}</text>
            </g>
          )
        })}
      </svg>
      {tooltip.visible && (
        <div style={{left: tooltip.x + 8, top: tooltip.y - 36}} className="pointer-events-none absolute bg-white border shadow-md rounded px-2 py-1 text-sm">
          <div className="font-semibold">{tooltip.value}</div>
          <div className="text-xs text-gray-500">{tooltip.label}</div>
        </div>
      )}
    </div>
  )
}
