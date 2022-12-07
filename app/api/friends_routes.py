from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Group, Expense, UsersExpenses, ExpenseComment, Payment, PaymentComment, UsersGroups, User, Friendship, db
from sqlalchemy.orm import joinedload
from sqlalchemy import or_, and_

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

    friends_lst = []
    for friend in friends:
        friend_dict = {
            "id": friend.id,
            "username": friend.username
        }
        friends_lst.append(friend_dict)

    return {"currUserFriends": friends_lst}



@friends_routes.post('')
@login_required
def create_friendship():
    """
    Create friendship (with current user)
    """
    req = request.json
    friend_id = int(req.get('friend_id'))
    curr_user_id = int(current_user.get_id())

    # validation: can not friend yourself
    if friend_id == curr_user_id:
        return {"error": "Can not add yourself as a friend"}, 400

    friend = User.query.get(friend_id)

    # validation: friend_id not found
    if friend == None:
        return {"error": "User not found"}, 404

    # get curr user friends
    freindships = Friendship.query.filter(or_(Friendship.user1_id == curr_user_id, Friendship.user2_id == curr_user_id)).all()
    friends_ids = set()
    for freindship in freindships:
        if freindship.user1_id != curr_user_id:
            friends_ids.add(freindship.user1_id)
        if freindship.user2_id != curr_user_id:
            friends_ids.add(freindship.user2_id)

    # validation: check if already friends
    if friend_id in friends_ids:
        return {"error": "You are already friends with this user"}, 400

    new_friendship = Friendship(
        user1_id = curr_user_id,
        user2_id = friend_id
    )

    db.session.add(new_friendship)
    db.session.commit()

    return { "id": friend.id, "username": friend.username }


@friends_routes.delete('')
@login_required
def delete_friendship():
    """
    Delete friendship (with current user)
    """
    req = request.json
    friend_id = int(req.get('friend_id'))
    curr_user_id = int(current_user.get_id())

    # validation: can not friend yourself
    if friend_id == curr_user_id:
        return {"error": "Can not add or delete yourself as a friend"}, 400

    friend = User.query.get(friend_id)

    # validation: friend_id not found
    if friend == None:
        return {"error": "Friend not found"}, 404

    # find friendship
    freindshipA = Friendship.query.filter(and_(Friendship.user1_id == curr_user_id, Friendship.user2_id == friend_id)).all()
    freindshipB = Friendship.query.filter(and_(Friendship.user2_id == curr_user_id, Friendship.user1_id == friend_id)).all()

    print('=========================', freindshipB)

    if len(freindshipA) == 0 and len(freindshipB) == 0 :
        return {"error": "You are not friends with this user"}, 400

    for friendship in freindshipA:
        db.session.delete(friendship)
        db.session.commit()

    for friendship in freindshipB:
        db.session.delete(friendship)
        db.session.commit()

    return {"message": "Expense Successfully deleted"}
