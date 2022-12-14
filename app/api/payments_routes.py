from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Payment, PaymentComment, Payment, UsersExpenses, PaymentComment, User, UsersGroups, Group, db
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
            "comments": [{
                "id": payment_comment.id,
                "text": payment_comment.text,
                "date_created": payment_comment.date_created,
                "user_id": payment_comment.user.id,
                "username": payment_comment.user.username } for payment_comment in payment.payment_comments]
        }

    return {'payments': [payment_to_dict(payment) for payment in payments]}


@payments_routes.get('/<int:payment_id>')
@login_required
def get_payment_by_payment_id(payment_id):
    """
    Get a payment by payment id
    """

    payment = Payment.query.options(joinedload(Payment.payer)).options(joinedload(Payment.payee)).options(joinedload(Payment.group)) \
                .options(joinedload(Payment.payment_comments).options(joinedload(PaymentComment.user))) \
                .filter(Payment.id == payment_id).one()

    # validation: current user must be in group to get
    group_members = UsersGroups.query.filter(UsersGroups.group_id == payment.group_id).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

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


@payments_routes.post('')
@login_required
def create_payment():
    """
    Create a payment
    """
    req = request.json

    # validation: User can not pay themself
    if req.get('payer_id') == req.get('payee_id'):
        return {"error": "User can not pay themself"}, 403

    group = Group.query.get(req.get('group_id'))
    # validation: group_id not found
    if group == None:
        return {"error": "group not found"}, 404

    # validation: current user must be either payee or payer to create
    if int(current_user.get_id()) != req.get('payer_id') and int(current_user.get_id()) != req.get('payee_id'):
        return {"error": "Forbidden"}, 403

    # validation: current user must be in group to post
    group_members = UsersGroups.query.filter(UsersGroups.group_id == req.get('group_id')).all()
    member_ids = [member.user_id for member in group_members]
    if int(current_user.get_id()) not in member_ids:
        return {"error": "Forbidden"}, 403

    payer = User.query.get(req.get('payer_id'))
    # validation: payer_id not found
    if payer == None:
        return {"error": "payer not found"}, 404

    # validation: payer_id must be in group
    if payer.id not in member_ids:
        return {"error": "Payer must be in group"}, 403

    payee = User.query.get(req.get('payee_id'))
    # validation: payee_id not found
    if payee == None:
        return {"error": "payee not found"}, 404

    # validation: payer_id must be in group
    if payee.id not in member_ids:
        return {"error": "Payee must be in group"}, 403

    # validation: total must be greater that 0
    if req.get('total') < 0:
        return {"error": "total must be greater than 0"}, 400

    print('==========================================')

    date_arr = req.get('date').split('-')

    new_payment = Payment(
        payer_id = req.get('payer_id'),
        payee_id = req.get('payee_id'),
        group_id = req.get('group_id'),
        total = req.get('total'),
        date_paid = date(int(date_arr[0]), int(date_arr[1]), int(date_arr[2]))
    )

    db.session.add(new_payment)
    db.session.commit()
    return {
        "date_paid": new_payment.date_paid,
        "id": new_payment.id,
        "total": new_payment.total,
        "payer_id": new_payment.payer_id,
        "payee_id": new_payment.payee_id,
        "group_id": new_payment.group_id
    }


@payments_routes.put('/<int:payment_id>')
@login_required
def edit_payment(payment_id):
    """
    Edit a payment by payment id
    """
    payment = Payment.query.get(payment_id)

    req = request.json

    # validation: User can not pay themself
    if req.get('payer_id') == req.get('payee_id'):
        return {"error": "User can not pay themself"}, 403

    # validation: payment_id not found
    if payment == None:
        return {"error": "Payment not found"}, 404

    # validation: current user must be either payee or payer to edit
    if int(current_user.get_id()) != payment.payer_id and int(current_user.get_id()) != payment.payee_id:
        return {"error": "Forbidden"}, 403

    group_members = UsersGroups.query.filter(UsersGroups.group_id == payment.group_id).all()
    member_ids = [member.user_id for member in group_members]

    payer = User.query.get(req.get('payer_id'))
    # validation: payer_id not found
    if payer == None:
        return {"error": "payer not found"}, 404

    # validation: payer_id must be in group
    if payer.id not in member_ids:
        return {"error": "Payer must be in group"}, 403

    payee = User.query.get(req.get('payee_id'))
    # validation: payee_id not found
    if payee == None:
        return {"error": "payee not found"}, 404

    # validation: payer_id must be in group
    if payee.id not in member_ids:
        return {"error": "Payee must be in group"}, 403

    # validation: total must be greater that 0
    if req.get('total') < 0:
        return {"error": "total must be greater than 0"}, 400

    date_arr = req.get('date').split('-')

    payment.payer_id = req.get('payer_id')
    payment.payee_id = req.get('payee_id')
    payment.total = req.get('total')
    payment.date_paid = date(int(date_arr[0]), int(date_arr[1]), int(date_arr[2]))

    db.session.commit()

    return {
        "date_paid": payment.date_paid,
        "id": payment.id,
        "total": payment.total,
        "payer_id": payment.payer_id,
        "payee_id": payment.payee_id,
        "group_id": payment.group_id
    }


