# Generated by Django 5.1.6 on 2025-04-12 17:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('screening', '0004_resume_job_title_resume_relevance_score_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='resume',
            options={'ordering': ['-upload_date'], 'verbose_name': 'Resume', 'verbose_name_plural': 'Resumes'},
        ),
        migrations.CreateModel(
            name='JobPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(blank=True, max_length=255, null=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('location', models.CharField(max_length=255)),
                ('job_type', models.CharField(choices=[('FT', 'Full-Time'), ('PT', 'Part-Time'), ('CT', 'Contract'), ('FL', 'Freelance'), ('IN', 'Internship')], default='FT', max_length=2)),
                ('salary_range', models.CharField(blank=True, help_text='e.g., 50,000 - 70,000 USD', max_length=100, null=True)),
                ('skills_required', models.TextField(help_text='Comma-separated list of skills like Python, SQL, Excel')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_posts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Job Post',
                'verbose_name_plural': 'Job Posts',
                'ordering': ['-created_at'],
            },
        ),
    ]
