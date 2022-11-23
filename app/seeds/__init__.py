from flask.cli import AppGroup
from .users import seed_users, undo_users
from .friendships import seed_friendships, undo_friendships
from .groups import seed_groups, undo_groups
from .users_groups import seed_users_groups, undo_users_groups
from .expenses import seed_expenses, undo_expenses
from .users_expenses import seed_users_expenses, undo_users_expenses
from .payments import seed_payments, undo_payments

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
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_friendships()
        undo_groups()
        undo_users_groups()
        undo_expenses()
        undo_users_expenses()
        undo_payments()
    seed_users()
    # Add other seed functions here
    seed_friendships()
    seed_groups()
    seed_users_groups()
    seed_expenses()
    seed_users_expenses()
    seed_payments()


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
    # Add other undo functions here
