from django.urls import path
from . import views

urlpatterns = [

    path("register/", views.register_user),
    path("login/", views.login_user),
    path("verify-otp/", views.verify_otp),
    path("forgot-password/", views.forgot_password),
    path("reset-password/", views.reset_password),

    path("buyer/cart/add/", views.add_to_cart),
    path("buyer/cart/<str:email>/", views.get_cart),

    path("buyer/wishlist/add/", views.add_to_wishlist),
    path("buyer/wishlist/<str:email>/", views.get_wishlist),

    path("buyer/order/place/", views.place_order),
    path("buyer/order/<str:email>/", views.get_orders),

    path("farmer/product/add/", views.add_product),
    path("farmer/products/<str:email>/", views.get_farmer_products),
    path("products/", views.get_products),
    path("admin/product/delete/", views.admin_delete_product),
    path("buyer/wishlist/remove/", views.remove_wishlist_item),

]
