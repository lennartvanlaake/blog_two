
from setup import db

class BlogPost(db.Model):
    name = db.Column(db.String(20), primary_key=True)
    blog_type = db.Column(db.String(10), nullable=False)
    content = db.Column(db.String(2000), nullable=False)
    longditude = db.Column(db.Float(), nullable=False)
    latitude = db.Column(db.Float(), nullable=False)
    timestamp = db.Column(db.BigInteger(), nullable=False)

class BlogType(db.Model):
    name = db.Column(db.String(20), primary_key=True)

def add_and_save(entity):
    db.session.add(entity)
    db.session.commit()

def delete_and_save(entity):
    db.session.delete(entity)
    db.session.commit()

def migrate():
    db.create_all()