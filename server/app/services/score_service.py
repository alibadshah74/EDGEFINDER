from datetime import UTC, datetime, timedelta

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.score import Asset, ScoreHistory

RANGE_DAYS = {"30D": 30, "90D": 90, "6M": 180, "1Y": 365}


async def list_assets(session: AsyncSession) -> list[Asset]:
    result = await session.scalars(select(Asset).order_by(Asset.asset_class, Asset.symbol))
    return list(result)


async def list_score_history(session: AsyncSession, asset_id: str, range_key: str, limit: int, offset: int) -> list[ScoreHistory]:
    days = RANGE_DAYS.get(range_key, RANGE_DAYS["90D"])
    start_at = datetime.now(UTC) - timedelta(days=days)
    statement: Select[tuple[ScoreHistory]] = (
        select(ScoreHistory)
        .where(ScoreHistory.asset_id == asset_id, ScoreHistory.timestamp >= start_at)
        .order_by(ScoreHistory.timestamp)
        .limit(limit)
        .offset(offset)
    )
    result = await session.scalars(statement)
    return list(result)
