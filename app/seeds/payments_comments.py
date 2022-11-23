from app.models import db, environment, SCHEMA, PaymentComment
from datetime import datetime


def seed_payment_comments():
    comment1 = PaymentComment(
        user_id=10, payment_id=1, text='Sorry it took so long', date_created=datetime(2022, 11, 11))
    comment2 = PaymentComment(
        user_id=1, payment_id=1, text='No worries', date_created=datetime(2022, 11, 12))

    db.session.add(comment1)
    db.session.add(comment2)
    db.session.commit()



def undo_payment_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payment_comment RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM payment_comment")

    db.session.commit()
