from django.db import models

class User(models.Model):

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    role = models.CharField(max_length=20)

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
    status = models.CharField(max_length=50,default="Pending")


class Cart(models.Model):

    buyer_email = models.EmailField()
    product_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)


class Wishlist(models.Model):

    buyer_email = models.EmailField()
    product_name = models.CharField(max_length=100)