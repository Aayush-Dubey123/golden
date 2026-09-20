

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer

from common.auth import decodeJWT
from common.logger import logger
from core.apis.schemas.order_request import (
    OrderCreateRequest,
    OrderRatingRequest,
    OrderUpdateRequest,
)
from core.controllers.order_controller import OrderController
from core.model.order_model import OrderStatus

logging = logger(__name__)

order_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/user/login")


@order_router.post("/v1/orders", status_code=status.HTTP_201_CREATED)
async def create_order(
    request: OrderCreateRequest, token: str = Depends(oauth2_scheme)
):
    try:
        logging.info("Calling /v1/orders endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order creation")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
      
        result = await OrderController().create_order(
            request.model_dump(), authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in /v1/orders: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in /v1/orders: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.get("/v1/orders", status_code=status.HTTP_200_OK)
async def list_orders(
    order_status: Optional[OrderStatus] = Query(
        None, description="Filter by order status."
    ),
    user_id: Optional[str] = Query(
        None, description="Filter by owner. Administrators only."
    ),
    include_deleted: bool = Query(
        False, description="Include soft-deleted orders. Administrators only."
    ),
    page: int = Query(1, ge=1, description="1-based page number."),
    page_size: int = Query(20, ge=1, le=100, description="Orders per page."),
    token: str = Depends(oauth2_scheme),
):
    try:
        logging.info("Calling GET /v1/orders endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order listing")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().list_orders(
            authenticated_user_details=authenticated_user_details,
            order_status=order_status,
            user_id=user_id,
            include_deleted=include_deleted,
            page=page,
            page_size=page_size,
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in GET /v1/orders: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in GET /v1/orders: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.get("/v1/orders/{order_id}/rate", status_code=status.HTTP_200_OK)
async def get_order_rating(order_id: str):
    """Return the order's food details and current rating. No auth required."""
    try:
        logging.info(f"Calling GET /v1/orders/{order_id}/rate endpoint")
        result = await OrderController().get_order_rating(order_id)
        return result

    except HTTPException as httperror:
        logging.error(f"Error in GET /v1/orders/{order_id}/rate: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in GET /v1/orders/{order_id}/rate: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.post("/v1/orders/{order_id}/rate", status_code=status.HTTP_200_OK)
async def rate_order(
    order_id: str,
    request: OrderRatingRequest,
    token: str = Depends(oauth2_scheme),
):
    """Submit a rating (1–5) and optional review for an order. Auth required."""
    try:
        logging.info(f"Calling POST /v1/orders/{order_id}/rate endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order rating")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().rate_order(
            order_id, request.rating, request.review, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in POST /v1/orders/{order_id}/rate: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in POST /v1/orders/{order_id}/rate: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.get("/v1/orders/{order_id}", status_code=status.HTTP_200_OK)
async def get_order_by_id(order_id: str, token: str = Depends(oauth2_scheme)):
    try:
        logging.info(f"Calling /v1/orders/{order_id} endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order retrieval")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().get_order_by_id(
            order_id, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in /v1/orders/{order_id}: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in /v1/orders/{order_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.put("/v1/orders/{order_id}", status_code=status.HTTP_200_OK)
async def update_order(
    order_id: str,
    request: OrderUpdateRequest,
    token: str = Depends(oauth2_scheme),
):
    try:
        logging.info(f"Calling PUT /v1/orders/{order_id} endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order update")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().update_order(
            order_id,
            request.model_dump(exclude_unset=True),
            authenticated_user_details,
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in PUT /v1/orders/{order_id}: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in PUT /v1/orders/{order_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.delete("/v1/orders/{order_id}", status_code=status.HTTP_200_OK)
async def delete_order(order_id: str, token: str = Depends(oauth2_scheme)):
    try:
        logging.info(f"Calling DELETE /v1/orders/{order_id} endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order deletion")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().delete_order(
            order_id, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in DELETE /v1/orders/{order_id}: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in DELETE /v1/orders/{order_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.post("/v1/orders/{order_id}/restore", status_code=status.HTTP_200_OK)
async def restore_order(order_id: str, token: str = Depends(oauth2_scheme)):
    try:
        logging.info(f"Calling POST /v1/orders/{order_id}/restore endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for order restore")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().restore_order(
            order_id, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in POST /v1/orders/{order_id}/restore: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in POST /v1/orders/{order_id}/restore: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )


@order_router.delete(
    "/v1/orders/{order_id}/permanent", status_code=status.HTTP_200_OK
)
async def hard_delete_order(order_id: str, token: str = Depends(oauth2_scheme)):
    try:
        logging.info(f"Calling DELETE /v1/orders/{order_id}/permanent endpoint")
        authenticated_user_details = decodeJWT(token)
        if not authenticated_user_details:
            logging.warning("Invalid or expired token provided for hard delete")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        result = await OrderController().hard_delete_order(
            order_id, authenticated_user_details
        )
        return result

    except HTTPException as httperror:
        logging.error(f"Error in DELETE /v1/orders/{order_id}/permanent: {httperror}")
        raise
    except Exception as error:
        logging.error(f"Error in DELETE /v1/orders/{order_id}/permanent: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something Went Wrong",
        )