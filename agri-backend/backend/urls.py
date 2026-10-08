from django.contrib import admin
from django.urls import path,include
from users import views as user_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('admin/',admin.site.urls),
    path('api/',include('users.urls')),
    # Backward-compatible auth endpoints (in case clients still hit /login/ or /register/)
    path('login/', user_views.login_user),
    path('register/', user_views.register_user),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
