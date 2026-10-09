from django.urls import path
from . import views

urlpatterns = [

    # ================= AUTH =================

    path("register/", views.register_user),

    path("login/", views.login_user),

    path("verify-otp/", views.verify_otp),

    path("forgot-password/", views.forgot_password),

    path("reset-password/", views.reset_password),

    # ================= CART =================

    path(
        "buyer/cart/add/",
        views.add_to_cart
    ),

    path(
        "buyer/cart/<str:email>/",
        views.get_cart
    ),

    # ================= WISHLIST =================

    path(
        "buyer/wishlist/add/",
        views.add_to_wishlist
    ),

    path(
        "buyer/wishlist/<str:email>/",
        views.get_wishlist
    ),

    path(
        "buyer/wishlist/remove/",
        views.remove_wishlist_item
    ),

    path(
        "buyer/wishlist/remove/<str:item_id>/",
        views.remove_wishlist_item_by_id
    ),

    # ================= ORDERS =================

    path(
        "buyer/order/place/",
        views.place_order
    ),

    path(
        "buyer/order/<str:email>/",
        views.get_orders
    ),

    path(
        "farmer/orders/<str:email>/",
        views.get_farmer_orders
    ),

    path(
        "orders/update-status/",
        views.update_order_status
    ),

    path(
        "admin/all-orders/",
        views.get_all_orders
    ),

    # ================= PAYMENTS =================

    path(
        "payment/place/",
        views.place_payment
    ),

    path(
        "payment/history/<str:email>/",
        views.get_payment_history
    ),

    # ================= FARMER =================

    path(
        "farmer/cart/<str:email>/",
        views.get_farmer_cart_items
    ),

    path(
        "farmer/product/add/",
        views.add_product
    ),

    path(
        "farmer/products/<str:email>/",
        views.get_farmer_products
    ),

    # ================= PRODUCTS =================

    path(
        "products/",
        views.get_products
    ),

    path(
        "admin/product/delete/",
        views.admin_delete_product
    ),

    # ================= ADMIN =================

    path(
        "admin/overview/",
        views.admin_overview
    ),

    path(
        "admin/users/status/",
        views.admin_update_user_status
    ),

    path(
        "admin/users/delete/",
        views.admin_delete_user
    ),

    path(
        "admin/users/<str:role>/",
        views.admin_users
    ),

    path(
        "admin/orders/",
        views.admin_orders
    ),

    path(
        "admin/orders/status/",
        views.admin_update_order_status
    ),

    path(
        "admin/cart/",
        views.admin_cart
    ),

    path(
        "admin/wishlist/",
        views.admin_wishlist
    ),



    # ================= PROFILE =================

    path(
        "users/profile/<str:email>/",
        views.get_user_profile
    ),

    path(
        "users/profile/<str:email>/update/",
        views.update_user_profile
    ),

    # ================= LANDING =================

    path(
        "landing/overview/",
        views.landing_overview
    ),

]