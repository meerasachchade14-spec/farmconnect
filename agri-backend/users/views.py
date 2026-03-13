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


def _get_mongo_orders_collection():
    db_cfg = settings.DATABASES.get("default", {})
    db_name = db_cfg.get("NAME")
    host = db_cfg.get("CLIENT", {}).get("host")
    if not db_name or not host:
        raise Exception("MongoDB settings are not configured")
    client = MongoClient(host)
    return client[db_name]["users_order"]


def _get_mongo_cart_collection():
    db_cfg = settings.DATABASES.get("default", {})
    db_name = db_cfg.get("NAME")
    host = db_cfg.get("CLIENT", {}).get("host")
    if not db_name or not host:
        raise Exception("MongoDB settings are not configured")
    client = MongoClient(host)
    return client[db_name]["users_cart"]


def _get_mongo_wishlist_collection():
    db_cfg = settings.DATABASES.get("default", {})
    db_name = db_cfg.get("NAME")
    host = db_cfg.get("CLIENT", {}).get("host")
    if not db_name or not host:
        raise Exception("MongoDB settings are not configured")
    client = MongoClient(host)
    return client[db_name]["users_wishlist"]


def _normalize_user_doc(doc):
    return {
        "email": doc.get("email"),
        "name": doc.get("name") or "",
        "phone": doc.get("phone") or "",
        "role": doc.get("role") or "",
        "status": doc.get("status") or "Pending",
        "avatar_url": doc.get("avatar_url") or ""
    }


def landing_overview(request):
    users = _get_mongo_collection()
    products = _get_mongo_products_collection()
    orders = _get_mongo_orders_collection()

    pending_farmers = users.count_documents({"role": "farmer", "status": "Pending"})
    approved_farmers = users.count_documents({"role": "farmer", "status": "Approved"})

    total_farmers = users.count_documents({"role": "farmer"})
    total_buyers = users.count_documents({"role": "buyer"})
    total_products = products.count_documents({})
    total_orders = orders.count_documents({})

    recent_products = []
    for doc in products.find({}).sort("_id", -1).limit(8):
        recent_products.append({
            "id": str(doc.get("_id")),
            "name": doc.get("name"),
            "price": doc.get("price"),
            "quantity": doc.get("quantity")
        })

    return JsonResponse({
        "farmers": {
            "pending": pending_farmers,
            "approved": approved_farmers,
            "total": total_farmers
        },
        "products": {
            "total": total_products,
            "items": recent_products
        },
        "stats": {
            "farmers": total_farmers,
            "buyers": total_buyers,
            "products": total_products,
            "orders": total_orders
        }
    })


