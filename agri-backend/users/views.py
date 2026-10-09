import json
import random
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from bson import ObjectId
from .email_utils import send_otp_email

# ================= MONGODB =================

client = MongoClient("mongodb://localhost:27017/")
db = client["farmconnect_db"]

users_col = db["users"]
products_col = db["products"]
orders_col = db["orders"]
cart_col = db["cart"]
wishlist_col = db["wishlist"]
payments_col = db["payments"]

# Enforce unique email at the database level
users_col.create_index("email", unique=True)

# Ensure admin account exists
ADMIN_EMAIL = "meera.ldrp.7@gmail.com"
if not users_col.find_one({"email": ADMIN_EMAIL}):
    users_col.insert_one({
        "email": ADMIN_EMAIL,
        "password": "admin",
        "role": "admin",
        "name": "Admin",
        "status": "Approved"
    })

# ================= OTP =================

OTP_STORE = {}
OTP_TTL = 600


def generate_otp():
    return str(random.randint(100000, 999999))


def store_otp(email, otp):
    OTP_STORE[email] = {
        "otp": otp,
        "expiry": time.time() + OTP_TTL
    }


def verify_otp_logic(email, otp):

    data = OTP_STORE.get(email)

    if not data:
        return False

    if time.time() > data["expiry"]:
        OTP_STORE.pop(email, None)
        return False

    return data["otp"] == otp


# ================= AUTH =================

@csrf_exempt
def register_user(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    data = json.loads(request.body)

    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    role = (data.get("role") or "").strip()

    if not email or not password or not role:
        return JsonResponse({
            "error": "Email, password and role required"
        }, status=400)

    if role == "admin":
        return JsonResponse({
            "error": "Admin registration is not allowed"
        }, status=403)

    if email == "meera.ldrp.7@gmail.com":
        return JsonResponse({
            "error": "Admin email cannot be used for normal registration"
        }, status=403)

    existing_user = users_col.find_one({"email": email})

    if existing_user:
        return JsonResponse({
            "error": "This email is already registered. Please login instead."
        }, status=400)

    user_data = {
        "email": email,
        "password": password,
        "role": role,
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "status": "Pending",

        # PROFILE DATA
        "address": "",
        "gender": "",
        "dob": "",
        "farm_type": "",
        "farm_size": "",
        "main_crop": "",
        "avatar_url": "",

        # LOCATION
        "location_enabled": False,

        # MEMBER SINCE
        "member_since": time.strftime("%d %b %Y")
    }

    users_col.insert_one(user_data)

    otp = generate_otp()
    store_otp(email, otp)

    try:
        send_otp_email(email, otp)
    except Exception as e:
        users_col.delete_one({"email": email})
        return JsonResponse({
            "error": "Failed to connect to OTP system / OTP system is closed."
        }, status=500)

    return JsonResponse({
        "msg": "Registered successfully. Please check your email for the OTP."
    })


@csrf_exempt
def login_user(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    data = json.loads(request.body)

    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return JsonResponse({
            "error": "Email and password required"
        }, status=400)

    user = users_col.find_one({
        "email": email
    })

    if not user:
        return JsonResponse({
            "error": "User not found"
        }, status=404)

    saved_password = str(user.get("password", "")).strip()

    if saved_password != password:
        return JsonResponse({
            "error": "Invalid password"
        }, status=400)

    return JsonResponse({
        "msg": "Login successful",
        "email": user.get("email", ""),
        "role": user.get("role", ""),
        "name": user.get("name", ""),
        "status": user.get("status", ""),
        "member_since": user.get("member_since", "")
    })


@csrf_exempt
def verify_otp(request):

    data = json.loads(request.body)

    email = (data.get("email") or "").strip().lower()
    otp = (data.get("otp") or "").strip()

    if verify_otp_logic(email, otp):
        return JsonResponse({
            "msg": "OTP verified"
        })

    return JsonResponse({
        "error": "Invalid OTP"
    }, status=400)


@csrf_exempt
def forgot_password(request):

    data = json.loads(request.body)

    email = (data.get("email") or "").strip().lower()

    user = users_col.find_one({
        "email": email
    })

    if not user:
        return JsonResponse({
            "error": "User not found"
        }, status=404)

    otp = generate_otp()

    store_otp(email, otp)

    try:
        send_otp_email(email, otp)
    except Exception as e:
        return JsonResponse({
            "error": "Failed to connect to OTP system / OTP system is closed."
        }, status=500)

    return JsonResponse({
        "msg": "OTP sent. Please check your email."
    })


@csrf_exempt
def reset_password(request):

    data = json.loads(request.body)

    email = (data.get("email") or "").strip().lower()
    otp = (data.get("otp") or "").strip()
    password = (data.get("password") or "").strip()

    if not verify_otp_logic(email, otp):
        return JsonResponse({
            "error": "Invalid OTP"
        }, status=400)

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "password": password
            }
        }
    )

    return JsonResponse({
        "msg": "Password reset successful"
    })


