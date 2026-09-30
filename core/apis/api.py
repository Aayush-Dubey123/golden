"""
api.py — Application assembly.

Constructs the FastAPI instance and wires everything attached to it: security
headers, CORS, routers, operational endpoints, and the OpenAPI schema. This
module is the composition root — importing ``app`` from here yields a fully
configured application, which is what both :mod:`main` and any ASGI server
target.

Structure:
    1. Application instance
    2. Security-header middleware
    3. CORS policy
    4. Router registration
    5. Operational endpoints (``/``, ``/health``)
    6. OpenAPI schema customisation

Note:
    Business logic never appears here. This module composes; the routers it
    registers delegate to controllers, which own the rules.
"""

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from core.apis.routes.user_router import user_router
from core.apis.routes.order_router import order_router

#: The ASGI application. Referenced as ``core.apis.api:app`` by the server.
app = FastAPI(
    title="Golden Kulcha API",
    version="1.0.0",
    description="Production REST API for Golden Kulcha food ordering platform.",
    redoc_url="/documentation",
)


@app.middleware("http")
async def add_security_headers(request, call_next):
    """Attach hardening security headers to outbound responses."""
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=()"
    response.headers["Cache-Control"] = "no-store"
    response.headers["Server"] = "Custom Server"

    method = request.method
    if method in ["GET", "POST", "PUT", "DELETE"]:
        response.headers["Access-Control-Allow-Methods"] = method

    return response




from core.database.database import connect_to_mongo, close_mongo_connection
from core.database.seed import seed_demo_data


@app.on_event("startup")
async def startup_db_client():
    try:
        await connect_to_mongo()
        await seed_demo_data()
    except Exception as e:
        print(f"MongoDB connection/seeding warning on startup: {e}")



@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, tags=["User Management"])
app.include_router(order_router, tags=["Order Management"])


@app.get("/")
def root():
    """Return greeting confirming the Golden Kulcha API is serving."""
    return {"message": "Welcome to Golden Kulcha API", "status": "healthy"}



@app.get("/health")
def health_check():
    """
    Report process liveness.

    Consumed by load balancers, container orchestrators, and uptime monitors,
    which restart or drain an instance that stops answering.

    Returns:
        dict: ``{"status": "healthy"}``.

    Note:
        This is a liveness check only — it reports that the process is running,
        not that its dependencies are reachable. A readiness check would also
        call :func:`core.database.database.ping`, so an instance that cannot
        reach MongoDB is removed from rotation rather than served traffic it
        will fail.
    """
    return {"status": "healthy"}


def custom_openapi():
    """
    Build and cache the OpenAPI schema.

    Returns:
        dict: The OpenAPI document backing ``/docs`` and ``/documentation``.

    Note:
        The schema is generated once and stored on ``app.openapi_schema``;
        later calls return the cached document instead of walking every route
        again.

        Assigned to ``app.openapi`` below, replacing FastAPI's default
        generator. This is also the hook for adding shared metadata — security
        schemes, servers, tags — that cannot be expressed on individual routes.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Golden Kulcha API",
        version="1.0.0",
        description="Production REST API for Golden Kulcha food ordering platform.",
        routes=app.routes,
    )

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi