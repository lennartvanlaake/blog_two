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

def get_posts_page(start, size, direction):
    posts = None
    if direction == 'forward':
        posts = BlogPost.query.filter(BlogPost.id >= start).order_by(BlogPost.id.asc()).limit(size).all()
    if direction == 'backward':
        posts = BlogPost.query.filter(BlogPost.id <= start).order_by(BlogPost.id.desc()).limit(size).all()
    return [ to_response(post) for post in posts ]

def to_response(post):
    return BlogPostResponse(post.name, post.content)
    
class BlogPostResponse():
    def __init__(self, name, content):
        self.name = name
        self.content = content