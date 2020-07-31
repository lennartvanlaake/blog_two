from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin/posts/new', methods=['POST', 'GET'])
def admin():
    if (request.method == 'POST'):
        post = BlogPost(name=request.form['name'], blog_type=request.form['blog_type'],
               content=request.form['content'])
        db.session.add(post)
        db.session.commit()
    return render_template('new_post.html')

class BlogPost(db.Model):
    name = db.Column(db.String(20), primary_key=True)
    blog_type = db.Column(db.String(10), nullable=False)
    content = db.Column(db.String(2000), nullable=False)

if __name__ == '__main__':
    db.create_all()
    app.run(port=10001, debug=True)