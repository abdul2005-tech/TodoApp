from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
import bcrypt

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "super-secret-key"

db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    desc = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

with app.app_context():
    db.create_all()

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data.get("username")).first():
        return jsonify({"error": "User already exists"}), 400
    hashed_pw = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
    new_user = User(username=data["username"], password=hashed_pw.decode("utf-8"))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()
    if not user or not bcrypt.checkpw(data["password"].encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token})

@app.route("/todos", methods=["GET"])
@jwt_required()
def get_todos():
    user_id = get_jwt_identity()
    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": t.id, "title": t.title, "desc": t.desc} for t in todos])

@app.route("/todos", methods=["POST"])
@jwt_required()
def add_todo():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_todo = Todo(title=data["title"], desc=data["desc"], user_id=user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"message": "Todo added"})

@app.route("/todos/<int:todo_id>", methods=["PUT"])
@jwt_required()
def update_todo(todo_id):
    user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo: return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    todo.title = data.get("title", todo.title)
    todo.desc = data.get("desc", todo.desc) # Added desc update
    db.session.commit()
    return jsonify({"message": "Updated"})

@app.route("/todos/<int:todo_id>", methods=["DELETE"])
@jwt_required()
def delete_todo(todo_id):
    user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo: return jsonify({"error": "Not found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Deleted"})

# ================= CHANGE PASSWORD =================
@app.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)
    
    # Verify old password before allowing change
    if not bcrypt.checkpw(data["old_password"].encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"error": "Current password incorrect"}), 401

    hashed_pw = bcrypt.hashpw(data["new_password"].encode("utf-8"), bcrypt.gensalt())
    user.password = hashed_pw.decode("utf-8")
    db.session.commit()
    return jsonify({"message": "Password updated"})

# 2. Public route for "Forgot Password" (Pre-login)
@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()
    
    if not user:
        return jsonify({"error": "Username not found"}), 404

    # In a real app, you'd verify email here. For now, we override directly.
    hashed_pw = bcrypt.hashpw(data["new_password"].encode("utf-8"), bcrypt.gensalt())
    user.password = hashed_pw.decode("utf-8")
    db.session.commit()
    return jsonify({"message": "Password reset successful"})

@app.route("/")
def home():
    return "Server is running", 200
if __name__ == "__main__":
    app.run(debug=True)