@csrf_exempt
def register_user(request):

    if request.method=="POST":

        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        role = (data.get("role") or "").strip()
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()

        if not email or not password or not role:
            return JsonResponse({"error":"Email, password, and role are required"},status=400)
        if role == "admin":
            return JsonResponse({"error":"Admin registration is not allowed"},status=403)

        collection = _get_mongo_collection()
        if collection.find_one({"email": email}):
            return JsonResponse({"error":"User exists"},status=400)

        status = "Pending"
        avatar_url = data.get("avatar_url") or ""
        if not avatar_url:
            if role == "farmer":
                avatar_url = "https://img.freepik.com/premium-photo/indian-farmer-standing-agriculture-field_75648-1795.jpg"
            elif role == "buyer":
                avatar_url = "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1709390585~exp=1709391185~hmac=7fa0a0fdaeb2e581fa32a22709bcf93e7cf116c451688f44e6d67844cd5a2c33"

        try:
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error":"User exists"},status=400)
            User.objects.create(
                email=email,
                password=password,
                role=role
            )
        except DatabaseError:
            pass

        # Always upsert extra profile fields into Mongo
        collection.update_one(
            {"email": email},
            {"$setOnInsert": {"email": email, "password": password, "role": role},
             "$set": {"name": name, "phone": phone, "status": status, "avatar_url": avatar_url}},
            upsert=True
        )

        otp = _generate_otp()
        _store_otp(email, otp)

        sent, email_error = send_otp_email(email, otp)

        response = {"msg":"Registration successful. OTP sent."}
        if not sent:
            response = {"msg":"Registration successful, but failed to send OTP email.","email_error":email_error}
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

        collection = _get_mongo_collection()
        doc = collection.find_one({"email": email})
        if doc:
            if doc.get("password") != password:
                return JsonResponse({"error":"Invalid login"},status=400)
            return JsonResponse({
                "email": doc.get("email"),
                "role": doc.get("role"),
                "name": doc.get("name") or "",
                "phone": doc.get("phone") or "",
                "status": doc.get("status") or "Pending",
                "avatar_url": doc.get("avatar_url") or ""
            })

        try:
            user = User.objects.get(email=email)
            if user.password != password:
                return JsonResponse({"error":"Invalid login"},status=400)
            return JsonResponse({
                "email":user.email,
                "role":user.role
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

        sent, email_error = send_otp_email(email, otp)

        response = {"msg":"OTP sent"}
        if not sent:
            response = {"msg":"Failed to send OTP email.","email_error":email_error}
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

    buyer_email = data.get("buyer_email")
    product_name = data.get("product_name")
    quantity = data.get("quantity")

    try:
        Cart.objects.create(
            buyer_email=buyer_email,
            product_name=product_name,
            quantity=quantity
        )
    except DatabaseError:
        pass

    cart_collection = _get_mongo_cart_collection()
    cart_collection.insert_one({
        "buyer_email": buyer_email,
        "product_name": product_name,
        "quantity": quantity
    })

    return JsonResponse({"msg":"Added"})


def get_cart(request,email):

    cart_collection = _get_mongo_cart_collection()
    docs = list(cart_collection.find({"buyer_email": email}))
    results = []
    for doc in docs:
        results.append({
            "id": str(doc.get("_id")),
            "buyer_email": doc.get("buyer_email"),
            "product_name": doc.get("product_name"),
            "quantity": doc.get("quantity")
        })
    return JsonResponse(results, safe=False)


# WISHLIST

@csrf_exempt
def add_to_wishlist(request):

    data = json.loads(request.body)

    buyer_email = data.get("buyer_email")
    product_name = data.get("product_name")

    try:
        Wishlist.objects.create(
            buyer_email=buyer_email,
            product_name=product_name
        )
    except DatabaseError:
        pass

    wishlist_collection = _get_mongo_wishlist_collection()
    wishlist_collection.insert_one({
        "buyer_email": buyer_email,
        "product_name": product_name
    })

    return JsonResponse({"msg":"Wishlist added"})


def get_wishlist(request,email):

    wishlist_collection = _get_mongo_wishlist_collection()
    docs = list(wishlist_collection.find({"buyer_email": email}))
    results = []
    for doc in docs:
        results.append({
            "id": str(doc.get("_id")),
            "buyer_email": doc.get("buyer_email"),
            "product_name": doc.get("product_name")
        })
    return JsonResponse(results, safe=False)


# ORDER

@csrf_exempt
def place_order(request):

    data = json.loads(request.body)

    product_name = data.get("product_name")
    buyer_email = data.get("buyer_email")
    quantity = data.get("quantity")
    farmer_email = data.get("farmer_email")

    if not farmer_email and product_name:
        try:
            product = Product.objects.filter(name=product_name).first()
            if product:
                farmer_email = product.farmer_email
        except Exception:
            pass
        if not farmer_email:
            try:
                products_collection = _get_mongo_products_collection()
                doc = products_collection.find_one({"name": product_name})
                if doc:
                    farmer_email = doc.get("farmer_email")
            except Exception:
                pass

    if not buyer_email or not product_name:
        return JsonResponse({"error":"buyer_email and product_name are required"},status=400)

    try:
        Order.objects.create(
            product_name=product_name,
            buyer_email=buyer_email,
            quantity=quantity,
            status=data.get("status", "Pending")
        )
    except DatabaseError:
        pass

    # Always write to Mongo for reliable reads in admin/farmer views
    orders_collection = _get_mongo_orders_collection()
    orders_collection.insert_one({
        "product_name": product_name,
        "buyer_email": buyer_email,
        "quantity": quantity,
        "status": data.get("status", "Pending"),
        "farmer_email": farmer_email
    })

    return JsonResponse({"msg":"Order placed"})


def get_orders(request,email):

    orders_collection = _get_mongo_orders_collection()
    docs = list(orders_collection.find({"buyer_email": email}))
    results = []
    for doc in docs:
        results.append({
            "id": str(doc.get("_id")),
            "product_name": doc.get("product_name"),
            "buyer_email": doc.get("buyer_email"),
            "quantity": doc.get("quantity"),
            "status": doc.get("status") or "Pending"
        })
    return JsonResponse(results, safe=False)


def get_farmer_orders(request, email):

    email = (email or "").strip().lower()
    orders_collection = _get_mongo_orders_collection()
    docs = list(orders_collection.find({"farmer_email": email}).sort("_id", -1))
    results = []
    for doc in docs:
        results.append({
            "id": str(doc.get("_id")),
            "product_name": doc.get("product_name"),
            "buyer_email": doc.get("buyer_email"),
            "quantity": doc.get("quantity"),
            "status": doc.get("status") or "Pending"
        })
    return JsonResponse(results, safe=False)


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
            pass

        collection = _get_mongo_wishlist_collection()
        try:
            collection.delete_one({"_id": ObjectId(item_id)})
        except Exception:
            collection.delete_one({"_id": item_id})

        return JsonResponse({"msg":"Wishlist item removed"})


# ADMIN

def admin_overview(request):
    # Counts + recent orders/products
    collection = _get_mongo_collection()
    products_collection = _get_mongo_products_collection()
    orders_collection = _get_mongo_orders_collection()

    farmers_count = collection.count_documents({"role": "farmer"})
    buyers_count = collection.count_documents({"role": "buyer"})
    products_count = products_collection.count_documents({})
    orders_count = orders_collection.count_documents({})

    recent_orders = []
    for doc in orders_collection.find({}).sort("_id", -1).limit(5):
        recent_orders.append({
            "id": str(doc.get("_id")),
            "buyer_email": doc.get("buyer_email"),
            "farmer_email": doc.get("farmer_email"),
            "product_name": doc.get("product_name"),
            "quantity": doc.get("quantity"),
            "status": doc.get("status") or "Pending"
        })

    recent_products = []
    for doc in products_collection.find({}).sort("_id", -1).limit(10):
        recent_products.append({
            "id": str(doc.get("_id")),
            "name": doc.get("name"),
            "price": doc.get("price"),
            "farmer_email": doc.get("farmer_email")
        })

    return JsonResponse({
        "counts": {
            "farmers": farmers_count,
            "buyers": buyers_count,
            "orders": orders_count,
            "products": products_count
        },
        "recent_orders": recent_orders,
        "recent_products": recent_products
    })


def admin_users(request, role):
    collection = _get_mongo_collection()
    docs = list(collection.find({"role": role}))
    users = [_normalize_user_doc(doc) for doc in docs]
    return JsonResponse(users, safe=False)


@csrf_exempt
@csrf_exempt
def admin_update_user_status(request):
    if request.method in ["PATCH", "POST"]:
        data = json.loads(request.body)
        email = (data.get("email") or "").strip().lower()
        status = (data.get("status") or "").strip()
        if not email or not status:
            return JsonResponse({"error":"email and status are required"},status=400)
        collection = _get_mongo_collection()
        result = collection.update_one({"email": email}, {"$set": {"status": status}})
        if result.matched_count == 0:
            return JsonResponse({"error":"User not found"},status=404)
        return JsonResponse({"msg":"Status updated"})


def admin_orders(request):
    orders_collection = _get_mongo_orders_collection()
    docs = list(orders_collection.find({}).sort("_id", -1))
    orders = []
    for doc in docs:
        orders.append({
            "id": str(doc.get("_id")),
            "buyer_email": doc.get("buyer_email"),
            "farmer_email": doc.get("farmer_email"),
            "product_name": doc.get("product_name"),
            "quantity": doc.get("quantity"),
            "status": doc.get("status") or "Pending"
        })
    return JsonResponse(orders, safe=False)


@csrf_exempt
def admin_update_order_status(request):
    if request.method == "PATCH":
        data = json.loads(request.body)
        order_id = (data.get("id") or "").strip()
        status = (data.get("status") or "").strip()
        if not order_id or not status:
            return JsonResponse({"error":"id and status are required"},status=400)
        orders_collection = _get_mongo_orders_collection()
        try:
            result = orders_collection.update_one(
                {"_id": ObjectId(order_id)},
                {"$set": {"status": status}}
            )
        except Exception:
            result = orders_collection.update_one(
                {"_id": order_id},
                {"$set": {"status": status}}
            )
        if result.matched_count == 0:
            return JsonResponse({"error":"Order not found"},status=404)
        return JsonResponse({"msg":"Order status updated"})


# PROFILE

def get_user_profile(request, email):
    email = (email or "").strip().lower()
    collection = _get_mongo_collection()
    doc = collection.find_one({"email": email})
    if not doc:
        return JsonResponse({"error":"User not found"},status=404)
    profile = {
        "email": doc.get("email"),
        "name": doc.get("name") or "",
        "phone": doc.get("phone") or "",
        "role": doc.get("role") or "",
        "status": doc.get("status") or "Pending",
        "avatar_url": doc.get("avatar_url") or "",
        "address": doc.get("address") or "",
        "dob": doc.get("dob") or "",
        "gender": doc.get("gender") or "",
        "aadhar": doc.get("aadhar") or "",
        "bank": doc.get("bank") or "",
        "ifsc": doc.get("ifsc") or "",
        "company": doc.get("company") or "",
        "buyer_type": doc.get("buyer_type") or ""
    }
    return JsonResponse(profile)


@csrf_exempt
def update_user_profile(request, email):
    if request.method == "PUT":
        email = (email or "").strip().lower()
        data = json.loads(request.body)
        allowed_fields = [
            "name","phone","avatar_url","address","dob","gender",
            "aadhar","bank","ifsc","company","buyer_type"
        ]
        updates = {}
        for field in allowed_fields:
            if field in data:
                updates[field] = data.get(field)
        if not updates:
            return JsonResponse({"error":"No fields to update"},status=400)
        collection = _get_mongo_collection()
        result = collection.update_one({"email": email}, {"$set": updates})
        if result.matched_count == 0:
            return JsonResponse({"error":"User not found"},status=404)
        return JsonResponse({"msg":"Profile updated"})
