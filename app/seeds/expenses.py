from app.models import db, environment, SCHEMA, Expense
from datetime import date


def seed_expenses():
    expense1 = Expense(
        payer_id=7, group_id=1, description='KBBQ', total=521.80, date_paid=date(2022, 11, 18))
    expense2 = Expense(
        payer_id=1, group_id=1, description='Concert tickets', total=837.22, date_paid=date(2022, 10, 10))
    expense3 = Expense(
        payer_id=9, group_id=2, description='Sushi', total=411.32, date_paid=date(2022, 11, 7))
    expense4 = Expense(
        payer_id=8, group_id=2, description='Halloween candy', total=123.18, date_paid=date(2022, 10, 31))


    db.session.add(expense1)
    db.session.add(expense2)
    db.session.add(expense3)
    db.session.add(expense4)
    db.session.commit()



def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM expenses")

    db.session.commit()