# ================= CART =================

@csrf_exempt
def add_to_cart(request):

    data = json.loads(request.body)

    cart_data = {

        "buyer_email":
        data.get("buyer_email", ""),

        "product_name":
        data.get("product_name", ""),

        "quantity":
        data.get("quantity", 1),

        "price":
        data.get("price", 0),

        "farmer_email":
        data.get("farmer_email", "")

    }

    cart_col.insert_one(cart_data)

    return JsonResponse({
        "msg": "Added to cart"
    })

def get_cart(request, email):

    docs = list(cart_col.find({
        "buyer_email": email
    }))

    result = []

    for d in docs:

        result.append({
            "id": str(d["_id"]),
            "product_name": d.get("product_name", ""),
            "quantity": d.get("quantity", 1),
            "price": d.get("price", ""),
            "buyer_email": d.get("buyer_email", ""),
            "farmer_email": d.get("farmer_email", "")
        })

    return JsonResponse(result, safe=False)


def get_farmer_cart_items(request, email):

    docs = list(cart_col.find())

    result = []

    for d in docs:

        result.append({
            "id": str(d["_id"]),
            "product_name": d.get("product_name", ""),
            "quantity": d.get("quantity", 1),
            "price": d.get("price", ""),
            "buyer_email": d.get("buyer_email", "")
        })

    return JsonResponse(result, safe=False)


# ================= WISHLIST =================

@csrf_exempt
def add_to_wishlist(request):

    data = json.loads(request.body)

    wishlist_col.insert_one(data)

    return JsonResponse({
        "msg": "Added to wishlist"
    })


def get_wishlist(request, email):

    docs = list(wishlist_col.find({
        "buyer_email": email
    }))

    result = []

    for d in docs:

        result.append({
            "id": str(d["_id"]),
            "product_name": d.get("product_name", "")
        })

    return JsonResponse(result, safe=False)


@csrf_exempt
def remove_wishlist_item(request):

    data = json.loads(request.body)

    wishlist_col.delete_one({
        "_id": ObjectId(data.get("id"))
    })

    return JsonResponse({
        "msg": "Removed"
    })


def remove_wishlist_item_by_id(request, item_id):

    wishlist_col.delete_one({
        "_id": ObjectId(item_id)
    })

    return JsonResponse({
        "msg": "Removed"
    })


# ================= PRODUCTS =================

@csrf_exempt
def add_product(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "POST method required"
        }, status=405)

    from django.core.files.storage import FileSystemStorage

    data = request.POST

    required_fields = [
        "name",
        "price",
        "quantity",
        "farmer_email"
    ]

    for field in required_fields:
        value = str(data.get(field, "")).strip()
        if value == "":
            return JsonResponse({
                "error": f"{field} is required"
            }, status=400)

    # Handle image upload
    image_url = ""
    if 'image' in request.FILES:
        image_file = request.FILES['image']
        fs = FileSystemStorage(location='media/products/')
        filename = fs.save(image_file.name, image_file)
        image_url = f"http://127.0.0.1:8000/media/products/{filename}"

    products_col.insert_one({
        "name": data.get("name"),
        "price": data.get("price"),
        "quantity": data.get("quantity"),
        "farmer_email": data.get("farmer_email"),
        "description": data.get("description", ""),
        "image": image_url,
        "created_at": time.strftime("%d %b %Y")
    })

    return JsonResponse({
        "msg": "Product added"
    })


def get_products(request):

    docs = list(products_col.find())

    result = []

    for d in docs:

        result.append({
            "id": str(d["_id"]),
            "name": d.get("name", ""),
            "price": d.get("price", ""),
            "quantity": d.get("quantity", ""),
            "description": d.get("description", ""),
            "image": d.get("image", ""),
            "farmer_email": d.get("farmer_email", "")
        })

    return JsonResponse(result, safe=False)


