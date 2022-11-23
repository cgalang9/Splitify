from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Payment, PaymentComment, Expense, UsersExpenses, ExpenseComment, User, UsersGroups, Group, db
from sqlalchemy.orm import joinedload
from datetime import date
from sqlalchemy import or_

payments_routes = Blueprint('payments', __name__)


@payments_routes.get('/current-user')
@login_required
def get_current_user_payments():
    """
    Get all payments of a current user
    """
    user_id = int(current_user.get_id())

    payments = Payment.query.options(joinedload(Payment.payer)).options(joinedload(Payment.payee)).options(joinedload(Payment.group)) \
                .options(joinedload(Payment.payment_comments).options(joinedload(PaymentComment.user))) \
                .filter(or_(Payment.payer_id == user_id, Payment.payee_id == user_id)).all()

    def payment_to_dict(payment):
        return {
            "date_paid": payment.date_paid,
            "id": payment.id,
            "total": payment.total,
            "payer": {"id": payment.payer.id, "username": payment.payer.username},
            "payee": {"id": payment.payee.id, "username": payment.payee.username},
            "group": {"id": payment.group.id, "name": payment.group.name},
        }


    return {'payments': [payment_to_dict(payment) for payment in payments]}
