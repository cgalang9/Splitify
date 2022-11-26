from app.models import db, environment, SCHEMA, Payment
from datetime import date


def seed_payments():
    payment1 = Payment(
        payer_id=10, payee_id=1, group_id=1, total=50.00, date_paid=date(2022, 11, 10))
    payment2 = Payment(
        payer_id=9, payee_id=1, group_id=1, total=35.00, date_paid=date(2022, 10, 18))
    payment3 = Payment(
        payer_id=1, payee_id=9, group_id=2, total=80.00, date_paid=date(2022, 11, 9))
    payment4 = Payment(
        payer_id=1, payee_id=8, group_id=2, total=20.00, date_paid=date(2022, 11, 3))
    payment5 = Payment(
        payer_id=8, payee_id=7, group_id=1, total=20.50, date_paid=date(2022, 11, 15))


    db.session.add(payment1)
    db.session.add(payment2)
    db.session.add(payment3)
    db.session.add(payment4)
    db.session.add(payment5)
    db.session.commit()



def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM payments")

    db.session.commit()
