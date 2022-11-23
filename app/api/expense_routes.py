from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Expense

expense_routes = Blueprint('expenses', __name__)


@expense_routes.route('/')
@login_required
def users():
    pass
