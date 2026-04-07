from rest_framework import serializers
from .models import Member, Book, Loan


class MemberSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Member
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'email', 
            'phone', 
            'password'
            ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 
            'title', 
            'author', 
            'genre', 
            'isbn', 
            'is_available'
            ]


class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = [
            'id', 
            'book', 
            'member', 
            'loaned_at', 
            'due_date', 
            'returned_at', 
            'is_returned'
            ]