@payments_routes.delete('/<int:payment_id>')
@login_required
def delete_payment(payment_id):
    """
    Delete an payment by payment id
    """
    payment = Payment.query.get(payment_id)

    # validation: payment_id not found
    if payment == None:
        return {"error": "Payment not found"}, 404

    # validation: current user must be either payee or payer to edit
    if int(current_user.get_id()) != payment.payer_id and int(current_user.get_id()) != payment.payee_id:
        return {"messerrorage": "Forbidden"}, 403

    db.session.delete(payment)
    db.session.commit()
    return {"message": "Payment Successfully deleted"}


@payments_routes.post('/<int:payment_id>/comments')
@login_required
def create_comment(payment_id):
    """
    Create an payment comment by payment id
    """
    req = request.json
    curr_user_id = int(current_user.get_id())

    payment = Payment.query.get(payment_id)

    # validation: payment_id not found
    if payment == None:
        return {"error": "Payment not found"}, 404

    # validation: current user must be in group to post
    group_members = UsersGroups.query.filter(UsersGroups.group_id == payment.group_id).all()
    member_ids = [member.user_id for member in group_members]
    if curr_user_id not in member_ids:
        return {"error": "Forbidden"}, 403

    # validation: max length of comment is 50
    if len(req.get('text')) > 50:
        return {"error": "Comment must be less than 51 characters"}, 400

    new_comment = PaymentComment(
        user_id = curr_user_id,
        payment_id = payment_id,
        text = req.get('text'),
    )
    db.session.add(new_comment)
    db.session.commit()

    # get update list of commetns for of the payment
    updated_comments_all = PaymentComment.query.filter(PaymentComment.payment_id == payment_id).options(joinedload(PaymentComment.user)).all()
    comment_list = []
    for comment in updated_comments_all:
        comment_obj = {
            'id': comment.id,
            'user_id': comment.user_id,
            'username': comment.user.username,
            'payment_id': comment.payment_id,
            'text': comment.text,
            'date_created': comment.date_created
        }
        comment_list.append(comment_obj)

    return { 'newComments': comment_list}



@payments_routes.delete('comments/<int:comment_id>')
@login_required
def delete_comment_expense(comment_id):
    """
    Delete a payment comment
    """
    comment = PaymentComment.query.get(comment_id)

    # validation: comment not found
    if comment == None:
        return {"error": "Payment not found"}, 404

    payment_id = comment.payment_id

    # validation: can not delete comment of another user
    if comment.user_id != int(current_user.get_id()):
        return {"error": "Can not delete comment of another user"}, 400

    db.session.delete(comment)
    db.session.commit()

    # get update list of commetns for of the expense
    updated_comments_all = PaymentComment.query.filter(PaymentComment.payment_id == payment_id).options(joinedload(PaymentComment.user)).all()
    comment_list = []
    for comment in updated_comments_all:
        comment_obj = {
            'id': comment.id,
            'user_id': comment.user_id,
            'username': comment.user.username,
            'payment_id': comment.payment_id,
            'text': comment.text,
            'date_created': comment.date_created
        }
        comment_list.append(comment_obj)

    return { 'newComments': comment_list}



@payments_routes.put('comments/<int:comment_id>')
@login_required
def edit_comment_payment(comment_id):
    """
    Edit a payment comment
    """
    req = request.json
    comment = PaymentComment.query.get(comment_id)

    # validation: comment not found
    if comment == None:
        return {"error": "Payment not found"}, 404

    payment_id = comment.payment_id

    # validation: can not edit comment of another user
    if comment.user_id != int(current_user.get_id()):
        return {"error": "Can not edit comment of another user"}, 400

    # validation: max length of comment is 50
    if len(req.get('text')) > 50:
        return {"error": "Comment must be less than 51 characters"}, 400

    comment.text = req.get('text')
    db.session.commit()

    # get update list of commetns for of the expense
    updated_comments_all = PaymentComment.query.filter(PaymentComment.payment_id == payment_id).options(joinedload(PaymentComment.user)).all()
    comment_list = []
    for comment in updated_comments_all:
        comment_obj = {
            'id': comment.id,
            'user_id': comment.user_id,
            'username': comment.user.username,
            'payment_id': comment.payment_id,
            'text': comment.text,
            'date_created': comment.date_created
        }
        comment_list.append(comment_obj)

    return { 'newComments': comment_list}
