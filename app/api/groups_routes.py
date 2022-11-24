from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Group, Expense, UsersExpenses, ExpenseComment, Payment, PaymentComment, UsersGroups, User, db
from sqlalchemy.orm import joinedload
from sqlalchemy import and_

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
        return {"error": "group not found"}, 404

    # validation: current user must be in group to see expenses
    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

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
        return {"error": "group not found"}, 404

    # validation: current user must be in group to see payments
    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

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


@groups_routes.get('/current-user')
@login_required
def get_groups_current_user():
    """
    Get groups of current user
    """
    user_id = int(current_user.get_id())

    groups = UsersGroups.query.options(joinedload(UsersGroups.group)).filter(UsersGroups.user_id == user_id).all()

    return {"groups": [{"id": group.group.id, "name": group.group.name} for group in groups]}


@groups_routes.post('')
@login_required
def create_group():
    """
    Create a group
    """
    req = request.json

    # validation: name length must be < 40
    if len(req.get('name')) > 40:
        return {"error": "Name must be less than 41 characters"}, 400

    unique_member_ids = set(req.get('member_ids'))

    # validation: group msut have at least 2 members
    if len(unique_member_ids) < 2:
        return {"error": "Group must have at least 2 members"}, 400

    for member_id in unique_member_ids:
        member = User.query.get(member_id)
        # validation: member_id not found
        if member == None:
            return {"error": "A member was not found"}, 404

    new_group = Group(name = req.get('name'))
    db.session.add(new_group)
    db.session.commit()

    for member_id in unique_member_ids:
        add_user_to_group = UsersGroups(
            user_id = member_id,
            group_id = new_group.id
        )
        db.session.add(add_user_to_group)
        db.session.commit()

    return {
        "id": new_group.id,
        "name": new_group.name,
        "member_ids": list(unique_member_ids)
    }


@groups_routes.delete('/<int:group_id>')
@login_required
def delete_group(group_id):
    """
    Delete a group
    """
    group = Group.query.get(group_id)

    # validation: group_id not found
    if group == None:
        return {"error": "group not found"}, 404

    # validation: current user must be in group to delete
    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

    db.session.delete(group)
    db.session.commit()
    return {"message": "Group successfully deleted"}


@groups_routes.get('/<int:group_id>/members')
@login_required
def get_group_members(group_id):
    """
    Get members of group by group id
    """

    group_members = UsersGroups.query.options(joinedload(UsersGroups.user)).filter(UsersGroups.group_id == group_id).all()

    # validation: current user must be in group to post
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

    return {"groups": [{"user_id": group.user.id, "name": group.user.username} for group in group_members]}


@groups_routes.post('/<int:group_id>/members')
@login_required
def add_memeber_to_group(group_id):
    """
    Add member to group by group id
    """
    # validation: group_id not found
    group = Group.query.get(group_id)
    if group == None:
        return {"error": "group not found"}, 404

    req = request.json

    # validation: payer_id not found
    user = User.query.get(req.get('user_id'))
    if user == None:
        return {"error": "user not found"}, 404


    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    # validation: checks if user already in group
    if req.get('user_id') in member_ids:
        return {"error": "User already in group"}, 400
    # validation: current user must be in group to add member
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

    add_user = UsersGroups(user_id = req.get('user_id'), group_id = group_id)

    db.session.add(add_user)
    db.session.commit()
    return {"message": "User successfully added to group"}



@groups_routes.delete('/<int:group_id>/members/<int:user_id>')
@login_required
def delete_member_from_group(group_id, user_id):
    """
    Delete member by user_id from group by group id
    """
    # validation: group_id not found
    group = Group.query.get(group_id)
    if group == None:
        return {"error": "group not found"}, 404

    member = User.query.get(user_id)
    # validation: user_id not found
    if member == None:
        return {"error": "member not found"}, 404

    group_members = UsersGroups.query.filter(UsersGroups.group_id == group_id).all()
    member_ids = [member.user_id for member in group_members]
    # validation: checks if user is in group
    if user_id not in member_ids:
        return {"error": "User not in group"}, 400
    # validation: current user must be in group to remove member
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

    user = UsersGroups.query.filter(and_(UsersGroups.group_id == group_id, UsersGroups.user_id == user_id)).one()

    db.session.delete(user)
    db.session.commit()
    return {"message": "User successfully removed from group"}
