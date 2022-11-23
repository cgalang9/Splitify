from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Group, Expense, UsersExpenses, ExpenseComment
from sqlalchemy.orm import joinedload

groups_routes = Blueprint('groups', __name__)


@groups_routes.get('/<int:group_id>/expenses')
@login_required
def get_expenses_by_group_id(group_id):
    """
    Get all expenses of a group by group id
    """
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
            "group_id": expense.group_id,
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
