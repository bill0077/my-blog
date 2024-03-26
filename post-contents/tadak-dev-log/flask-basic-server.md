---
title: "tadak 개발기 - 2. [Backend] Flask + Flask-SocketIO 서버 구축"
date: "2024-03-02"
author: "bill0077"
---

## install Flask
Flask를 이용해 기본적인 서버를 만들어보자. 먼저 poetry를 이용해 가장 최신 버전을 설치해주었다. 
```zsh
poetry add flask
```

하지만 여기서 `markupsafe`를 설치하는 과정에서 에러가 발생했다. 
<center>
<img src="___MEDIA_FILE_PATH___/flask-install-failed.png" width="100%" title="flask-install-failed"/>
</center>

markupsafe의 버전도 달리 설치해보고 여러 문제를 확인해 봤지만 결론적으로는 python 3.12를 사용한 것이 문제였다. 오류 메시지 중 **AttributeError: module 'pkgutil' has no attribute 'ImpImporter'. Did you mean: 'zipimporter'?**라는 문장이 있는데, 이는 python 3.12 버전에서는 pkgutil.ImpImporter class가 삭제되었기 때문이다. 따라서 pip 명령이 제대로 작동하지 않아 해당오류가 발생한다. 문제 해결을 위해 python 버전을 3.11에서 가장 최신인 `3.11.8`로 변경해 다시 poetry 설정을 해주었다. 이후 다시 install을 실행하면 문제없이 flask가 설치된다.

## basic server
지연 없이 플레이 가능한 온라인 멀티 웹게임을 위해선 socket 통신이 필요한데, 이를 위해 Socket.IO라는 라이브러리를 사용할 것이다. 
> Socket.IO enables real-time bidirectional event-based communication

Socket.IO는 빠른 통신에 더불어 기존의 웹소켓에 방 생성, 연결 끊김 감지, 자동 재접속 등 다양한 추가기능을 제공해준다. `flask` 서버를 이용할 것이므로 `Flask-SocketIO`를 설치해주자 (client에서도 socketio를 사용해야 client와 server간 소켓 통신이 가능하다. client 부분은 추후 글에서 다룰 예정이다).
```zsh
poetry add flask-socketio
```

설치가 완료되면 Flask-SocketIO를 이용한 minimal application 예제를 실행해보자. 이름은 app.py로 설정하고 `python app.py` 명령을 통해 실행 해보자 (`flask run` 명령을 쓰지 않는 이유는 해당 방법은 WebSocket 지원이 미숙하기 때문이다). `poetry`를 종속성을 관리하는데 사용한다면 `poetry run python app.py` 로 실행 가능하다.
```python
# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

if __name__ == '__main__':
  socketio.run(app)
```

실행후 http://127.0.0.1:5000로 접속해보면 서버가 작동하고 있음을 확인할 수 있다 (서버가 작동하지 않으면 아래의 화면조차 나오지 않음).
<center>
<img src="___MEDIA_FILE_PATH___/flask-minimal.png" width="100%" title="minimal-flask-server"/>
</center>

위의 예제에서 간단한 통신이 가능하도록 docs를 참조해 event listener들을 추가해주자.
> When using SocketIO, messages are received by both parties as events. On the client side Javascript callbacks are used. With Flask-SocketIO the server needs to register handlers for these events, similarly to how routes are handled by view functions.

```python
@socketio.on('my_custom_event')
def handle_my_custom_event(arg1, arg2, arg3):
  print('received args: ' + arg1 + arg2 + arg3)

@socketio.event
def my_custom_event(arg1, arg2, arg3):
  print('received args: ' + arg1 + arg2 + arg3)
```

위 2 listener은 같은 효과를 가진다. client에서 `my_custom_event`라는 메시지를 보내면 서버에서는 해당 메시지의 인자를 위와 같은 형식으로 받을 수 있다. 이때 각 인자들은 string, bytes, int, json 등 다양하게 가능하다.
> The message data for these events can be string, bytes, int, or JSON

위 예제는 서버에서 클라이언트의 메시지를 받는 예제이고, 서버에서 메시지를 보내주는 것은 `socketio.send()`또는 `socketio.emit()`를 통해 가능하다 (send와 emit이 같은 함수는 아니다).
```python
def some_function():
  socketio.emit('some event', {'data': 42})
```

또한 room이라는 개념을 이용해 원하는 클라이언트에만 메시지를 보낼 수도 있다 (각 클라이언트는 초기에 `session id`를 이름으로 하는 room에 배정된다. `join_room()`이나 `leave_room()`으로 room을 생성하거나 들어가고 나갈 수 있다).
```python
def some_function():
  socketio.emit(username + ' has entered the room.', to=room)
```

