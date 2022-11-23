from app.models import db, environment, SCHEMA, UsersExpenses


def seed_users_expenses():
    e1u0 = UsersExpenses(user_id=1, expense_id=1, amount_owed=86.97)
    e1u7 = UsersExpenses(user_id=11, expense_id=1, amount_owed=86.97)
    e1u8 = UsersExpenses(user_id=8, expense_id=1, amount_owed=86.97)
    e1u9 = UsersExpenses(user_id=9, expense_id=1, amount_owed=86.97)
    e1u10 = UsersExpenses(user_id=10, expense_id=1, amount_owed=86.97)

    e2u6 = UsersExpenses(user_id=11, expense_id=2, amount_owed=139.54)
    e2u7 = UsersExpenses(user_id=7, expense_id=2, amount_owed=139.54)
    e2u8 = UsersExpenses(user_id=8, expense_id=2, amount_owed=139.54)
    e2u9 = UsersExpenses(user_id=9, expense_id=2, amount_owed=139.54)
    e2u10 = UsersExpenses(user_id=10, expense_id=2, amount_owed=139.54)

    e3u6 = UsersExpenses(user_id=7, expense_id=3, amount_owed=102.83)
    e3u7 = UsersExpenses(user_id=8, expense_id=3, amount_owed=102.83)
    e3u0 = UsersExpenses(user_id=1, expense_id=3, amount_owed=102.83)

    e4u6 = UsersExpenses(user_id=7, expense_id=4, amount_owed=30.80)
    e4u0 = UsersExpenses(user_id=1, expense_id=4, amount_owed=30.80)
    e4u8 = UsersExpenses(user_id=9, expense_id=4, amount_owed=30.80)



    db.session.add(e1u0)
    db.session.add(e1u7)
    db.session.add(e1u8)
    db.session.add(e1u9)
    db.session.add(e1u10)
    db.session.add(e2u6)
    db.session.add(e2u7)
    db.session.add(e2u8)
    db.session.add(e2u9)
    db.session.add(e2u10)
    db.session.add(e3u6)
    db.session.add(e3u7)
    db.session.add(e3u0)
    db.session.add(e4u6)
    db.session.add(e4u0)
    db.session.add(e4u8)

    db.session.commit()



def undo_users_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users_expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users_expenses")

    db.session.commit()
