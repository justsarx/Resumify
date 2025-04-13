from django.contrib import admin

# Register your models here.
from .models import Resume, JobPost

class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id','candidate_name', 'email','score')

class JobPostAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'employer', 'created_at')
    
# Register your models here.

admin.site.register(Resume, ResumeAdmin)
admin.site.register(JobPost)
