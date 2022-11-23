from .db import db, environment, SCHEMA


class Group(db.Model):
    __tablename__ = 'groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)

    users_groups = db.relationship('UsersGroups', back_populates='group')
    expenses = db.relationship('Expense', back_populates='group', cascade="all, delete-orphan")
    payments = db.relationship('Payment', back_populates='group', cascade="all, delete-orphan")
