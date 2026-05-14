from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class StockIndexOut(BaseModel):
    id: str
    symbol: str
    name: str
    region: str
    currency: str


class MarketBiasOut(BaseModel):
    level: Literal["Very Bearish", "Bearish", "Neutral", "Bullish", "Very Bullish"]
    score: int
    confidence: int


class PositioningOut(BaseModel):
    institutionalLong: float
    institutionalShort: float
    retailLong: float
    retailShort: float
    weeklyLongChange: float
    weeklyShortChange: float


class PutCallPointOut(BaseModel):
    date: datetime
    ratio: float
    trend: float


class ScoreBreakdownOut(BaseModel):
    indicator: str
    score: float
    delta: float


class EconomicMetricOut(BaseModel):
    metric: str
    actual: str
    forecast: str
    change: float
    unit: str


class SentimentBucketOut(BaseModel):
    cohort: str
    bullish: int
    neutral: int
    bearish: int


class MonthlySeasonalityOut(BaseModel):
    month: str
    performance: float


class SeasonalityOut(BaseModel):
    month: str
    averagePerformance: float
    hitRate: int
    multiYearWindow: str
    tone: Literal["Positive", "Neutral", "Negative"]
    monthly: list[MonthlySeasonalityOut]


class InterestRateOut(BaseModel):
    currentYield: float
    movingAverage: float
    difference: float
    curveTone: str


class IndicesDashboardOut(BaseModel):
    asset: StockIndexOut
    generatedAt: datetime
    marketBias: MarketBiasOut
    positioning: PositioningOut
    putCallRatio: list[PutCallPointOut]
    scoreBreakdown: list[ScoreBreakdownOut]
    economicMetrics: list[EconomicMetricOut]
    sentiment: list[SentimentBucketOut]
    seasonality: SeasonalityOut
    interestRates: InterestRateOut
