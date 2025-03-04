"""
WSGI config for resume_portal project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import django
import logging
import os
from django.core.management import call_command
from django.core.wsgi import get_wsgi_application

try:
    django.setup()
    call_command('migrate', interactive=False)
except Exception as e:
    logging.error("Error during migration: %s", e)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'resume_portal.settings')

application = get_wsgi_application()