from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class ExpenseComment(db.Model):
    __tablename__ = 'expense_comment'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)
    text = db.Column(db.String(50), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.now())

    user = db.relationship('User', back_populates='expense_comments')
    expense = db.relationship('Expense', back_populates='expense_comments')
