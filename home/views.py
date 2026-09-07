import random

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

QUOTES = [
    "Stay hungry, stay foolish.",
    "Code is like humor. When you have to explain it, it's bad.",
    "Simplicity is the soul of efficiency.",
    "First, solve the problem. Then, write the code.",
]


@api_view(["GET"])
@permission_classes([AllowAny])
def user_quote(request):
    user = request.user

    return Response(
        {
            "email": user.email if user.is_authenticated else None,
            "quote": random.choice(QUOTES),
        }
    )
