import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity } from 'lucide-react'
import { PanelShell } from '../PanelShell'
import type { PutCallPoint } from '../../../types/market'

type PutCallRatioChartProps = {
  data: PutCallPoint[]
}

export function PutCallRatioChart({ data }: PutCallRatioChartProps) {
  return (
    <PanelShell title="Put-Call Ratio" eyebrow="Options pressure" action={<Activity className="h-4 w-4 text-slate-500" />} className="min-h-[320px]">
      <div className="h-[258px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis domain={[0.55, 1.45]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ stroke: 'rgba(125,211,252,0.24)' }}
              contentStyle={{ background: '#0b111a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, color: '#e2e8f0' }}
              labelFormatter={(value) => new Date(String(value)).toLocaleDateString()}
            />
            <ReferenceLine y={1.2} stroke="#c96d5a" strokeDasharray="4 4" ifOverflow="extendDomain" />
            <ReferenceLine y={0.8} stroke="#48bccb" strokeDasharray="4 4" ifOverflow="extendDomain" />
            <Line type="monotone" dataKey="trend" stroke="#8591a6" strokeWidth={1.4} dot={false} strokeDasharray="5 5" isAnimationActive />
            <Line type="monotone" dataKey="ratio" stroke="#d6e2f0" strokeWidth={2.4} dot={false} activeDot={{ r: 4, fill: '#67e8f9', stroke: '#0b111a', strokeWidth: 2 }} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </PanelShell>
  )
}
