from fastapi import APIRouter, Query

from app.schemas.metals import MetalsDashboardOut, PreciousMetalOut
from app.services.metals_service import build_metals_dashboard, list_metal_assets

router = APIRouter()


@router.get("/metals", response_model=list[PreciousMetalOut])
async def metals() -> list[PreciousMetalOut]:
    return await list_metal_assets()


@router.get("/metals/dashboard", response_model=MetalsDashboardOut)
async def metals_dashboard(symbol: str = Query(default="XAU-USD")) -> MetalsDashboardOut:
    return await build_metals_dashboard(symbol)


@router.get("/metals/sentiment")
async def metals_sentiment(symbol: str = Query(default="XAU-USD")):
    dashboard = await build_metals_dashboard(symbol)
    return dashboard.sentiment


@router.get("/metals/economic-data")
async def metals_economic_data(symbol: str = Query(default="XAU-USD")):
    dashboard = await build_metals_dashboard(symbol)
    return dashboard.economicMetrics


@router.get("/metals/seasonality")
async def metals_seasonality(symbol: str = Query(default="XAU-USD")):
    dashboard = await build_metals_dashboard(symbol)
    return dashboard.seasonality


@router.get("/metals/positioning")
async def metals_positioning(symbol: str = Query(default="XAU-USD")):
    dashboard = await build_metals_dashboard(symbol)
    return dashboard.positioning


@router.get("/metals/yields")
async def metals_yields(symbol: str = Query(default="XAU-USD")):
    dashboard = await build_metals_dashboard(symbol)
    return dashboard.yieldMetrics
