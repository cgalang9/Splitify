from .db import db, environment, SCHEMA, add_prefix_for_prod


class UsersExpenses(db.Model):
    __tablename__ = 'users_expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)
    amount_owed = db.Column(db.Float, nullable=False)

    user = db.relationship('User', back_populates='users_expenses')
    expense = db.relationship('Expense', back_populates='users_expenses')
