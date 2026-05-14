# Gold & Silver Module

Institutional precious-metals dashboard components are intentionally scoped to `client/src/components/metals`.

- `MetalsDashboard.tsx`: page composition, data query, and responsive dashboard grid.
- `AnalyticsCard.tsx`: reusable compact panel frame with header hierarchy.
- `SentimentGauge.tsx`: SVG market-bias gauge with animated confidence readout.
- `PositioningBar.tsx`: animated long/short allocation visualization.
- `HeatmapTable.tsx`: score matrix with threshold-based factor coloring.
- `MacroComparisonTable.tsx`: actual, forecast, previous, and change comparison table.
- `SeasonalWidget.tsx`: current month summary with compact seasonal bar chart.
- `YieldPanel.tsx`: fixed-income relationship table and yield trend chart.

Data is consumed through `services/metals.ts`, which falls back to generated synthetic data when the FastAPI endpoints are unavailable. The backend contract lives in `server/app/api/metals.py`, `server/app/schemas/metals.py`, and `server/app/services/metals_service.py`.
