from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.score import AssetOut, DateRangeOut, ScoreHistoryOut
from app.services.score_service import RANGE_DAYS, list_assets, list_score_history
from app.services.synthetic_data import ASSETS, synthetic_history

router = APIRouter()


@router.get("/assets", response_model=list[AssetOut])
async def assets(session: Annotated[AsyncSession, Depends(get_session)]) -> list[AssetOut]:
    rows = await list_assets(session)
    return rows or ASSETS


@router.get("/date-range", response_model=list[DateRangeOut])
async def date_ranges() -> list[DateRangeOut]:
    return [DateRangeOut(key=key, label=key, days=days) for key, days in RANGE_DAYS.items()]


@router.get("/scores/history", response_model=list[ScoreHistoryOut])
async def score_history(
    session: Annotated[AsyncSession, Depends(get_session)],
    asset_id: str = Query(default="G10-FX"),
    range: str = Query(default="90D"),
    limit: int = Query(default=500, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
) -> list[ScoreHistoryOut]:
    rows = await list_score_history(session, asset_id=asset_id, range_key=range, limit=limit, offset=offset)
    if rows:
        return rows

    days = RANGE_DAYS.get(range, RANGE_DAYS["90D"])
    return synthetic_history(asset_id=asset_id, days=days)[offset : offset + limit]
