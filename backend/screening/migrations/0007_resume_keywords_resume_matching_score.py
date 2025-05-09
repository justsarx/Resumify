# Generated by Django 5.1.6 on 2025-04-13 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('screening', '0006_alter_resume_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='resume',
            name='keywords',
            field=models.TextField(blank=True, help_text='Comma-separated list of skills and keywords extracted from resume', null=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='matching_score',
            field=models.FloatField(blank=True, help_text='Score indicating how well this resume matches a job', null=True),
        ),
    ]
