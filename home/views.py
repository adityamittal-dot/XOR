import random
from rest_framework.decorators import api_view
from rest_framework.response import Response

QUOTES = [
    "Stay hungry, stay foolish.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "Simplicity is the soul of efficiency.",
    "First, solve the problem. Then, write the code.",
]

@api_view(["GET"])
def user_quote(request):
    user = request.user

    return Response({
        "username": user.username if user.is_authenticated else "Guest",
        "quote": random.choice(QUOTES),
    })