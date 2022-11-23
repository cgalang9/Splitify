from flask.cli import AppGroup
from .users import seed_users, undo_users
from .friendships import seed_friendships, undo_friendships
from .groups import seed_groups, undo_groups
from .users_groups import seed_users_groups, undo_users_groups
from .expenses import seed_expenses, undo_expenses
from .users_expenses import seed_users_expenses, undo_users_expenses
from .payments import seed_payments, undo_payments
from .expenses_comments import seed_expense_comments, undo_expense_comments
from .payments_comments import seed_payment_comments, undo_payment_comments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        undo_users()
        undo_friendships()
        undo_groups()
        undo_users_groups()
        undo_expenses()
        undo_users_expenses()
        undo_payments()
        undo_expense_comments()
        undo_payment_comments()
    seed_users()
    seed_friendships()
    seed_groups()
    seed_users_groups()
    seed_expenses()
    seed_users_expenses()
    seed_payments()
    seed_expense_comments()
    seed_payment_comments()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_friendships()
    undo_groups()
    undo_users_groups()
    undo_expenses()
    undo_users_expenses()
    undo_payments()
    undo_expense_comments()
    undo_payment_comments()
