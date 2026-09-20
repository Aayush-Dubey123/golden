import logging
import os
from typing import Optional

from motor import core, motor_asyncio
from odmantic import AIOEngine
from pymongo.driver_info import DriverInfo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#: Identifies this application in MongoDB's server logs and profiler output,
#: which makes traffic attributable when several services share a cluster.
DRIVER_INFO = DriverInfo(name="fastapi-tutorial", version="0.1.0")

MONGODB_URL = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL") or "mongodb://localhost:27017"
DATABASE_NAME = os.getenv("DATABASE_NAME", "golden")


class _MongoClientSingleton:
    mongo_client: Optional[motor_asyncio.AsyncIOMotorClient] = None
    engine: Optional[AIOEngine] = None

    def __new__(cls):
        # Reuse the existing instance if one was already built.
        if not hasattr(cls, "instance"):
            cls.instance = super(_MongoClientSingleton, cls).__new__(cls)

            mongodb_uri = MONGODB_URL
            database_name = DATABASE_NAME

            # Motor manages the connection pool internally. This call performs
            # no I/O, so an unreachable host surfaces on first use, not here.
            cls.instance.mongo_client = motor_asyncio.AsyncIOMotorClient(
                mongodb_uri, driver=DRIVER_INFO
            )

            # ODMantic wraps the Motor client and adds model validation.
            cls.instance.engine = AIOEngine(
                client=cls.instance.mongo_client, database=database_name
            )

            # Logged so the target database is verifiable at a glance — the one
            # cheap check against a mis-ordered .env load.
            logger.info(f"MongoDB singleton initialised | DB: {database_name}")

        return cls.instance


def MongoDatabase() -> core.AgnosticDatabase:

    return _MongoClientSingleton().mongo_client[DATABASE_NAME]


def get_engine() -> AIOEngine:

    return _MongoClientSingleton().engine


async def ping() -> None:

    await MongoDatabase().command("ping")
    logger.info("MongoDB ping successful")


async def connect_to_mongo() -> None:
   
    logger.info("Connecting to MongoDB...")
    _MongoClientSingleton()
    await ping()
    logger.info("MongoDB connection established")


async def close_mongo_connection() -> None:
   
    singleton = _MongoClientSingleton()

    if singleton.mongo_client:
        singleton.mongo_client.close()
        logger.info("MongoDB connection closed")