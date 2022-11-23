from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password1')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password2')
    kim = User(
        username='kim', email='kim@aa.io', password='password3')
    becky = User(
        username='becky', email='becky@aa.io', password='password4')
    george = User(
        username='george', email='george@aa.io', password='password5')
    steph30 = User(
        username='steph30', email='steph@aa.io', password='password6')
    klay11 = User(
        username='klay11', email='klay@aa.io', password='password7')
    draymond23 = User(
        username='draymond23', email='draymond@aa.io', password='password8')
    andrew22 = User(
        username='andrew22', email='andrew@aa.io', password='password9')
    kevon5 = User(
        username='kevon5', email='kevon@aa.io', password='password10')
    jordan3 = User(
        username='jordan3', email='jordan@aa.io', password='password11')
    jonathan00 = User(
        username='jonathan00', email='jonathan@aa.io', password='password12')


    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(kim)
    db.session.add(becky)
    db.session.add(george)
    db.session.add(steph30)
    db.session.add(klay11)
    db.session.add(draymond23)
    db.session.add(andrew22)
    db.session.add(kevon5)
    db.session.add(jordan3)
    db.session.add(jonathan00)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
