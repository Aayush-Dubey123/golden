from pydantic import BaseModel
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from odmantic import Field, Model
from pydantic import BaseModel

class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    SUPERADMIN = "SUPERADMIN"


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class UserAddress(BaseModel):
    address_line_1: str
    address_line_2: str
    state: str
    city: str
    pincode: str


class User(Model):
    first_name: str
    last_name: str
    mobile_number: str
    email: Optional[str] = None
    password: Optional[str] = None
    address: Optional[list[UserAddress]] = None
    user_role: UserRole = UserRole.USER

    user_status: UserStatus = UserStatus.ACTIVE
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {"collection": "users"}