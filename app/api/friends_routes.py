from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Group, Expense, UsersExpenses, ExpenseComment, Payment, PaymentComment, UsersGroups, User, Friendship, db
from sqlalchemy.orm import joinedload
from sqlalchemy import or_

friends_routes = Blueprint('friends', __name__)


@friends_routes.get('/current-user')
@login_required
def get_current_user_friends():
    """
    Get all friends of a current user
    """
    user_id = int(current_user.get_id())

    freindships = Friendship.query.filter(or_(Friendship.user1_id == user_id, Friendship.user2_id == user_id)).all()

    friends_ids = set()
    for freindship in freindships:
        if freindship.user1_id != user_id:
            friends_ids.add(freindship.user1_id)
        if freindship.user2_id != user_id:
            friends_ids.add(freindship.user2_id)


    friends = User.query.filter(User.id.in_(friends_ids)).all()
    print('================', friends)

    friends_lst = []
    for friend in friends:
        friend_dict = {
            "id": friend.id,
            "usermane": friend.username
        }
        friends_lst.append(friend_dict)

    return {"currUserFriends": friends_lst}
