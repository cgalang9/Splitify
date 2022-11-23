from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class PaymentComment(db.Model):
    __tablename__ = 'payment_comment'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    payment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('payments.id')), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.today())

    user = db.relationship('User', back_populates='payment_comments')
    payment = db.relationship('Payment', back_populates='payment_comments')
