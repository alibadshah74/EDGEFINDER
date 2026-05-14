from datetime import UTC, datetime, timedelta
from math import cos, sin

from app.schemas.indices import (
    EconomicMetricOut,
    IndicesDashboardOut,
    InterestRateOut,
    MarketBiasOut,
    MonthlySeasonalityOut,
    PositioningOut,
    PutCallPointOut,
    ScoreBreakdownOut,
    SeasonalityOut,
    SentimentBucketOut,
    StockIndexOut,
)

INDEX_ASSETS = [
    StockIndexOut(id="SPX-CORE", symbol="SPX500", name="US Large Cap Synthetic", region="United States", currency="USD"),
    StockIndexOut(id="NDX-GROWTH", symbol="NAS100", name="US Growth Composite", region="United States", currency="USD"),
    StockIndexOut(id="DAX-EUR", symbol="GER40", name="Europe Industrial Index", region="Euro Area", currency="EUR"),
    StockIndexOut(id="NIK-APAC", symbol="JPN225", name="Japan Equity Complex", region="Japan", currency="JPY"),
    StockIndexOut(id="FTSE-UK", symbol="UK100", name="UK Blue Chip Basket", region="United Kingdom", currency="GBP"),
]


def _seed(value: str) -> int:
    return sum(ord(char) for char in value)


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _level(score: int) -> str:
    if score >= 78:
        return "Very Bullish"
    if score >= 58:
        return "Bullish"
    if score >= 43:
        return "Neutral"
    if score >= 24:
        return "Bearish"
    return "Very Bearish"


async def list_index_assets() -> list[StockIndexOut]:
    return INDEX_ASSETS


async def build_indices_dashboard(symbol: str) -> IndicesDashboardOut:
    asset = next((item for item in INDEX_ASSETS if item.id == symbol), INDEX_ASSETS[0])
    seed = _seed(asset.id)
    score = int(_clamp(round(54 + sin(seed * 0.12) * 23 + (seed % 9)), 8, 94))
    generated_at = datetime(2026, 5, 14, tzinfo=UTC)
    inst_long = _clamp(52 + sin(seed) * 14 + (seed % 6), 28, 78)
    retail_long = _clamp(44 - cos(seed) * 18 + (seed % 8), 18, 82)

    put_call = []
    for index in range(42):
        date = generated_at - timedelta(days=41 - index)
        ratio = _clamp(0.92 + sin(index / 3.2 + seed * 0.11) * 0.08 + cos(index / 7.4 + seed * 0.03) * 0.05 + sin(index / 5.5) * 0.13 + (seed % 5) * 0.018, 0.58, 1.42)
        trend = _clamp(0.94 + sin(index / 8 + seed * 0.01) * 0.09 + (seed % 3) * 0.025, 0.62, 1.34)
        put_call.append(PutCallPointOut(date=date, ratio=round(ratio, 2), trend=round(trend, 2)))

    score_rows = [
        ("Institutional Positioning", 2.4, 0.3),
        ("Retail Sentiment", -1.2, -0.4),
        ("Seasonality", 1.8, 0.6),
        ("Trend Reading", 2.1, 0.2),
        ("GDP", 0.9, 0.1),
        ("Manufacturing PMI", -0.8, -0.3),
        ("Services PMI", 1.2, 0.4),
        ("Retail Sales", -0.4, -0.2),
        ("Inflation", -1.6, 0.1),
        ("Employment Change", 0.7, -0.1),
        ("Unemployment Rate", 0.5, 0.2),
        ("Interest Rates", -0.9, -0.2),
    ]

    monthly = [
        MonthlySeasonalityOut(month=month, performance=round(sin(index * 0.9 + seed * 0.04) * 1.4 + cos(index * 0.35) * 0.65, 2))
        for index, month in enumerate(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    ]
    may_performance = monthly[4].performance

    return IndicesDashboardOut(
        asset=asset,
        generatedAt=generated_at,
        marketBias=MarketBiasOut(level=_level(score), score=score, confidence=int(_clamp(64 + (seed % 23), 58, 91))),
        positioning=PositioningOut(
            institutionalLong=round(inst_long, 1),
            institutionalShort=round(100 - inst_long, 1),
            retailLong=round(retail_long, 1),
            retailShort=round(100 - retail_long, 1),
            weeklyLongChange=round(sin(seed) * 1.8, 1),
            weeklyShortChange=round(cos(seed) * 1.6, 1),
        ),
        putCallRatio=put_call,
        scoreBreakdown=[ScoreBreakdownOut(indicator=name, score=round(base + sin(seed * 0.05 + index) * 0.7, 1), delta=round(delta + cos(seed * 0.08 + index) * 0.25, 1)) for index, (name, base, delta) in enumerate(score_rows)],
        economicMetrics=[
            EconomicMetricOut(metric="GDP Growth", actual="2.3%", forecast="2.1%", change=0.2, unit="%"),
            EconomicMetricOut(metric="Manufacturing PMI", actual="49.8", forecast="50.4", change=-0.6, unit="pts"),
            EconomicMetricOut(metric="Services PMI", actual="53.7", forecast="52.8", change=0.9, unit="pts"),
            EconomicMetricOut(metric="Retail Sales", actual="0.3%", forecast="0.5%", change=-0.2, unit="%"),
            EconomicMetricOut(metric="CPI", actual="2.9%", forecast="3.0%", change=-0.1, unit="%"),
            EconomicMetricOut(metric="Core CPI", actual="0.2%", forecast="0.3%", change=-0.1, unit="%"),
            EconomicMetricOut(metric="Employment Data", actual="178k", forecast="165k", change=13, unit="k"),
            EconomicMetricOut(metric="Unemployment Rate", actual="4.0%", forecast="4.1%", change=-0.1, unit="%"),
        ],
        sentiment=[
            SentimentBucketOut(cohort="Asset Managers", bullish=47, neutral=31, bearish=22),
            SentimentBucketOut(cohort="Volatility Desks", bullish=36, neutral=29, bearish=35),
            SentimentBucketOut(cohort="Systematic Funds", bullish=58, neutral=24, bearish=18),
            SentimentBucketOut(cohort="Retail Flow", bullish=28, neutral=21, bearish=51),
        ],
        seasonality=SeasonalityOut(month="May", averagePerformance=may_performance, hitRate=62 + (seed % 12), multiYearWindow="10 year synthetic window", tone="Positive" if may_performance > 0.35 else "Negative" if may_performance < -0.35 else "Neutral", monthly=monthly),
        interestRates=InterestRateOut(currentYield=round(3.82 + (seed % 9) * 0.04, 2), movingAverage=round(3.91 + (seed % 7) * 0.035, 2), difference=round(-0.09 + (seed % 5) * 0.018, 2), curveTone="Restrictive but easing" if seed % 2 else "Tight carry regime"),
    )
