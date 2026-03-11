otp_storage = {}

def save_otp(email, otp):
    otp_storage[email] = otp

def verify_otp(email, otp):
    return otp_storage.get(email) == otp