from app.models import db, environment, SCHEMA, ExpenseComment
from datetime import datetime


def seed_expense_comments():
    comment1 = ExpenseComment(
        user_id=0, expense_id=0, text='Thanks! KBBQ was amazing!', date_created=datetime(2022, 11, 19))
    comment2 = ExpenseComment(
        user_id=6, expense_id=0, text='Right on!', date_created=datetime(2022, 11, 20))

    db.session.add(comment1)
    db.session.add(comment2)
    db.session.commit()



def undo_expense_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expense_comment RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM expense_comment")

    db.session.commit()
