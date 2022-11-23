from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Expense, UsersExpenses, ExpenseComment, User
from sqlalchemy.orm import joinedload

expense_routes = Blueprint('expenses', __name__)


@expense_routes.get('/current-user')
@login_required
def get_current_user_expenses():
    """
    Get all expenses of a current user
    """
    user_id = int(current_user.get_id())

    expenses_paid = Expense.query.options(joinedload(Expense.payer)).options(joinedload(Expense.group)) \
                .options(joinedload(Expense.users_expenses).options(joinedload(UsersExpenses.user))) \
                .options(joinedload(Expense.expense_comments).options(joinedload(ExpenseComment.user))) \
                .filter(Expense.payer_id == user_id).all()


    expenses_owed = Expense.query.options(joinedload(Expense.group)) \
                .options(joinedload(Expense.users_expenses).options(joinedload(UsersExpenses.user))) \
                .options(joinedload(Expense.expense_comments).options(joinedload(ExpenseComment.user))) \
                .options(joinedload(Expense.payer)).join(UsersExpenses).join(User).filter(User.id == user_id).all()

    def expense_to_dict(expense):
        return {
            "date_paid": expense.date_paid,
            "id": expense.id,
            "description": expense.description,
            "total": expense.total,
            "group": {"id": expense.group.id, "name": expense.group.name},
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

    expenses_lst = []
    for expense in expenses_owed:
        expense_dict = expense_to_dict(expense)
        expenses_lst.append(expense_dict)

    for expense in expenses_paid:
        expense_dict = expense_to_dict(expense)
        expenses_lst.append(expense_dict)

    return {"expenses": expenses_lst}
