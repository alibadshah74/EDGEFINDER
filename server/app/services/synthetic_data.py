from datetime import UTC, datetime, timedelta
from math import cos, sin

from app.schemas.score import AssetOut, ScoreHistoryOut

ASSETS = [
    AssetOut(id="G10-FX", symbol="G10FX", name="G10 Currency Composite", asset_class="FX", region="Global"),
    AssetOut(id="US-EQ", symbol="USEQ", name="US Equity Breadth", asset_class="Equity Index", region="United States"),
    AssetOut(id="XAU-XAG", symbol="PMET", name="Precious Metals Pair", asset_class="Metals", region="Global"),
    AssetOut(id="UST-10Y", symbol="UST10", name="Treasury Duration Proxy", asset_class="Rates", region="United States"),
    AssetOut(id="DIGI-BETA", symbol="DBETA", name="Digital Beta Basket", asset_class="Crypto", region="Global"),
]


def synthetic_history(asset_id: str, days: int) -> list[ScoreHistoryOut]:
    seed = sum(ord(char) for char in asset_id)
    today = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
    trend = 100 + seed % 19
    points: list[ScoreHistoryOut] = []

    for index in range(days):
        pulse = sin(index / 5.6 + seed * 0.07) * 4.8 + cos(index / 12 + seed * 0.03) * 3.1
        score = max(-10, min(10, round(pulse + sin(index / 2.7) * 1.8 + ((seed % 7) - 3) * 0.35)))
        trend += score * 0.22 + sin(index / 8 + seed) * 0.55
        volatility = abs(score) * 1.7 + 8 + (index % 9) * 0.35
        regime = "Risk-On" if score >= 4 else "Risk-Off" if score <= -4 else "Neutral"
        points.append(
            ScoreHistoryOut(
                timestamp=today - timedelta(days=days - index - 1),
                score=score,
                trend=round(trend, 2),
                volatility=round(volatility, 2),
                regime=regime,
            )
        )

    return points