def get_farmer_products(request, email):

    docs = list(products_col.find({
        "farmer_email": email
    }))

    result = []

    for d in docs:

        result.append({
            "id": str(d["_id"]),
            "name": d.get("name", ""),
            "price": d.get("price", ""),
            "quantity": d.get("quantity", ""),
            "description": d.get("description", ""),
            "image": d.get("image", "")
        })

    return JsonResponse(result, safe=False)


@csrf_exempt
def admin_delete_product(request):

    data = json.loads(request.body)

    products_col.delete_one({
        "_id": ObjectId(data.get("id"))
    })

    return JsonResponse({
        "msg": "Deleted"
    })


# ================= ORDERS =================

@csrf_exempt
def place_order(request):

    data = json.loads(request.body)

    orders_col.insert_one(data)

    return JsonResponse({
        "msg": "Order placed"
    })


def get_orders(request, email):

    docs = list(orders_col.find({
        "buyer_email": email
    }))

    result = []

    for d in docs:

        d["id"] = str(d["_id"])
        d.pop("_id", None)

        result.append(d)

    return JsonResponse(result, safe=False)


def get_farmer_orders(request, email):

    docs = list(
        orders_col.find({
            "farmer_email": email
        }).sort("_id", -1)
    )

    result = []

    for d in docs:

        result.append({

            "id": str(d["_id"]),

            "product_name":
            d.get("product_name", ""),

            "buyer_email":
            d.get("buyer_email", ""),

            "farmer_email":
            d.get("farmer_email", ""),

            "quantity":
            d.get("quantity", 1),

            "amount":
            d.get("amount", ""),

            "payment_method":
            d.get("payment_method", ""),

            "status":
            d.get("status", "Pending"),

            "created_at":
            d.get("created_at", "")

        })

    return JsonResponse(result, safe=False)


# ================= ADMIN =================

def admin_overview(request):

    pending = users_col.count_documents({
        "role": "farmer",
        "status": "Pending"
    })

    approved = users_col.count_documents({
        "role": "farmer",
        "status": "Approved"
    })

    total_farmers = users_col.count_documents({
        "role": "farmer"
    })

    total_buyers = users_col.count_documents({
        "role": "buyer"
    })

    total_products = products_col.count_documents({})
    total_orders = orders_col.count_documents({})

    # Fetch recent orders (top 5)
    recent_docs = list(orders_col.find().sort("_id", -1).limit(5))
    recent_orders = []
    for d in recent_docs:
        d["id"] = str(d["_id"])
        d.pop("_id", None)
        recent_orders.append(d)

    return JsonResponse({

        "farmers": {
            "pending": pending,
            "approved": approved,
            "total": total_farmers
        },

        "stats": {
            "farmers": total_farmers,
            "buyers": total_buyers,
            "products": total_products,
            "orders": total_orders
        },

        "counts": {
            "Farmers": total_farmers,
            "Buyers": total_buyers,
            "Products": total_products,
            "Orders": total_orders
        },

        "recent_orders": recent_orders
    })


def admin_users(request, role):

    docs = list(users_col.find({
        "role": role
    }))

    result = []

    for d in docs:

        d["id"] = str(d["_id"])
        d.pop("_id", None)

        result.append(d)

    return JsonResponse(result, safe=False)

