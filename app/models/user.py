from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    friendships_user1 = db.relationship('Friendship', primaryjoin="User.id == Friendship.user1_id", back_populates='user1', cascade="all, delete-orphan")
    friendships_user2 = db.relationship('Friendship', primaryjoin="User.id == Friendship.user2_id", back_populates='user2', cascade="all, delete-orphan")
    users_groups = db.relationship('UsersGroups', back_populates='user')
    expenses = db.relationship('Expense', back_populates='payer', cascade="all, delete-orphan")
    users_expenses = db.relationship('UsersExpenses', back_populates='user')
    payments_payer = db.relationship('Payment', primaryjoin="User.id == Payment.payer_id", back_populates='payer')
    payments_payee = db.relationship('Payment', primaryjoin="User.id == Payment.payee_id", back_populates='payee')
    expense_comments = db.relationship('ExpenseComment', back_populates='user', cascade="all, delete-orphan")
    payment_comments = db.relationship('PaymentComment', back_populates='user', cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
