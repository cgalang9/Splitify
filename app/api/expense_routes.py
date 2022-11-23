from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Expense, UsersExpenses, ExpenseComment, User, UsersGroups, Group, db
from sqlalchemy.orm import joinedload
from datetime import date

expense_routes = Blueprint('expenses', __name__)


@expense_routes.get('/current-user')
@login_required
def get_current_user_expenses():
    """
    Get all expenses of a current user
    """
    user_id = int(current_user.get_id())

    # query all expenses where curr user is payer
    expenses_paid = Expense.query.options(joinedload(Expense.payer)).options(joinedload(Expense.group)) \
                .options(joinedload(Expense.users_expenses).options(joinedload(UsersExpenses.user))) \
                .options(joinedload(Expense.expense_comments).options(joinedload(ExpenseComment.user))) \
                .filter(Expense.payer_id == user_id).all()

    # query all expenses where curr user owes the payer
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

    expenses_lst = [expense_to_dict(expense) for expense in expenses_paid] + [expense_to_dict(expense) for expense in expenses_owed]

    return {"expenses": expenses_lst}


@expense_routes.get('/<int:expense_id>')
@login_required
def get_expense_by_expense_id(expense_id):
    """
    Get an expense by expense id
    """

    expense = Expense.query.options(joinedload(Expense.payer)).options(joinedload(Expense.group)) \
                .options(joinedload(Expense.users_expenses).options(joinedload(UsersExpenses.user))) \
                .options(joinedload(Expense.expense_comments).options(joinedload(ExpenseComment.user))) \
                .filter(Expense.id == expense_id).one()

    print(expense)

    # validation: expense_id not found
    if expense == None:
        return {"message": "Expense not found"}, 404

    # validation: current user must be in group to get
    group_members = UsersGroups.query.filter(UsersGroups.group_id == expense.group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"message": "Forbidden"}, 403


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




@expense_routes.post('')
@login_required
def create_expense():
    """
    Create an expense
    """
    req = request.json

    # validation: current user must be in group to post
    group_members = UsersGroups.query.filter(UsersGroups.group_id == req.get('group_id')).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"message": "Forbidden"}, 403

    group = Group.query.get(req.get('payer_id'))
    # validation: group_id not found
    if group == None:
        return {"message": "group not found"}, 404

    payer = User.query.get(req.get('payer_id'))
    # validation: payer_id not found
    if payer == None:
        return {"message": "payer not found"}, 404

    # validation: payer_id must be in group
    if payer.id not in member_ids:
        return {"message": "Payer must be in group"}, 403

    for split in req.get('splits'):
        user = User.query.get(split['user_id'])
        # validation: user who owes money not found
        if user == None:
            return {"message": "A user who owes money not found"}, 404
        # validation: user who owes money not in group
        if user.id not in member_ids:
            return {"message": "A user who owes money is not in group"}, 403

    # validation: description must be less than 40 characters
    if len(req.get('description')) > 40:
        return {"message": "description must be less than 40 characters"}, 400

    # validation: total must be greater that 0
    if req.get('total') < 0:
        return {"message": "total must be greater than 0"}, 400

    date_arr = req.get('date').split('-')

    new_expense = Expense(
        payer_id = req.get('payer_id'),
        group_id = req.get('group_id'),
        description = req.get('description'),
        total = req.get('total'),
        date_paid = date(int(date_arr[0]), int(date_arr[1]), int(date_arr[2]))
    )
    db.session.add(new_expense)
    db.session.commit()

    new_splits = []
    for split in req.get('splits'):
        if split['user_id'] != new_expense.payer_id:
            new_split = UsersExpenses(
                user_id = split['user_id'],
                expense_id = new_expense.id,
                amount_owed = split['amount_owed']
            )
            db.session.add(new_split)
            db.session.commit()
            new_splits.append({
                "user_id": new_split.user_id,
                "amount_owed": new_split.amount_owed
            })

    return {
        "id": new_expense.id,
        "payer_id": new_expense.payer_id,
        "group_id": new_expense.group_id,
        "description": new_expense.description,
        "total": new_expense.total,
        "date_paid": new_expense.date_paid,
        "money_owed": new_splits
    }


@expense_routes.delete('/<int:expense_id>')
@login_required
def delete_expense(expense_id):
    """
    Delete an expense by expense id
    """
    expense = Expense.query.get(expense_id)

    # validation: expense_id not found
    if expense == None:
        return {"message": "Expense not found"}, 404

    # validation: current user must be in group to delete
    group_members = UsersGroups.query.filter(UsersGroups.group_id == expense.group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"message": "Forbidden"}, 403

    db.session.delete(expense)
    db.session.commit()
    return {"message": "Expense Successfully deleted"}


@expense_routes.put('/<int:expense_id>')
@login_required
def edit_expense(expense_id):
    """
    Edit an expense by expense id
    """
    req = request.json

    expense = Expense.query.get(expense_id)

    # validation: expense_id not found
    if expense == None:
        return {"message": "Expense not found"}, 404

    # validation: current user must be in group to edit
    group_members = UsersGroups.query.filter(UsersGroups.group_id == expense.group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"message": "Forbidden"}, 403

    payer = User.query.get(req.get('payer_id'))
    # validation: payer_id not found
    if payer == None:
        return {"message": "payer not found"}, 404

    # validation: payer_id must be in group
    if payer.id not in member_ids:
        return {"message": "Payer must be in group"}, 403

    for split in req.get('splits'):
        user = User.query.get(split['user_id'])
        # validation: user who owes money not found
        if user == None:
            return {"message": "A user who owes money not found"}, 404
        # validation: user who owes money not in group
        if user.id not in member_ids:
            return {"message": "A user who owes money is not in group"}, 403

    # validation: description must be less than 40 characters
    if len(req.get('description')) > 40:
        return {"message": "description must be less than 40 characters"}, 400

    # validation: total must be greater that 0
    if req.get('total') < 0:
        return {"message": "total must be greater than 0"}, 400

    date_arr = req.get('date').split('-')

    expense.payer_id = req.get('payer_id'),
    expense.group_id = req.get('group_id'),
    expense.description = req.get('description'),
    expense.total = req.get('total'),
    expense.date_paid = date(int(date_arr[0]), int(date_arr[1]), int(date_arr[2]))

    db.session.commit()

    # new_splits = []
    # for split in req.get('splits'):
    #     if split['user_id'] != new_expense.payer_id:
    #         new_split = UsersExpenses(
    #             user_id = split['user_id'],
    #             expense_id = new_expense.id,
    #             amount_owed = split['amount_owed']
    #         )
    #         db.session.add(new_split)
    #         db.session.commit()
    #         new_splits.append({
    #             "user_id": new_split.user_id,
    #             "amount_owed": new_split.amount_owed
    #         })

    return {
        "id": expense.id,
        "payer_id": expense.payer_id,
        "group_id": expense.group_id,
        "description": expense.description,
        "total": expense.total,
        "date_paid": expense.date_paid,
        # "money_owed": new_splits
    }
