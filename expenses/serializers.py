from rest_framework import serializers
from .models import Expense, Category, Budget
from django.utils import timezone

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id','name')

class ExpenseSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(write_only=True, source='category', queryset=Category.objects.all(), required=False, allow_null=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Expense
        fields = ('id','amount','note','incurred_at','created_at','category','category_id')

    def validate_incurred_at(self, value):
        if value > timezone.now():
            raise serializers.ValidationError("cannot set future date")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('id','amount','start_date','end_date','category')
