from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['farmconnect_db']

retained_emails = ['meerasachchade14@gmail.com', 'milonipandya702@gmail.com', 'meera.ldrp.7@gmail.com']

res_users = db.users.delete_many({'email': {'$nin': retained_emails}})
print(f'Deleted {res_users.deleted_count} users')

res_prods = db.products.delete_many({'farmer_email': {'$ne': 'meerasachchade14@gmail.com'}})
print(f'Deleted {res_prods.deleted_count} products')

res_orders = db.orders.delete_many({
    '$nor': [
        {'buyer_email': 'milonipandya702@gmail.com'},
        {'farmer_email': 'meerasachchade14@gmail.com'}
    ]
})
print(f'Deleted {res_orders.deleted_count} orders')

res_cart = db.cart.delete_many({'buyer_email': {'$ne': 'milonipandya702@gmail.com'}})
print(f'Deleted {res_cart.deleted_count} cart items')

res_wishlist = db.wishlist.delete_many({'buyer_email': {'$ne': 'milonipandya702@gmail.com'}})
print(f'Deleted {res_wishlist.deleted_count} wishlist items')
