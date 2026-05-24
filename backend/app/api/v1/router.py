from fastapi import APIRouter
from app.api.v1 import market, macro, features, models, signals, portfolio, agents, watchlists, dashboard

router = APIRouter()
router.include_router(market.router,     prefix="/market",     tags=["market"])
router.include_router(macro.router,      prefix="/macro",      tags=["macro"])
router.include_router(features.router,   prefix="/features",   tags=["features"])
router.include_router(models.router,     prefix="/models",     tags=["models"])
router.include_router(signals.router,    prefix="/signals",    tags=["signals"])
router.include_router(portfolio.router,  prefix="/portfolio",  tags=["portfolio"])
router.include_router(agents.router,     prefix="/agents",     tags=["agents"])
router.include_router(watchlists.router, prefix="/watchlists", tags=["watchlists"])
router.include_router(dashboard.router,  prefix="/dashboard",  tags=["dashboard"])
