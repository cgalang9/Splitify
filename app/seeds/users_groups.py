from app.models import db, environment, SCHEMA, UsersGroups


def seed_users_groups():
    demo1 = UsersGroups(user_id=1, group_id=1)
    demo2 = UsersGroups(user_id=1, group_id=2)

    g1u1 = UsersGroups(user_id=11, group_id=1)
    g1u2 = UsersGroups(user_id=7, group_id=1)
    g1u3 = UsersGroups(user_id=8, group_id=1)
    g1u4 = UsersGroups(user_id=9, group_id=1)
    g1u5 = UsersGroups(user_id=10, group_id=1)

    g2u1 = UsersGroups(user_id=9, group_id=2)
    g2u2 = UsersGroups(user_id=7, group_id=2)
    g2u3 = UsersGroups(user_id=8, group_id=2)

    db.session.add(demo1)
    db.session.add(demo2)
    db.session.add(g1u1)
    db.session.add(g1u2)
    db.session.add(g1u3)
    db.session.add(g1u4)
    db.session.add(g1u5)
    db.session.add(g2u1)
    db.session.add(g2u2)
    db.session.add(g2u3)
    db.session.commit()



def undo_users_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users_groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users_groups")

    db.session.commit()