또한 이벤트중 `connect`와 `disconnect`는 예약되어 있어서 서버에서 각 클라이언트가 연결되거나 연결이 끊어지면 해당함수가 실행된다.
```python
@socketio.on('connect')
def test_connect(auth):
  emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
  print('Client disconnected')
```

위 개념을 적절히 활용해서 간단한 텍스트 메시지 서버를 작성해보았다. 완성된 결과는 아래와 같다.
```python
# app.py
from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'my_secret_key'
sio = SocketIO(app, cors_allowed_origins="*") # allow cors for development

users_online = 0
user = {}

@sio.event
def connect():
  print('connect ', request.sid, flush=True)

@sio.event
def useridInput(data):
  print('userid ', data, flush=True)

  global user, users_online
  if data not in user.values():
    user[request.sid] = data
    users_online+=1
    sio.emit("usersOnline", users_online)
    sio.emit("useridRecieved", data, room=request.sid)
  else:
    sio.emit("duplicateUserid", data, room=request.sid)

@sio.event
def my_event(data):
  print('message ', data, flush=True)

  global user
  sio.emit("msgRecieved", {'userid': user[request.sid], 'data': data})

@sio.event
def disconnect():
  print('disconnect ', request.sid, flush=True)

  global users_online
  if request.sid in user:
    users_online-=1
    user.pop(request.sid)
  sio.emit("usersOnline", users_online)

if __name__ == '__main__':
  print('server start', flush=True)
  sio.run(app, host="0.0.0.0") # address binding for Flask server
```

## frontend
Frontend 부분은 react에서 `npm install socket.io-client`를 통해 socketio-client를 설치한 이후 react 적용 예시 (https://socket.io/how-to/use-with-react)를 거의 그대로 이용했다. (frontend 소스코드는 https://github.com/bill0077/tadak/commit/2b5901f0b69adbbf1065c10a5dcc2a846216c7af#diff-3d74dddefb6e35fbffe3c76ec0712d5c416352d9449e2fcc8210a9dee57dff67 에서 확인할 수 있다. 해당 커밋 버전은 밑의 서버 코드와 조금맞지 않는 부분이 있으나 큰 골자는 같다).

## deploy
위 서버 코드를 이 상태로 실행해보면 아래와 같은 경고 문구가 발생한다.
> **WARNING**: This is a development server. Do not use it in a production deployment.
Use a production WSGI server instead

이는 flask에서 development server가 Werkzeug에 기반을 두고 있기 때문이다.
> The development server is provided by Werkzeug for convenience, but is not designed to be particularly efficient, stable, or secure.

이를 위해 `waitress` 등을 이용할 수도 있지만 최종적으로 Flask-SocketIO가 추천하는 `eventlet`을 이용하기로 결정했다. `socketio.run(app)`를 통해 실행된 서버는 설치된 패키지를 확인하고 `eventlet`, `gevent` 그리고 `flask development server`의 순서로 선택해 해당 패키지로 배포를 진행하게 된다. 따라서 `eventlet`을 사용하려면 단순히 설치해주면 된다. `poetry add eventlet`을 이용해 추가해 주고 실행하면 위의 경고가 나타나지 않는다.
> The current web server choices that are evaluated are eventlet, gevent and the Flask development server.

또한 app.py 서버 코드를 보면 개발단계에서는 편의를 위해 `cors_allowed_origins="*"` 인자를 통해 cross origin을 허용해주었으나, 배포하게되면 Cross-Site Request Forgery 공격 등에 취약해지니 따로 처리해주는 것이 좋다 (https://flask-socketio.readthedocs.io/en/latest/deployment.html).


## reference
stackoverflow, AttributeError: module 'pkgutil' has no attribute 'ImpImporter'. Did you mean: 'zipimporter'?: https://stackoverflow.com/questions/77364550/attributeerror-module-pkgutil-has-no-attribute-impimporter-did-you-mean

Flask-SocketIO, Receiving Messages: https://flask-socketio.readthedocs.io/en/latest/getting_started.html#receiving-messages

Socket.IO, How to use with React: https://socket.io/how-to/use-with-react

Flask-SocketIO, Cross-Origin Controls: https://flask-socketio.readthedocs.io/en/latest/deployment.html

Flask, Deploy to Production: https://flask.palletsprojects.com/en/3.0.x/tutorial/deploy/

Flask-SocketIO, Embedded Server: https://flask-socketio.readthedocs.io/en/latest/deployment.html#deployment

Socket.IO, Client Installation: https://socket.io/docs/v4/client-installation/