from app.models import db, environment, SCHEMA, Group


def seed_groups():
    group1 = Group(name='Starting 5')
    group2 = Group(name='Core')

    db.session.add(group1)
    db.session.add(group2)
    db.session.commit()



def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM groups")

    db.session.commit()
