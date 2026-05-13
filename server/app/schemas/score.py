from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class AssetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    symbol: str
    name: str
    asset_class: str
    region: str


class ScoreHistoryOut(BaseModel):
    timestamp: datetime
    score: int
    trend: float
    volatility: float
    regime: Literal["Risk-On", "Neutral", "Risk-Off"]


class DateRangeOut(BaseModel):
    key: str
    label: str
    days: int
