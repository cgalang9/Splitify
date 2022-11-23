from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Group, Expense, UsersExpenses, ExpenseComment, Payment, PaymentComment, UsersGroups, db
from sqlalchemy.orm import joinedload

groups_routes = Blueprint('groups', __name__)


@groups_routes.get('/<int:group_id>/expenses')
@login_required
def get_expenses_by_group_id(group_id):
    """
    Get all expenses of a group by group id
    """
    group = Group.query.get(group_id)
    # validation: group_id not found
    if group == None:
        return {"message": "group not found"}, 404

    # validation: current user must be in group to see expenses
    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"message": "Forbidden"}, 403

    expenses = Expense.query.filter(Expense.group_id == group_id).options(joinedload(Expense.payer)) \
                .options(joinedload(Expense.users_expenses).options(joinedload(UsersExpenses.user))) \
                .options(joinedload(Expense.expense_comments).options(joinedload(ExpenseComment.user))).all()

    expenses_lst = []
    for expense in expenses:
        expense_dict = {
            "date_paid": expense.date_paid,
            "id": expense.id,
            "description": expense.description,
            "total": expense.total,
            "group_id": {"id": expense.group.id, "name": expense.group.name},
            "payer": {"id": expense.payer.id, "username": expense.payer.username},
            "money_owed": [{
                "id": users_expense.id,
                "user_id": users_expense.user.id,
                "username": users_expense.user.username,
                "amount_owed": users_expense.amount_owed } for users_expense in expense.users_expenses],
            "comments": [{
                "id": expense_comment.id,
                "text": expense_comment.text,
                "date_created": expense_comment.date_created,
                "user_id": expense_comment.user.id,
                "username": expense_comment.user.username } for expense_comment in expense.expense_comments]

        }
        expenses_lst.append(expense_dict)

    return {"expenses": expenses_lst}



@groups_routes.get('/<int:group_id>/payments')
@login_required
def get_payments_by_group_id(group_id):
    """
    Get all payments of a group by group id
    """
    group = Group.query.get(group_id)
    # validation: group_id not found
    if group == None:
        return {"message": "group not found"}, 404

    # validation: current user must be in group to see payments
    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"message": "Forbidden"}, 403

    payments = Payment.query.options(joinedload(Payment.payer)).options(joinedload(Payment.payee)).options(joinedload(Payment.group)) \
                .options(joinedload(Payment.payment_comments).options(joinedload(PaymentComment.user))) \
                .filter(Payment.group_id == group_id).all()

    def payment_to_dict(payment):
        return {
            "date_paid": payment.date_paid,
            "id": payment.id,
            "total": payment.total,
            "payer": {"id": payment.payer.id, "username": payment.payer.username},
            "payee": {"id": payment.payee.id, "username": payment.payee.username},
            "group": {"id": payment.group.id, "name": payment.group.name},
            "comments": [{
                "id": payment_comment.id,
                "text": payment_comment.text,
                "date_created": payment_comment.date_created,
                "user_id": payment_comment.user.id,
                "username": payment_comment.user.username } for payment_comment in payment.payment_comments]
        }

    return {'payments': [payment_to_dict(payment) for payment in payments]}
