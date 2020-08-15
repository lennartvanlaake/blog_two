from models import add_and_save, delete_and_save, BlogPost
from decimal import Decimal
from time import time

def create_post(name, blog_type, content, longditude, latitude):
    post = BlogPost(name=name,
                    blog_type=blog_type,
                    content=content,
                    longditude=Decimal(longditude),
                    latitude=Decimal(latitude),
                    timestamp=int(time()))
    add_and_save(post)

def get_first_post():
    return BlogPost.query.order_by("timestamp").first()

def get_posts():
    return BlogPost.query.all()
