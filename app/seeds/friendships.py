from app.models import db, environment, SCHEMA, Friendship


def seed_friendships():
    f1 = Friendship(user1_id=1, user2_id=11)
    f2 = Friendship(user1_id=1, user2_id=7)
    f3 = Friendship(user1_id=1, user2_id=8)
    f4 = Friendship(user1_id=9, user2_id=1)
    f5 = Friendship(user1_id=10, user2_id=1)

    db.session.add(f1)
    db.session.add(f2)
    db.session.add(f3)
    db.session.add(f4)
    db.session.add(f5)
    db.session.commit()



def undo_friendships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friendships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM friendships")

    db.session.commit()