@csrf_exempt
def admin_update_user_status(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "POST method required"
        }, status=405)

    try:

        data = json.loads(request.body)

        email = str(data.get("email", "")).strip().lower()
        status = str(data.get("status", "")).strip()

        if email == "" or status == "":
            return JsonResponse({
                "error": "Email and status required"
            }, status=400)

        # CHECK USER

        user = users_col.find_one({
            "email": email
        })

        if not user:
            return JsonResponse({
                "error": "User not found"
            }, status=404)

        # UPDATE STATUS

        users_col.update_one(
            {
                "email": email
            },
            {
                "$set": {
                    "status": status
                }
            }
        )

        # VERIFY UPDATE

        updated_user = users_col.find_one({
            "email": email
        })

        return JsonResponse({
            "msg": "Status updated successfully",
            "email": updated_user.get("email"),
            "status": updated_user.get("status")
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)

def admin_orders(request):

    docs = list(
        orders_col.find().sort("_id", -1)
    )

    result = []

    for d in docs:

        result.append({

            "id":
            str(d["_id"]),

            "buyer_email":
            d.get("buyer_email", ""),

            "farmer_email":
            d.get("farmer_email", ""),

            "product_name":
            d.get("product_name", ""),

            "quantity":
            d.get("quantity", 1),

            "amount":
            d.get("amount", ""),

            "payment_method":
            d.get("payment_method", ""),

            "status":
            d.get("status", "Pending"),

            "created_at":
            d.get("created_at", "")

        })

    return JsonResponse(result, safe=False)

def admin_cart(request):

    docs = list(cart_col.find())

    result = []

    for d in docs:

        d["id"] = str(d["_id"])
        d.pop("_id", None)

        result.append(d)

    return JsonResponse(result, safe=False)

def admin_wishlist(request):

    docs = list(wishlist_col.find())

    result = []

    for d in docs:

        d["id"] = str(d["_id"])
        d.pop("_id", None)

        result.append(d)

    return JsonResponse(result, safe=False)

@csrf_exempt
def admin_delete_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()

        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        user = users_col.find_one({"email": email})
        if not user:
            return JsonResponse({"error": "User not found"}, status=404)
            
        role = user.get("role")

        # Delete user
        users_col.delete_one({"email": email})

        # Safely handle related data
        if role == "farmer":
            farmer_products = list(products_col.find({"farmer_email": email}))
            product_names = [p.get("name") for p in farmer_products if p.get("name")]
            if product_names:
                wishlist_col.delete_many({"product_name": {"$in": product_names}})

            products_col.delete_many({"farmer_email": email})
            cart_col.delete_many({"farmer_email": email})
            orders_col.delete_many({"farmer_email": email})
        
        if role == "buyer":
            cart_col.delete_many({"buyer_email": email})
            wishlist_col.delete_many({"buyer_email": email})
            orders_col.delete_many({"buyer_email": email})

        return JsonResponse({"msg": "User deleted successfully"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# ================= PROFILE =================

def get_user_profile(request, email):

    user = users_col.find_one({
        "email": email
    })

    if not user:
        return JsonResponse({
            "error": "User not found"
        }, status=404)

    return JsonResponse({
        "id": str(user["_id"]),
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "phone": user.get("phone", ""),
        "status": user.get("status", ""),
        "role": user.get("role", ""),
        "address": user.get("address", ""),
        "gender": user.get("gender", ""),
        "dob": user.get("dob", ""),
        "farm_type": user.get("farm_type", ""),
        "farm_size": user.get("farm_size", ""),
        "main_crop": user.get("main_crop", ""),
        "avatar_url": user.get("avatar_url", ""),
        "location_enabled": user.get("location_enabled", False),
        "member_since": user.get("member_since", "")
    })


@csrf_exempt
def update_user_profile(request, email):

    if request.method != "PUT":
        return JsonResponse({
            "error": "PUT method required"
        }, status=405)

    data = json.loads(request.body)

    user = users_col.find_one({
        "email": email
    })

    if not user:
        return JsonResponse({
            "error": "User not found"
        }, status=404)

    role = user.get("role", "")

    # BUYER REQUIRED FIELDS
    if role == "buyer":

        required_fields = [
            "name",
            "phone",
            "address",
            "gender",
            "dob"
        ]

    # FARMER REQUIRED FIELDS
    else:

        required_fields = [
            "name",
            "phone",
            "address",
            "gender",
            "dob",
            "farm_type",
            "farm_size",
            "main_crop"
        ]

    for field in required_fields:

        value = str(data.get(field, "")).strip()

        if value == "":
            return JsonResponse({
                "error": f"{field} is required"
            }, status=400)

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "name": data.get("name"),
                "phone": data.get("phone"),
                "address": data.get("address"),
                "gender": data.get("gender"),
                "dob": data.get("dob"),
                "farm_type": data.get("farm_type", ""),
                "farm_size": data.get("farm_size", ""),
                "main_crop": data.get("main_crop", ""),
                "avatar_url": data.get("avatar_url", ""),
                "location_enabled": data.get("location_enabled", False)
            }
        }
    )

    return JsonResponse({
        "msg": "Profile updated"
    })


# ================= LANDING =================

