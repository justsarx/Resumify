# Generated by Django 5.1.6 on 2025-04-12 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('screening', '0003_alter_resume_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='resume',
            name='job_title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='relevance_score',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='relevance_tips',
            field=models.TextField(blank=True, null=True),
        ),
    ]
