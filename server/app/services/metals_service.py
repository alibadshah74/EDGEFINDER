from datetime import UTC, datetime, timedelta
from math import cos, sin

from app.schemas.metals import (
    EconomicMetricOut,
    MarketBiasOut,
    MetalsDashboardOut,
    MonthlySeasonalityOut,
    PositioningOut,
    PreciousMetalOut,
    RetailSentimentOut,
    ScoreBreakdownOut,
    SeasonalPerformanceOut,
    SeasonalityOut,
    SentimentBucketOut,
    YieldAnalyticsOut,
    YieldMetricOut,
    YieldTrendOut,
)

METAL_ASSETS = [
    PreciousMetalOut(id="XAU-USD", symbol="GOLD", name="Gold Macro Composite", unit="troy oz", quoteCurrency="USD"),
    PreciousMetalOut(id="XAG-USD", symbol="SILVER", name="Silver Macro Composite", unit="troy oz", quoteCurrency="USD"),
    PreciousMetalOut(id="XAU-XAG", symbol="GSR", name="Gold Silver Ratio", unit="ratio", quoteCurrency="USD"),
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


async def list_metal_assets() -> list[PreciousMetalOut]:
    return METAL_ASSETS


async def build_metals_dashboard(symbol: str) -> MetalsDashboardOut:
    asset = next((item for item in METAL_ASSETS if item.id == symbol), METAL_ASSETS[0])
    seed = _seed(asset.id)
    generated_at = datetime(2026, 5, 14, tzinfo=UTC)
    score = int(_clamp(round(61 + sin(seed * 0.09) * 21 - (8 if asset.id == "XAG-USD" else 0)), 14, 93))
    inst_long = _clamp(57 + sin(seed * 0.7) * 16, 31, 82)
    retail_long = _clamp(38 + cos(seed * 0.41) * 20, 14, 86)
    bullish_share = int(_clamp(round(50 + sin(seed * 0.22) * 18), 24, 78))

    score_rows = [
        ("Overall Score", score / 18 - 2.2, 0.3),
        ("Positioning", 1.9, 0.4),
        ("Retail Sentiment", -1.1, -0.2),
        ("Seasonality", 1.2, 0.5),
        ("Trend Structure", 1.8, 0.2),
        ("GDP", -0.4, -0.1),
        ("Manufacturing PMI", 1.3 if asset.id == "XAG-USD" else 0.3, 0.2),
        ("Services PMI", 0.8, 0.1),
        ("Retail Sales", -0.6, -0.3),
        ("Inflation", 1.6, 0.4),
        ("Employment", 0.4, -0.2),
        ("Interest Rates", -1.5, -0.4),
    ]

    curve = [
        SeasonalPerformanceOut(month=month, performance=round(sin(index * 0.74 + seed * 0.03) * 1.15 + cos(index * 0.31) * 0.45, 2), probability=int(_clamp(round(51 + sin(index + seed * 0.05) * 19), 38, 77)))
        for index, month in enumerate(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    ]
    may_performance = curve[4].performance

    trend = []
    for index in range(32):
        trend.append(
            YieldTrendOut(
                date=generated_at - timedelta(days=31 - index),
                yield_=round(4.28 + sin(index / 4 + seed * 0.02) * 0.16 + index * 0.002, 2),
                realYield=round(1.84 + cos(index / 5 + seed * 0.03) * 0.12 - index * 0.001, 2),
            )
        )

    return MetalsDashboardOut(
        asset=asset,
        generatedAt=generated_at,
        marketBias=MarketBiasOut(level=_level(score), score=score, confidence=int(_clamp(66 + (seed % 21), 58, 92)), bullishShare=bullish_share, bearishShare=100 - bullish_share),
        positioning=PositioningOut(
            institutionalLong=round(inst_long, 1),
            institutionalShort=round(100 - inst_long, 1),
            retailLong=round(retail_long, 1),
            retailShort=round(100 - retail_long, 1),
            weeklyLongChange=round(sin(seed) * 2.1, 1),
            weeklyShortChange=round(cos(seed) * 1.9, 1),
            netPositioning=round(inst_long - (100 - inst_long), 1),
            imbalanceScore=round((inst_long - retail_long) / 10, 1),
        ),
        scoreBreakdown=[ScoreBreakdownOut(indicator=name, score=round(base + sin(seed * 0.06 + index) * 0.55, 1), delta=round(delta + cos(seed * 0.05 + index) * 0.22, 1)) for index, (name, base, delta) in enumerate(score_rows)],
        economicMetrics=[
            EconomicMetricOut(metric="GDP Growth", actual="2.2%", forecast="2.1%", previous="2.4%", change=0.1, unit="%"),
            EconomicMetricOut(metric="Manufacturing PMI", actual="50.9", forecast="50.3", previous="49.8", change=0.6, unit="pts"),
            EconomicMetricOut(metric="Services PMI", actual="53.2", forecast="52.7", previous="52.9", change=0.5, unit="pts"),
            EconomicMetricOut(metric="Retail Sales", actual="0.2%", forecast="0.4%", previous="0.6%", change=-0.2, unit="%"),
            EconomicMetricOut(metric="CPI YoY", actual="2.8%", forecast="2.9%", previous="3.0%", change=-0.1, unit="%"),
            EconomicMetricOut(metric="Core CPI", actual="0.3%", forecast="0.3%", previous="0.2%", change=0, unit="%"),
            EconomicMetricOut(metric="Employment Data", actual="166k", forecast="158k", previous="151k", change=8, unit="k"),
            EconomicMetricOut(metric="Unemployment Rate", actual="4.1%", forecast="4.0%", previous="4.1%", change=0.1, unit="%"),
        ],
        seasonality=SeasonalityOut(
            month="May",
            averagePerformance=may_performance,
            hitRate=curve[4].probability,
            multiYearWindow="15 year synthetic window",
            tone="Positive" if may_performance > 0.35 else "Negative" if may_performance < -0.35 else "Neutral",
            monthly=[MonthlySeasonalityOut(month=item.month, performance=item.performance) for item in curve],
            curve=curve,
        ),
        yieldMetrics=YieldAnalyticsOut(
            curveTone="Real yields fading; metals carry improving" if score > 58 else "Yield pressure remains restrictive",
            realYieldPressure=round(-0.7 + sin(seed * 0.1) * 0.5, 2),
            dollarSensitivity=round(0.62 + cos(seed * 0.04) * 0.18, 2),
            rows=[
                YieldMetricOut(tenor="2Y Treasury", currentYield=4.28, movingAverage=4.34, spread=-0.06, delta=-0.03),
                YieldMetricOut(tenor="10Y Treasury", currentYield=4.05, movingAverage=4.11, spread=-0.23, delta=-0.04),
                YieldMetricOut(tenor="Real Yield Proxy", currentYield=1.82, movingAverage=1.91, spread=-0.09, delta=-0.05),
                YieldMetricOut(tenor="2Y/10Y Spread", currentYield=-0.23, movingAverage=-0.20, spread=-0.03, delta=-0.02),
            ],
            trend=trend,
        ),
        sentiment=RetailSentimentOut(
            retailLong=round(retail_long, 1),
            retailShort=round(100 - retail_long, 1),
            contrarianSignal="Contrarian headwind" if retail_long > 62 else "Contrarian tailwind" if retail_long < 38 else "Balanced retail flow",
            institutionalInterpretation="Institutional flow leads retail positioning" if retail_long < inst_long else "Retail exposure is crowded versus institutional flow",
            cohorts=[
                SentimentBucketOut(cohort="Macro Funds", bullish=55, neutral=27, bearish=18),
                SentimentBucketOut(cohort="CTA Models", bullish=46, neutral=34, bearish=20),
                SentimentBucketOut(cohort="Options Desks", bullish=41, neutral=29, bearish=30),
                SentimentBucketOut(cohort="Retail Flow", bullish=round(retail_long), neutral=14, bearish=round(86 - retail_long)),
            ],
        ),
    )
