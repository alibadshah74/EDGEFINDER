from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.scores import router as scores_router

app = FastAPI(title="Aster Quant Score API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scores_router, prefix="/api", tags=["score-indicator"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
