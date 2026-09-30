from common.logger import logger
from fastapi import HTTPException, status
from odmantic import ObjectId
from common.auth import encrypt_password, verify_password, signJWT
from core.cruds.user_cruds import UserCRUD
from core.model.user_model import UserStatus

logging = logger(__name__)

#: Lifetime of an issued access token, in seconds (one hour). Short-lived by
#: design: a leaked token cannot be revoked, so expiry is what bounds the damage.
ACCESS_TOKEN_EXPIRY_SECONDS = 3600

class UserController:

    def __init__(self) -> None:
        self.user_crud = UserCRUD()

    async def register_user(self, request: dict) -> dict:
        try:
            logging.info("Calling UserController.register_user function")

            existing_user = await self.user_crud.get_user_by_mobile_number(
                request.get("mobile_number")
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                       detail="User with this mobile number already exists",
                )
            password = request.get("password")
            hashed_password = encrypt_password(password)
            request["password"] = hashed_password
            user = await self.user_crud.create_user(request)
            access_token = signJWT(
                user_role=user.user_role.value,
                id=str(user.id),
                expiry_duration=ACCESS_TOKEN_EXPIRY_SECONDS,
            )
            # Built explicitly rather than by dumping the stored document, so
            # the password hash cannot reach the client.
            return {
                "message": "User created successfully",
                "data": {
                    "id": str(user.id),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "mobile_number": user.mobile_number,
                    "user_role": user.user_role.value,
                    "user_status": user.user_status.value,
                    "access_token": access_token,
                },
            }

        except HTTPException:
            raise
        except Exception as error:
            logging.error(f"Error in UserController.register_user: {error}")
            raise

    async def login_user(self, request: dict) -> dict:
        try:
            logging.info("Calling UserController.login_user function")
            first_name = (
                request.get("first_name")
                or request.get("name")
                or request.get("username")
            )
            password = request.get("password")

            if not first_name or not password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Name and password are required",
                )

            user = await self.user_crud.get_by_first_name(first_name)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )

            if not user.password or not verify_password(password, user.password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )

            if user.user_status == UserStatus.INACTIVE:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is inactive",
                )

            access_token = signJWT(
                user_role=user.user_role.value,
                id=str(user.id),
                expiry_duration=ACCESS_TOKEN_EXPIRY_SECONDS,
            )

            return {
                "message": "Login successful",
                "data": {
                    "id": str(user.id),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "mobile_number": user.mobile_number,
                    "user_role": user.user_role.value,
                    "user_status": user.user_status.value,
                    "access_token": access_token,
                },
            }

        except HTTPException:
            raise
        except Exception as error:
            logging.error(f"Error in UserController.login_user: {error}")
            raise

