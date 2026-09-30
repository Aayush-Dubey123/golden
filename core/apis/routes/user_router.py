from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from common.logger import logger
from core.apis.schemas.user_request.user_request import (
    UserSignInRequest,
    UserLoginRequest,
    DemoLoginRequest,
    UserChangePasswordRequest,
    AdminUserUpdateRequest,
    UserStatusUpdateRequest,
)
from core.controllers.user_controller import UserController
from core.model.user_model import UserStatus
from common.auth import decodeJWT

logging = logger(__name__)

user_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/user/login")


@user_router.post("/v1/users/signup", status_code=status.HTTP_201_CREATED)
async def user_signup(request: UserSignInRequest):

    try:
        logging.info("Calling /v1/users/signup endpoint")
        request = request.model_dump()
        result = await UserController().register_user(request)
        return result

    except HTTPException as httperror:
        # Deliberate, meaningful failure from the controller — log it, then let
        # it through untouched so the intended status code reaches the client.
        # Swallowing it here would return an empty 201 for a failed request.
        logging.error(f"Error in /v1/users/signup: {httperror}")
        raise
    except Exception as error:
        # Unexpected failure: the log gets the full cause, the client gets a
        # generic message that reveals nothing about internals.
        logging.error(f"Error in /v1/users/signup: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.post("/v1/user/login", status_code=status.HTTP_200_OK)
async def user_login(form_data: OAuth2PasswordRequestForm = Depends()):

    try:
        logging.info("Calling /v1/user/login endpoint")
        request = {"first_name": form_data.username, "password": form_data.password}
        result = await UserController().login_user(request)
        # Return access_token at top level for OAuth2/Swagger compatibility,
        # while keeping the existing response fields intact.
        return {
            "access_token": result["data"]["access_token"],
            "token_type": "bearer",
            **result,
        }

    except HTTPException as httperror:
        logging.error(f"Error in /v1/user/login: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in /v1/user/login: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.post("/v1/user/demo-login", status_code=status.HTTP_200_OK)
async def demo_login(request: DemoLoginRequest):
    """
    Portfolio-friendly demo login endpoint supporting:
    1. Demo Customer (role='CUSTOMER') -> standard authenticated customer flow
    2. Demo Merchant (role='MERCHANT') -> merchant/admin live dashboard terminal
    """
    try:
        logging.info("Calling /v1/user/demo-login endpoint")
        result = await UserController().demo_login(request.role)
        return {
            "access_token": result["data"]["access_token"],
            "token_type": "bearer",
            **result,
        }
    except HTTPException as httperror:
        logging.error(f"Error in /v1/user/demo-login: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in /v1/user/demo-login: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )



@user_router.post("/v1/user/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    request: UserChangePasswordRequest, token: str = Depends(oauth2_scheme)
):
   
    try:
        logging.info("Calling /v1/user/change-password endpoint")
        request = request.model_dump()
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for password change")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        logging.info(f"Authenticated user details: {authenticated_user_details}")

        result = await UserController().change_password(
            request, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in /v1/user/change-password: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in /v1/user/change-password: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.get("/v1/user/me", status_code=status.HTTP_200_OK)
async def get_my_profile(token: str = Depends(oauth2_scheme)):
   
    try:
        logging.info("Calling /v1/user/me endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for profile retrieval")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await UserController().get_profile(authenticated_user_details)
        return result

    except HTTPException as httperror:
        logging.error(f"Error in /v1/user/me: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in /v1/user/me: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.get("/v1/users", status_code=status.HTTP_200_OK)
async def list_users(
    user_status: Optional[UserStatus] = Query(
        None, description="Filter by account status."
    ),
    page: int = Query(1, ge=1, description="1-based page number."),
    page_size: int = Query(20, ge=1, le=100, description="Users per page."),
    token: str = Depends(oauth2_scheme),
):

    try:
        logging.info("Calling GET /v1/users endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for user listing")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await UserController().list_users(
            authenticated_user_details=authenticated_user_details,
            user_status=user_status,
            page=page,
            page_size=page_size,
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in GET /v1/users: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in GET /v1/users: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.get("/v1/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_by_id(user_id: str, token: str = Depends(oauth2_scheme)):

    try:
        logging.info(f"Calling GET /v1/users/{user_id} endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for user retrieval")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await UserController().get_user_by_id(
            user_id, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in GET /v1/users/{user_id}: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in GET /v1/users/{user_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.put("/v1/users/{user_id}", status_code=status.HTTP_200_OK)
async def update_user(
    user_id: str,
    request: AdminUserUpdateRequest,
    token: str = Depends(oauth2_scheme),
):
    try:
        logging.info(f"Calling PUT /v1/users/{user_id} endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for user update")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await UserController().update_user(
            user_id,
            request.model_dump(exclude_unset=True),
            authenticated_user_details,
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in PUT /v1/users/{user_id}: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in PUT /v1/users/{user_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@user_router.patch("/v1/users/{user_id}/status", status_code=status.HTTP_200_OK)
async def update_user_status(
    user_id: str,
    request: UserStatusUpdateRequest,
    token: str = Depends(oauth2_scheme),
):
   
    try:
        logging.info(f"Calling PATCH /v1/users/{user_id}/status endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for status update")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await UserController().update_user_status(
            user_id, request.model_dump(), authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in PATCH /v1/users/{user_id}/status: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in PATCH /v1/users/{user_id}/status: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )