from .db import db, environment, SCHEMA, add_prefix_for_prod


class UsersGroups(db.Model):
    __tablename__ = 'users_groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id')), nullable=False)

    user = db.relationship('User', back_populates='users_groups')
    group = db.relationship('Group', back_populates='users_groups')
