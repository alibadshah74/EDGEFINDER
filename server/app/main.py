from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.scores import router as scores_router
from app.api.indices import router as indices_router
from app.api.metals import router as metals_router

app = FastAPI(title="Aster Quant Score API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scores_router, prefix="/api", tags=["score-indicator"])
app.include_router(indices_router, prefix="/api", tags=["stock-indices"])
app.include_router(metals_router, prefix="/api", tags=["metals"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
