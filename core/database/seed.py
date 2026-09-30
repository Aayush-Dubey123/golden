import os
from common.auth import encrypt_password
from common.logger import logger
from core.cruds.user_cruds import UserCRUD
from core.cruds.order_cruds import OrderCRUD
from core.model.user_model import UserAddress, UserRole, UserStatus
from core.model.order_model import FoodType, OrderStatus

logging = logger(__name__)

DEMO_CUSTOMER_NAME = "demo_customer"
DEMO_MERCHANT_NAME = "demo_merchant"


async def seed_demo_data():
    """
    Ensure dedicated demo accounts (Demo Customer and Demo Merchant) and
    initial sample orders exist safely in MongoDB Atlas.
    """
    try:
        user_crud = UserCRUD()
        order_crud = OrderCRUD()

        # 1. Demo Customer (Role: USER)
        customer = await user_crud.get_by_first_name(DEMO_CUSTOMER_NAME)
        if not customer:
            logging.info("Seeding dedicated Demo Customer account...")
            customer_password = os.getenv("DEMO_CUSTOMER_PASSWORD", "DemoCustomer@123")
            customer_data = {
                "first_name": DEMO_CUSTOMER_NAME,
                "last_name": "Customer",
                "mobile_number": "9000000001",
                "email": "demo.customer@golden-kulcha.com",
                "password": encrypt_password(customer_password),
                "user_role": UserRole.USER.value,
                "user_status": UserStatus.ACTIVE.value,
                "address": [
                    {
                        "address_line_1": "123 Golden Kulcha Street",
                        "address_line_2": "Near Heritage Market",
                        "state": "Punjab",
                        "city": "Amritsar",
                        "pincode": "143001",
                    }
                ],
            }
            customer = await user_crud.create_user(customer_data)
            logging.info(f"Demo Customer seeded with ID: {customer.id}")

        # 2. Demo Merchant (Role: ADMIN)
        merchant = await user_crud.get_by_first_name(DEMO_MERCHANT_NAME)
        if not merchant:
            logging.info("Seeding dedicated Demo Merchant account...")
            merchant_password = os.getenv("DEMO_MERCHANT_PASSWORD", "DemoMerchant@123")
            merchant_data = {
                "first_name": DEMO_MERCHANT_NAME,
                "last_name": "Merchant",
                "mobile_number": "9000000002",
                "email": "demo.merchant@golden-kulcha.com",
                "password": encrypt_password(merchant_password),
                "user_role": UserRole.ADMIN.value,
                "user_status": UserStatus.ACTIVE.value,
                "address": [
                    {
                        "address_line_1": "Golden Kulcha Main Outlet",
                        "address_line_2": "Food Street",
                        "state": "Punjab",
                        "city": "Amritsar",
                        "pincode": "143001",
                    }
                ],
            }
            merchant = await user_crud.create_user(merchant_data)
            logging.info(f"Demo Merchant seeded with ID: {merchant.id}")

        # 3. Seed initial sample live orders if collection is empty
        orders_count = await order_crud.count(include_deleted=True)
        if orders_count == 0 and customer:
            logging.info("Seeding initial live orders for demo merchant terminal...")
            await order_crud.create({
                "created_by": customer.id,
                "food_item": "Amritsari Chole Kulcha",
                "food_type": FoodType.VEG,
                "quantity": 2,
                "price": 120.0,
                "status": OrderStatus.IN_PROGRESS,
            })
            await order_crud.create({
                "created_by": customer.id,
                "food_item": "Paneer Special Kulcha",
                "food_type": FoodType.VEG,
                "quantity": 1,
                "price": 160.0,
                "status": OrderStatus.ACCEPTED,
            })
            logging.info("Initial live demo orders seeded successfully.")

    except Exception as error:
        logging.error(f"Error seeding demo data: {error}")
