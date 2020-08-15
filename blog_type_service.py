from models import add_and_save, delete_and_save, BlogType
       
def get_blog_types():
    return list(map(lambda type: type.name, BlogType.query.all()))

def add_blog_type(name):
    add_and_save(BlogType(name = name))

def remove_blog_type(name):
    blogtype = BlogType.query.filter_by(name=name).first()
    if blogtype != None:
        delete_and_save(blogtype)
        