from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[str] = mapped_column(String(48), primary_key=True)
    symbol: Mapped[str] = mapped_column(String(24), index=True)
    name: Mapped[str] = mapped_column(String(160))
    asset_class: Mapped[str] = mapped_column(String(48), index=True)
    region: Mapped[str] = mapped_column(String(80), index=True)

    score_history: Mapped[list["ScoreHistory"]] = relationship(back_populates="asset")


class ScoreHistory(Base):
    __tablename__ = "score_history"
    __table_args__ = (
        Index("ix_score_history_asset_timestamp", "asset_id", "timestamp"),
        Index("ix_score_history_timestamp", "timestamp"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    score: Mapped[int] = mapped_column(Integer)
    trend: Mapped[float] = mapped_column(Float)
    volatility: Mapped[float] = mapped_column(Float)
    regime: Mapped[str] = mapped_column(String(32), index=True)

    asset: Mapped[Asset] = relationship(back_populates="score_history")


class MarketMetric(Base):
    __tablename__ = "market_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    metric_name: Mapped[str] = mapped_column(String(80), index=True)
    metric_value: Mapped[float] = mapped_column(Float)


class IndicatorMetadata(Base):
    __tablename__ = "indicator_metadata"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), index=True)
    source_family: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(String(280))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
