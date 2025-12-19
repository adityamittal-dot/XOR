# pylint: disable=import-error
# pyright: reportMissingImports=false


"""
API views for XOR project.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(_request):
    """
    Simple API health check.
    """
    return Response(
        {
            "status": "ok",
            "message": "XOR backend is running"
        }
    )
