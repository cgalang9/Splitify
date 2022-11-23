from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id')), nullable=False)
    description = db.Column(db.String(40), nullable=False)
    total = db.Column(db.Float, nullable=False)
    date_paid = db.Column(db.DateTime, nullable=False, default=date.today())

    payer = db.relationship('User', back_populates='expenses')
    group = db.relationship('Group', back_populates='expenses')
    users_expenses = db.relationship('UsersExpenses', back_populates='expense')
    # expense_comments = db.relationship('ExpenseComment', back_populates='expense', cascade="all, delete-orphan")