def landing_overview(request):

    pending = users_col.count_documents({
        "role": "farmer",
        "status": "Pending"
    })

    approved = users_col.count_documents({
        "role": "farmer",
        "status": "Approved"
    })

    total_farmers = users_col.count_documents({
        "role": "farmer"
    })

    total_buyers = users_col.count_documents({
        "role": "buyer"
    })

    total_products = products_col.count_documents({})
    total_orders = orders_col.count_documents({})

    recent_products = []

    for doc in products_col.find().sort("_id", -1).limit(8):

        recent_products.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "price": doc.get("price", ""),
            "quantity": doc.get("quantity", 0)
        })

    return JsonResponse({

        "farmers": {
            "pending": pending,
            "approved": approved,
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

# ================= PAYMENTS =================

@csrf_exempt
def place_payment(request):

    if request.method != "POST":

        return JsonResponse({
            "error": "POST method required"
        }, status=405)

    try:

        data = json.loads(request.body)

        farmer_email = data.get(
            "farmer_email",
            ""
        )

        product_name = data.get(
            "product_name",
            ""
        )

        # safety fallback

        if not farmer_email:

            product = products_col.find_one({
                "name": product_name
            })

            if product:

                farmer_email = product.get(
                    "farmer_email",
                    ""
                )

        order_data = {

            "buyer_email":
            data.get("buyer_email", ""),

            "farmer_email":
            farmer_email,

            "product_name":
            product_name,

            "quantity":
            data.get("quantity", 1),

            "amount":
            data.get("amount", 0),

            "payment_method":
            data.get("payment_method", "UPI"),

            "status":
            "Pending",

            "created_at":
            time.strftime("%d %b %Y %H:%M")

        }

        payments_col.insert_one(order_data)

        orders_col.insert_one(order_data)

        cart_col.delete_many({

            "buyer_email":
            data.get("buyer_email", ""),

            "product_name":
            product_name

        })

        return JsonResponse({

            "msg":
            "Payment successful and order placed"

        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)

# ================= PAYMENT HISTORY =================

def get_payment_history(request, email):

    payments = list(

        payments_col.find({

            "buyer_email": email

        })

    )

    result = []

    for p in payments:

        result.append({

            "id":
            str(p["_id"]),

            "buyer_email":
            p.get("buyer_email", ""),

            "farmer_email":
            p.get("farmer_email", ""),

            "product_name":
            p.get("product_name", ""),

            "quantity":
            p.get("quantity", 1),

            "amount":
            p.get("amount", ""),

            "payment_method":
            p.get("payment_method", ""),

            "status":
            p.get("status", ""),

            "created_at":
            p.get("created_at", "")

        })

    return JsonResponse(result, safe=False)


# ================= ORDER MANAGEMENT =================

@csrf_exempt
def update_order_status(request):

    if request.method != "POST":

        return JsonResponse({
            "error": "POST method required"
        }, status=405)

    try:

        data = json.loads(request.body)

        order_id = data.get("id")
        status = data.get("status")

        if not order_id or not status:

            return JsonResponse({

                "error":
                "Order id and status required"

            }, status=400)

        orders_col.update_one(

            {
                "_id": ObjectId(order_id)
            },

            {
                "$set": {
                    "status": status
                }
            }

        )

        return JsonResponse({

            "msg":
            "Order status updated"

        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)


# ================= GET ALL ORDERS =================

def get_all_orders(request):

    orders = list(

        orders_col.find().sort("_id", -1)

    )

    result = []

    for o in orders:

        result.append({

            "id":
            str(o["_id"]),

            "buyer_email":
            o.get("buyer_email", ""),

            "farmer_email":
            o.get("farmer_email", ""),

            "product_name":
            o.get("product_name", ""),

            "quantity":
            o.get("quantity", 1),

            "amount":
            o.get("amount", ""),

            "payment_method":
            o.get("payment_method", ""),

            "status":
            o.get("status", "Pending"),

            "created_at":
            o.get("created_at", "")

        })

    return JsonResponse(result, safe=False)

@csrf_exempt
def admin_update_order_status(request):

    if request.method != "POST":

        return JsonResponse({
            "error": "POST method required"
        }, status=405)

    try:

        data = json.loads(request.body)

        order_id = data.get("id")
        status = data.get("status")

        if not order_id or not status:

            return JsonResponse({
                "error": "Order id and status required"
            }, status=400)

        orders_col.update_one(

            {
                "_id": ObjectId(order_id)
            },

            {
                "$set": {
                    "status": status
                }
            }

        )

        return JsonResponse({
            "msg": "Order updated successfully"
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)