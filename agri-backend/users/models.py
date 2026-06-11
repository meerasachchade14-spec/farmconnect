from django.db import models


class User(models.Model):

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    role = models.CharField(max_length=20)

    # ✅ NEW FIELDS FOR PROFILE
    name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    aadhar = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)

    # ✅ FARM DETAILS
    farm_type = models.CharField(max_length=100, blank=True, null=True)
    main_crop = models.CharField(max_length=100, blank=True, null=True)
    farm_size = models.CharField(max_length=50, blank=True, null=True)

    # ✅ MEMBER SINCE
    from django.utils import timezone 
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.email


class Product(models.Model):

    name = models.CharField(max_length=100)
    price = models.IntegerField()
    farmer_email = models.EmailField()

    def __str__(self):
        return self.name


class Order(models.Model):

    product_name = models.CharField(max_length=100)
    buyer_email = models.EmailField()
    quantity = models.IntegerField()
    status = models.CharField(max_length=50, default="Pending")


class Cart(models.Model):

    buyer_email = models.EmailField()
    product_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)


class Wishlist(models.Model):

    buyer_email = models.EmailField()
    product_name = models.CharField(max_length=100)