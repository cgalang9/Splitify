from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Payment(db.Model):
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id')), nullable=False)
    total = db.Column(db.Float, nullable=False)
    date_paid = db.Column(db.DateTime, nullable=False, default=date.today())

    payer = db.relationship('User', back_populates='payments_payer', foreign_keys=[payer_id])
    payee = db.relationship('User', back_populates='payments_payee', foreign_keys=[payee_id])
    group = db.relationship('Group', back_populates='payments')
    # payment_comments = db.relationship('PaymentComment', back_populates='payment', cascade="all, delete-orphan")
