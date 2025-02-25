from django.contrib import admin

# Register your models here.
from .models import Resume

class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id','candidate_name', 'email','score')

# Register your models here.

admin.site.register(Resume, ResumeAdmin)