from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Expense, Category, Budget
from .serializers import ExpenseSerializer, CategorySerializer, BudgetSerializer
from django.db.models import Sum, Max
from django.db.models.functions import TruncMonth, TruncDay
from django.utils import timezone
from datetime import timedelta

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Expense.objects.filter(user=self.request.user)
        # optional filters
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        if start:
            qs = qs.filter(incurred_at__date__gte=start)
        if end:
            qs = qs.filter(incurred_at__date__lte=end)
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category_id=cat)
        return qs

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        six_months_ago = now - timedelta(days=180)
        qs = Expense.objects.filter(user=user, incurred_at__gte=six_months_ago)

        # monthly totals last 6 months
        monthly = qs.annotate(month=TruncMonth('incurred_at')).values('month').annotate(total=Sum('amount')).order_by('month')
        monthly_data = [{'month': m['month'].strftime('%Y-%m'), 'total': float(m['total'] or 0)} for m in monthly]

        # category breakdown last 30 days
        thirty_ago = now - timedelta(days=30)
        cat_qs = Expense.objects.filter(user=user, incurred_at__gte=thirty_ago).values('category__name').annotate(total=Sum('amount')).order_by('-total')
        categories = [{'category': c['category__name'] or 'Uncategorized', 'total': float(c['total'] or 0)} for c in cat_qs]

        # daily trend last 30 days
        daily_qs = Expense.objects.filter(user=user, incurred_at__gte=thirty_ago).annotate(day=TruncDay('incurred_at')).values('day').annotate(total=Sum('amount')).order_by('day')
        daily = [{'date': d['day'].strftime('%Y-%m-%d'), 'total': float(d['total'] or 0)} for d in daily_qs]

        # top category in last 30 days
        top = categories[0] if categories else None

        # percent change: compare sum of last 30 days vs previous 30 days
        prev_start = thirty_ago - timedelta(days=30)
        prev_sum = Expense.objects.filter(user=user, incurred_at__range=(prev_start, thirty_ago)).aggregate(total=Sum('amount'))['total'] or 0
        curr_sum = Expense.objects.filter(user=user, incurred_at__gte=thirty_ago).aggregate(total=Sum('amount'))['total'] or 0
        percent_change = None
        if prev_sum:
            percent_change = round(((curr_sum - prev_sum) / prev_sum) * 100, 2)
        elif curr_sum:
            percent_change = 100.0

        # peak day last 30 days
        peak = None
        if daily:
            peak = max(daily, key=lambda x: x['total'])

        # budgets status (active budgets that overlap with today)
        today = now.date()
        budgets = Budget.objects.filter(user=user, start_date__lte=today, end_date__gte=today)
        budget_data = []
        for b in budgets:
            total = Expense.objects.filter(user=user, category=b.category, incurred_at__date__range=(b.start_date, b.end_date)).aggregate(total=Sum('amount'))['total'] or 0
            budget_data.append({
                'budget_id': b.id,
                'category': b.category.name if b.category else 'All',
                'amount': float(b.amount),
                'spent': float(total),
                'remaining': float(max(0, b.amount - total)),
                'exceeded': float(max(0, total - b.amount))
            })

        return Response({
            'monthly': monthly_data,
            'category_breakdown': categories,
            'daily_trend': daily,
            'top_category': top,
            'percent_change_30d': percent_change,
            'peak_day_30d': peak,
            'budgets': budget_data
        })
