from django.contrib import admin
from .models import Member, Book, Loan
# Register your models here.

admin.site.register(Member)
admin.site.register(Book)
admin.site.register(Loan)