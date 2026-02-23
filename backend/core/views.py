from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "service": "SpendSense API",
        "status": "running",
        "docs": "/swagger/"
    })
