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


class StockIndex(Base):
    __tablename__ = "stock_indices"

    id: Mapped[str] = mapped_column(String(48), primary_key=True)
    symbol: Mapped[str] = mapped_column(String(24), index=True)
    name: Mapped[str] = mapped_column(String(160))
    region: Mapped[str] = mapped_column(String(80), index=True)
    currency: Mapped[str] = mapped_column(String(8), index=True)


class EconomicMetric(Base):
    __tablename__ = "economic_metrics"
    __table_args__ = (Index("ix_economic_metrics_symbol_timestamp", "symbol_id", "timestamp"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol_id: Mapped[str] = mapped_column(ForeignKey("stock_indices.id", ondelete="CASCADE"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    metric: Mapped[str] = mapped_column(String(80), index=True)
    actual_value: Mapped[float] = mapped_column(Float)
    forecast_value: Mapped[float] = mapped_column(Float)
    change_value: Mapped[float] = mapped_column(Float)


class SentimentMetric(Base):
    __tablename__ = "sentiment_metrics"
    __table_args__ = (Index("ix_sentiment_metrics_symbol_timestamp", "symbol_id", "timestamp"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol_id: Mapped[str] = mapped_column(ForeignKey("stock_indices.id", ondelete="CASCADE"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    cohort: Mapped[str] = mapped_column(String(80), index=True)
    bullish: Mapped[float] = mapped_column(Float)
    neutral: Mapped[float] = mapped_column(Float)
    bearish: Mapped[float] = mapped_column(Float)


class PositioningData(Base):
    __tablename__ = "positioning_data"
    __table_args__ = (Index("ix_positioning_data_symbol_timestamp", "symbol_id", "timestamp"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol_id: Mapped[str] = mapped_column(ForeignKey("stock_indices.id", ondelete="CASCADE"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    institutional_long: Mapped[float] = mapped_column(Float)
    institutional_short: Mapped[float] = mapped_column(Float)
    retail_long: Mapped[float] = mapped_column(Float)
    retail_short: Mapped[float] = mapped_column(Float)


class SeasonalData(Base):
    __tablename__ = "seasonal_data"
    __table_args__ = (Index("ix_seasonal_data_symbol_month", "symbol_id", "month"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol_id: Mapped[str] = mapped_column(ForeignKey("stock_indices.id", ondelete="CASCADE"), index=True)
    month: Mapped[str] = mapped_column(String(12), index=True)
    average_performance: Mapped[float] = mapped_column(Float)
    hit_rate: Mapped[float] = mapped_column(Float)


class InterestRate(Base):
    __tablename__ = "interest_rates"
    __table_args__ = (Index("ix_interest_rates_symbol_timestamp", "symbol_id", "timestamp"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol_id: Mapped[str] = mapped_column(ForeignKey("stock_indices.id", ondelete="CASCADE"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    current_yield: Mapped[float] = mapped_column(Float)
    moving_average: Mapped[float] = mapped_column(Float)
    difference: Mapped[float] = mapped_column(Float)
