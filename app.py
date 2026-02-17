from flask import Flask,request,jsonify

from flask_sqlalchemy import SQLAlchemy

from flask_cors import CORS



app=Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///todo.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

db=SQLAlchemy(app)

class Todo(db.Model):

    sno=db.Column(db.Integer,primary_key=True)

    title=db.Column(db.String(200),nullable=False)

    desc=db.Column(db.String(200),nullable=False)

with app.app_context():

    db.create_all()

@app.route('/todos',methods=['GET'])

def get_todos():

    todos=Todo.query.all()

    result=[]

    for todo in todos:

        result.append({

            "sno":todo.sno,

            "title":todo.title,

            "desc":todo.desc

        })

    return jsonify(result)



@app.route('/todos',methods=['POST'])

def add_todo():

    data=request.json

    new_todo=Todo(title=data["title"],desc=data["desc"])

    db.session.add(new_todo)

    db.session.commit()

    return jsonify({"message":"Todo added"})

@app.route('/todos/<int:sno>', methods=['DELETE'])

def delete_todo(sno):

    todo = Todo.query.get(sno)



    if not todo:

        return jsonify({"error": "Todo not found"}), 404



    db.session.delete(todo)

    db.session.commit()

    return jsonify({"message": "Todo deleted"})



# UPDATE a todo

@app.route("/todos/<int:sno>", methods=["PUT"])

def update_todo(sno):

    todo = Todo.query.get(sno)



    if not todo:

        return jsonify({"error": "Todo not found"}), 404



    data = request.json

    todo.title = data["title"]



    db.session.commit()



    return jsonify({"message": "Todo updated"})



if __name__ == "__main__":

    app.run(debug=True)