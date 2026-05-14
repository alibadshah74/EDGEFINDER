from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PreciousMetalOut(BaseModel):
    id: str
    symbol: str
    name: str
    unit: str
    quoteCurrency: str


class MarketBiasOut(BaseModel):
    level: Literal["Very Bearish", "Bearish", "Neutral", "Bullish", "Very Bullish"]
    score: int
    confidence: int
    bullishShare: int
    bearishShare: int


class PositioningOut(BaseModel):
    institutionalLong: float
    institutionalShort: float
    retailLong: float
    retailShort: float
    weeklyLongChange: float
    weeklyShortChange: float
    netPositioning: float
    imbalanceScore: float


class ScoreBreakdownOut(BaseModel):
    indicator: str
    score: float
    delta: float


class EconomicMetricOut(BaseModel):
    metric: str
    actual: str
    forecast: str
    previous: str
    change: float
    unit: str


class MonthlySeasonalityOut(BaseModel):
    month: str
    performance: float


class SeasonalPerformanceOut(BaseModel):
    month: str
    performance: float
    probability: int


class SeasonalityOut(BaseModel):
    month: str
    averagePerformance: float
    hitRate: int
    multiYearWindow: str
    tone: Literal["Positive", "Neutral", "Negative"]
    monthly: list[MonthlySeasonalityOut]
    curve: list[SeasonalPerformanceOut]


class YieldMetricOut(BaseModel):
    tenor: str
    currentYield: float
    movingAverage: float
    spread: float
    delta: float


class YieldTrendOut(BaseModel):
    date: datetime
    yield_: float = Field(alias="yield")
    realYield: float

    model_config = ConfigDict(populate_by_name=True)


class YieldAnalyticsOut(BaseModel):
    curveTone: str
    realYieldPressure: float
    dollarSensitivity: float
    rows: list[YieldMetricOut]
    trend: list[YieldTrendOut]


class SentimentBucketOut(BaseModel):
    cohort: str
    bullish: int
    neutral: int
    bearish: int


class RetailSentimentOut(BaseModel):
    retailLong: float
    retailShort: float
    contrarianSignal: str
    institutionalInterpretation: str
    cohorts: list[SentimentBucketOut]


class MetalsDashboardOut(BaseModel):
    asset: PreciousMetalOut
    generatedAt: datetime
    marketBias: MarketBiasOut
    positioning: PositioningOut
    scoreBreakdown: list[ScoreBreakdownOut]
    economicMetrics: list[EconomicMetricOut]
    seasonality: SeasonalityOut
    yieldMetrics: YieldAnalyticsOut
    sentiment: RetailSentimentOut
