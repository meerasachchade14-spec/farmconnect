import json
import random
import time
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import DatabaseError
from pymongo import MongoClient
from bson import ObjectId

from .models import User,Product,Cart,Wishlist,Order
from .serializers import ProductSerializer,CartSerializer,WishlistSerializer,OrderSerializer
from .email_utils import send_otp_email

OTP_TTL_SECONDS = 10 * 60
OTP_STORE = {}


def _generate_otp():
    return str(random.randint(100000, 999999))


def _store_otp(email, otp):
    OTP_STORE[email] = {
        "otp": otp,
        "expires_at": time.time() + OTP_TTL_SECONDS
    }


def _verify_otp(email, otp):
    record = OTP_STORE.get(email)
    if not record:
        return False
    if time.time() > record["expires_at"]:
        OTP_STORE.pop(email, None)
        return False
    return record["otp"] == otp


def _get_mongo_collection():
    db_cfg = settings.DATABASES.get("default", {})
    db_name = db_cfg.get("NAME")
    host = db_cfg.get("CLIENT", {}).get("host")
    if not db_name or not host:
        raise Exception("MongoDB settings are not configured")
    client = MongoClient(host)
    return client[db_name]["users_user"]


def _get_mongo_products_collection():
    db_cfg = settings.DATABASES.get("default", {})
    db_name = db_cfg.get("NAME")
    host = db_cfg.get("CLIENT", {}).get("host")
    if not db_name or not host:
        raise Exception("MongoDB settings are not configured")
    client = MongoClient(host)
    return client[db_name]["users_product"]


@csrf_exempt
def register_user(request):

    if request.method=="POST":

        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        role = (data.get("role") or "").strip()

        if not email or not password or not role:
            return JsonResponse({"error":"Email, password, and role are required"},status=400)

        try:
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error":"User exists"},status=400)

            User.objects.create(
                email=email,
                password=password,
                role=role
            )
        except DatabaseError:
            # Fallback for Djongo SQL issues: write directly to MongoDB
            collection = _get_mongo_collection()
            if collection.find_one({"email": email}):
                return JsonResponse({"error":"User exists"},status=400)
            collection.insert_one({
                "email": email,
                "password": password,
                "role": role
            })

        otp = _generate_otp()
        _store_otp(email, otp)

        # Try to send OTP email, but don't fail registration if email is not configured.
        try:
            send_otp_email(email, otp)
        except Exception:
            pass

        response = {"msg":"Registration successful. OTP sent."}
        if settings.DEBUG:
            response["otp"] = otp
        return JsonResponse(response)


@csrf_exempt
def login_user(request):

    if request.method=="POST":

        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()

        if not email or not password:
            return JsonResponse({"error":"Email and password are required"},status=400)

        try:
            user = User.objects.get(email=email)
            if user.password != password:
                return JsonResponse({"error":"Invalid login"},status=400)
            return JsonResponse({
                "email":user.email,
                "role":user.role
            })
        except DatabaseError:
            collection = _get_mongo_collection()
            doc = collection.find_one({"email": email})
            if not doc or doc.get("password") != password:
                return JsonResponse({"error":"Invalid login"},status=400)
            return JsonResponse({
                "email": doc.get("email"),
                "role": doc.get("role")
            })
        except Exception:
            return JsonResponse({"error":"Invalid login"},status=400)


@csrf_exempt
def verify_otp(request):

    if request.method=="POST":

        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()
        otp = (data.get("otp") or "").strip()

        if not email or not otp:
            return JsonResponse({"error":"Email and OTP are required"},status=400)

        if not _verify_otp(email, otp):
            return JsonResponse({"error":"Invalid or expired OTP"},status=400)

        return JsonResponse({"msg":"OTP verified"})


@csrf_exempt
def forgot_password(request):

    if request.method=="POST":

        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()

        if not email:
            return JsonResponse({"error":"Email is required"},status=400)

        try:
            if not User.objects.filter(email=email).exists():
                return JsonResponse({"error":"User not found"},status=404)
        except DatabaseError:
            collection = _get_mongo_collection()
            if not collection.find_one({"email": email}):
                return JsonResponse({"error":"User not found"},status=404)

        otp = _generate_otp()
        _store_otp(email, otp)

        try:
            send_otp_email(email, otp)
        except Exception:
            pass

        response = {"msg":"OTP sent"}
        if settings.DEBUG:
            response["otp"] = otp
        return JsonResponse(response)


@csrf_exempt
def reset_password(request):

    if request.method=="POST":

        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()
        otp = (data.get("otp") or "").strip()
        password = (data.get("password") or "").strip()

        if not email or not otp or not password:
            return JsonResponse({"error":"Email, OTP, and password are required"},status=400)

        if not _verify_otp(email, otp):
            return JsonResponse({"error":"Invalid or expired OTP"},status=400)

        try:
            user = User.objects.get(email=email)
            user.password = password
            user.save()
        except DatabaseError:
            collection = _get_mongo_collection()
            result = collection.update_one(
                {"email": email},
                {"$set": {"password": password}}
            )
            if result.matched_count == 0:
                return JsonResponse({"error":"User not found"},status=404)
        except Exception:
            return JsonResponse({"error":"User not found"},status=404)

        return JsonResponse({"msg":"Password reset successful"})


