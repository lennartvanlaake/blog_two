from flask import render_template, request, jsonify
from blog_post_service import create_post, get_posts, get_first_post, get_posts_page
from blog_type_service import get_blog_types, add_blog_type
from setup import app
from models import migrate

@app.route('/')
def index():
    return render_template('index.html', posts=get_posts(), first_post=get_first_post())

@app.route('/posts')
def posts_template():
    return render_template('view_posts.html', start_post=request.args.get('start', 1))

@app.route('/api/posts')
def posts_page():
    blogs = get_posts_page(int(request.args.get('start', 1)), int(request.args.get('size', 10)), request.args.get('direction', 'forward'))
    return jsonify([ blog.__dict__ for blog in blogs])

@app.route('/admin/posts/new', methods=['POST', 'GET'])
def admin():
    if (request.method == 'POST'):
        create_post(name = request.form['name'],
                    blog_type = request.form['blog_type'],
                    content=request.form['content'],
                    longditude=request.form['longditude'],
                    latitude=request.form['latitude'])
    return render_template('new_post.html', types=get_blog_types())

if __name__ == '__main__':
    migrate()
    app.run(port=10001, debug=True)