from fastapi import APIRouter, Query

from app.schemas.indices import IndicesDashboardOut, StockIndexOut
from app.services.indices_service import build_indices_dashboard, list_index_assets

router = APIRouter()


@router.get("/indices", response_model=list[StockIndexOut])
async def indices() -> list[StockIndexOut]:
    return await list_index_assets()


@router.get("/indices/dashboard", response_model=IndicesDashboardOut)
async def indices_dashboard(symbol: str = Query(default="SPX-CORE")) -> IndicesDashboardOut:
    return await build_indices_dashboard(symbol)


@router.get("/sentiment")
async def sentiment(symbol: str = Query(default="SPX-CORE")):
    dashboard = await build_indices_dashboard(symbol)
    return dashboard.sentiment


@router.get("/economic-data")
async def economic_data(symbol: str = Query(default="SPX-CORE")):
    dashboard = await build_indices_dashboard(symbol)
    return dashboard.economicMetrics


@router.get("/seasonality")
async def seasonality(symbol: str = Query(default="SPX-CORE")):
    dashboard = await build_indices_dashboard(symbol)
    return dashboard.seasonality


@router.get("/positioning")
async def positioning(symbol: str = Query(default="SPX-CORE")):
    dashboard = await build_indices_dashboard(symbol)
    return dashboard.positioning


@router.get("/put-call-ratio")
async def put_call_ratio(symbol: str = Query(default="SPX-CORE")):
    dashboard = await build_indices_dashboard(symbol)
    return dashboard.putCallRatio