# CART

@csrf_exempt
def add_to_cart(request):

    data = json.loads(request.body)

    Cart.objects.create(
        buyer_email=data["buyer_email"],
        product_name=data["product_name"],
        quantity=data["quantity"]
    )

    return JsonResponse({"msg":"Added"})


def get_cart(request,email):

    items = Cart.objects.filter(buyer_email=email)

    return JsonResponse(
        CartSerializer(items,many=True).data,
        safe=False
    )


# WISHLIST

@csrf_exempt
def add_to_wishlist(request):

    data = json.loads(request.body)

    Wishlist.objects.create(
        buyer_email=data["buyer_email"],
        product_name=data["product_name"]
    )

    return JsonResponse({"msg":"Wishlist added"})


def get_wishlist(request,email):

    items = Wishlist.objects.filter(buyer_email=email)

    return JsonResponse(
        WishlistSerializer(items,many=True).data,
        safe=False
    )


# ORDER

@csrf_exempt
def place_order(request):

    data = json.loads(request.body)

    Order.objects.create(
        product_name=data["product_name"],
        buyer_email=data["buyer_email"],
        quantity=data["quantity"]
    )

    return JsonResponse({"msg":"Order placed"})


def get_orders(request,email):

    items = Order.objects.filter(buyer_email=email)

    return JsonResponse(
        OrderSerializer(items,many=True).data,
        safe=False
    )


# PRODUCTS

@csrf_exempt
def add_product(request):

    if request.method=="POST":

        data = json.loads(request.body)
        name = (data.get("name") or "").strip()
        price = data.get("price")
        farmer_email = (data.get("farmer_email") or "").strip().lower()
        quantity = data.get("quantity")

        if not name or not farmer_email:
            return JsonResponse({"error":"Name and farmer_email are required"},status=400)

        try:
            Product.objects.create(
                name=name,
                price=price,
                farmer_email=farmer_email
            )
        except DatabaseError:
            collection = _get_mongo_products_collection()
            doc = {
                "name": name,
                "price": price,
                "farmer_email": farmer_email
            }
            if quantity is not None:
                doc["quantity"] = quantity
            collection.insert_one(doc)

        return JsonResponse({"msg":"Product added"})


def get_products(request):

    try:
        items = Product.objects.all()
        return JsonResponse(
            ProductSerializer(items,many=True).data,
            safe=False
        )
    except DatabaseError:
        collection = _get_mongo_products_collection()
        docs = list(collection.find({}))
        results = []
        for doc in docs:
            results.append({
                "id": str(doc.get("_id")),
                "name": doc.get("name"),
                "price": doc.get("price"),
                "farmer_email": doc.get("farmer_email"),
                "quantity": doc.get("quantity")
            })
        return JsonResponse(results, safe=False)


def get_farmer_products(request,email):

    email = (email or "").strip().lower()

    try:
        items = Product.objects.filter(farmer_email=email)
        return JsonResponse(
            ProductSerializer(items,many=True).data,
            safe=False
        )
    except DatabaseError:
        collection = _get_mongo_products_collection()
        docs = list(collection.find({"farmer_email": email}))
        results = []
        for doc in docs:
            results.append({
                "id": str(doc.get("_id")),
                "name": doc.get("name"),
                "price": doc.get("price"),
                "farmer_email": doc.get("farmer_email"),
                "quantity": doc.get("quantity")
            })
        return JsonResponse(results, safe=False)


@csrf_exempt
def admin_delete_product(request):

    if request.method=="DELETE":

        data = json.loads(request.body)
        product_id = (data.get("id") or "").strip()

        if not product_id:
            return JsonResponse({"error":"id is required"},status=400)

        try:
            Product.objects.filter(id=product_id).delete()
        except DatabaseError:
            collection = _get_mongo_products_collection()
            try:
                collection.delete_one({"_id": ObjectId(product_id)})
            except Exception:
                collection.delete_one({"_id": product_id})

        return JsonResponse({"msg":"Product deleted"})


@csrf_exempt
def remove_wishlist_item(request):

    if request.method=="DELETE":

        data = json.loads(request.body)
        item_id = (data.get("id") or "").strip()

        if not item_id:
            return JsonResponse({"error":"id is required"},status=400)

        try:
            Wishlist.objects.filter(id=item_id).delete()
        except DatabaseError:
            collection = _get_mongo_collection().database["users_wishlist"]
            try:
                collection.delete_one({"_id": ObjectId(item_id)})
            except Exception:
                collection.delete_one({"_id": item_id})

        return JsonResponse({"msg":"Wishlist item removed"})
