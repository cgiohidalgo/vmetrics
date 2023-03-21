from django.core.mail import send_mail
from django.conf import settings


class Email:
    def __init__(self, subject, message, toEmail):
        self.subject = subject
        self.message = message
        self.fromEmail = settings.EMAIL_HOST_USER
        self.toEmail = toEmail

    def send_django_mail(self):
        send_mail(
            self.subject,
            self.message,
            self.fromEmail,
            [*self.toEmail],
            fail_silently=False,
        )
