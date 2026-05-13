import { memo, useMemo, useState } from 'react'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from '@tanstack/react-table'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { BiasBadge } from './BiasBadge'
import { GroupedTableHeader } from './GroupedTableHeader'
import { HeatmapCell } from './HeatmapCell'
import { scoreTone } from '../../lib/heatmap'
import { cn } from '../../lib/utils'
import type { IndicatorKey, MarketAsset } from '../../types/market'

type MarketHeatmapTableProps = {
  data: MarketAsset[]
  compact: boolean
}

type HeatColumn = {
  key: IndicatorKey
  label: string
  inverse?: boolean
}

const sentimentColumns: HeatColumn[] = [
  { key: 'cot', label: 'COT' },
  { key: 'retailPos', label: 'Retail Pos' },
]

const technicalColumns: HeatColumn[] = [
  { key: 'seasonality', label: 'Seasonality' },
  { key: 'trend', label: 'Trend' },
]

const economicColumns: HeatColumn[] = [
  { key: 'gdp', label: 'GDP' },
  { key: 'mPMI', label: 'mPMI' },
  { key: 'sPMI', label: 'sPMI' },
  { key: 'retailSales', label: 'Retail Sales' },
  { key: 'inflation', label: 'Inflation', inverse: true },
  { key: 'employmentChange', label: 'Employment Change' },
  { key: 'unemploymentRate', label: 'Unemployment Rate', inverse: true },
  { key: 'interestRate', label: 'Interest Rate', inverse: true },
]

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') return <ArrowUp className="h-3 w-3" aria-hidden="true" />
  if (sorted === 'desc') return <ArrowDown className="h-3 w-3" aria-hidden="true" />
  return <ChevronsUpDown className="h-3 w-3 opacity-45" aria-hidden="true" />
}

const MemoRow = memo(function MemoRow({
  row,
  compact,
}: {
  row: ReturnType<ReturnType<typeof useReactTable<MarketAsset>>['getRowModel']>['rows'][number]
  compact: boolean
}) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.16 }}
      className="group/row"
    >
      {row.getVisibleCells().map((cell, index) => (
        <td
          key={cell.id}
          className={cn(
            'border-b border-r border-white/[0.065] bg-[#111823]/88 text-center align-middle text-slate-300 transition group-hover/row:bg-[#172130]',
            compact ? 'h-8 px-1 text-[11px]' : 'h-9 px-2 text-xs',
            index === 0 && 'sticky left-0 z-10 p-0 text-left',
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </motion.tr>
  )
})

export function MarketHeatmapTable({ data, compact }: MarketHeatmapTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'score', desc: true }])

  const columns = useMemo<ColumnDef<MarketAsset>[]>(
    () => [
      {
        accessorKey: 'asset',
        header: 'Asset',
        cell: ({ row }) => (
          <div
            className={cn(
              'sticky left-0 z-10 flex items-center gap-2 border-r border-white/10 bg-[#111823] transition group-hover/row:bg-[#172130]',
              compact ? 'h-8 px-2' : 'h-9 px-3',
            )}
          >
            <div className="h-5 w-0.5 rounded-full bg-gradient-to-b from-cyan-300 via-teal-300 to-orange-300" />
            <div className="min-w-0">
              <p className={cn('truncate font-bold text-slate-100', compact ? 'text-[11px]' : 'text-xs')}>{row.original.asset}</p>
              {!compact && <p className="truncate text-[10px] text-slate-500">{row.original.assetClass} / {row.original.lastUpdated}</p>}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'bias',
        header: 'Bias',
        cell: ({ getValue }) => <BiasBadge bias={getValue<MarketAsset['bias']>()} compact={compact} />,
      },
      {
        accessorKey: 'score',
        header: 'Score',
        cell: ({ getValue }) => (
          <span className={cn('mx-auto flex items-center justify-center rounded border font-black tabular-nums', compact ? 'h-6 w-10 text-[11px]' : 'h-7 w-12 text-xs', scoreTone(getValue<number>()))}>
            {getValue<number>()}
          </span>
        ),
      },
      ...sentimentColumns.map<ColumnDef<MarketAsset>>((item) => ({
        accessorKey: item.key,
        header: item.label,
        cell: ({ getValue }) => <HeatmapCell value={getValue<number>()} label={item.label} inverse={item.inverse} compact={compact} />,
      })),
      ...technicalColumns.map<ColumnDef<MarketAsset>>((item) => ({
        accessorKey: item.key,
        header: item.label,
        cell: ({ getValue }) => <HeatmapCell value={getValue<number>()} label={item.label} inverse={item.inverse} compact={compact} />,
      })),
      ...economicColumns.map<ColumnDef<MarketAsset>>((item) => ({
        accessorKey: item.key,
        header: item.label,
        cell: ({ getValue }) => <HeatmapCell value={getValue<number>()} label={item.label} inverse={item.inverse} compact={compact} />,
      })),
    ],
    [compact],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  })

  if (!data.length) {
    return (
      <div className="grid min-h-72 place-items-center rounded-md border border-white/10 bg-[#101720]/86 p-8 text-center shadow-2xl shadow-black/20">
        <div>
          <p className="text-base font-semibold text-slate-100">No market intelligence rows found</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">Adjust the asset, market, bias, or search filters to restore the fictional dataset.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-[#101720]/86 shadow-2xl shadow-black/24">
      <div className={cn('max-h-[calc(100vh-7.25rem)]', compact ? 'overflow-y-auto overflow-x-hidden' : 'overflow-auto')}>
        <table className={cn('border-separate border-spacing-0 text-left', compact ? 'w-full table-fixed' : 'min-w-[1320px] table-fixed')}>
          <colgroup>
            <col className={compact ? 'w-[13.5%]' : 'w-[168px]'} />
            <col className={compact ? 'w-[9%]' : 'w-[116px]'} />
            <col className={compact ? 'w-[5%]' : 'w-[72px]'} />
            {Array.from({ length: 12 }).map((_, index) => (
              <col key={index} className={compact ? 'w-[6.04%]' : 'w-[80px]'} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <GroupedTableHeader title="Output" colSpan={3} tone="output" stickyLeft />
              <GroupedTableHeader title="Sentiment" colSpan={2} tone="sentiment" />
              <GroupedTableHeader title="Technical" colSpan={2} tone="technical" />
              <GroupedTableHeader title="Economic Data" colSpan={8} tone="economic" />
            </tr>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={cn(
                      'sticky top-[33px] z-20 border-b border-r border-white/10 bg-[#0d131d]/98 text-[10px] font-black uppercase tracking-[0.06em] text-slate-400 backdrop-blur-xl',
                      compact ? 'px-1 py-1.5' : 'px-2 py-2',
                      index === 0 && 'left-0 z-30',
                    )}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-1 rounded px-1 py-0.5 text-left outline-none transition hover:bg-white/[0.055] hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                    >
                      <span className="truncate">{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      <SortIcon sorted={header.column.getIsSorted()} />
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {table.getRowModel().rows.map((row) => (
                <MemoRow key={row.id} row={row} compact={compact} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
