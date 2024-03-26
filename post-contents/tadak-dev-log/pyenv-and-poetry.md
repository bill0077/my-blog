---
title: "tadak 개발기 - 1. [Backend] pyenv+poetry를 이용한 dependency managing"
date: "2024-03-02"
author: "bill0077"
---

## 동기
최근 여자친구가 롤토체스에 푹 빠졌다.. 어느샌가 스터디카페 이후 롤토체스 한판이 일상이 되어버렸다. 게임 한판을 하고나면 시간이 애매하게 남는데, 그때 우리는 주로 테트리스나 타자연습 게임을 한다. 그런데 테트리스는 tetr.io라는 좋은 사이트가 있지만 타자연습은 2명이서 즐길만한 게임이 없어서 참 아쉬웠다. 그래서 백엔드 개발도 경험해볼겸 멀티플레이어 타자연습 게임을 개발해보기로 했다. 여자친구가 `tadak`라는 귀여운 이름도 지어주었으니 바로 시작해보자.

## 설계
### Frontend
최근 기술 블로그를 완성하며 react에 대한 기초를 익혔다. 온라인 게임 하나를 만들어보며 복습도 하고 새로운 기술도 배우면 좋을 것 같다.

### Backend
프레임워크는 `Node.js`와 `Flask`중에서 고민했지만, 두 프레임워크 모두 처음부터 배워야하는 상황에서 아무래도 javascript보단 python에 더 익숙하다 보니 `Flask`를 선택하게 되었다.

### Deploy
`github pages`의 경우 static site만 호스팅 가능하다는 단점이 있지만 어차피 백엔드를 따로 분리할 것이기 때문에 상관없을 것 같다. 또한 routing을 위해서는 `HashRouter`을 사용해야 하지만 웹게임에서 각 세부 페이지의 seo가 중요할 것 같지는 않기에 문제 없을 것이다. 따라서 프론트엔드 부분은 react를 github pages에 호스팅하는 방식으로 결정했다.

백엔드의 경우 `oracle cloud`에서 free tier 서버를 기간제한 없이 제공한다는 사실을 알아냈다. 서버는 `docker`로 containerize해서 oracle cloud에서 배포해주면 될 것 같다.

## 프로젝트 시작
본격적으로 프로젝트를 시작하기 전에 준비를 해주자. python으로 서버를 개발하고 containerize한 상태로 배포할 것이기 때문에, dependency 관리가 필수적이다.
python에서 자주 이용되는 dependency managing 도구로는 `poetry`가 있다. python 버전 관리는 `pyenv`, 가상환경과 라이브러리의 종속성 관리는 `poetry`가 하도록 설정해보자.

> **Poetry docs:** Poetry is a tool for **dependency management** and **packaging** in Python. Poetry should always be installed in a dedicated virtual environment to isolate it from the rest of your system.

docs에서 poetry는 반드시 가상환경에 설치되어야 한다고 한다. 이 글에서는 `pyenv`의 plugin인 `pyenv-virtualenv`를 사용해보겠다. 이 글은 windows 10 OS의 `WSL2`에서 `zsh` 쉘을 사용한 환경에서 작성되었음을 알린다 (참고로 `pyenv`는 windows를 직접적으로 지원하지 않는다. windows를 위해서는 `pyenv-win`이라는 개별적인 프로젝트를 많이 이용한다. pyenv-win: it doesn't directly support Windows). 

먼저 python은 현재 시점(2024.03.02)에서 가장 최신 버전인 `3.12.2`버전을 `pyenv`에 설치하고, 해당 버전을 `poetry`에서 사용해보자 (가장 최신 버전을 사용하는게 조금 불안하긴 하지만 문제가 생기면 그때그때 해결해보자).

`pyenv install --list`로 현재 pyenv에서 설치 가능한 python 버전들을 확인할 수 있다. 기존 pyenv버전으론 python 3.12.2는 설치가 불가능했다. pyenv를 업데이트해주고 `3.12.2` 버전을 설치해주었다 (pyenv를 installer로 설치한 경우 pyenv update로 업데이트 가능).
```zsh
pyenv update
pyenv install 3.12.2
```

이제 `poetry`로 dependency를 관리해보자. 먼저 npm의 `package.json`과 비슷한 파일인 `pyproject.toml`이라는 파일을 만들어 주어야 한다. pyproject.toml에는 poetry 가상환경에서 사용할 python의 버전이나 라이브러리의 버전과 같은 종속성이 명시되어있다. `poetry init` 명령어를 통해 `pyproject.toml`를 대화형식으로 생성할 수 있다. 추후 패키지를 설치할 때에는 `poetry add` 명령을 활용해주면 `pyproject.toml`에 해당 내용이 반영된다.
```zsh
poetry init
```

python 버전만 3.12.2로 명시하고 나머지는 전부 건너뛰어서 만들어주었다. 생성된 `pyproject.toml`은 아래와 같다.
```toml
[tool.poetry]
name = "tadak-server"
version = "0.1.0"
description = ""
authors = ["bill0077 <<bill007tjr@gmail.com>>"]
readme = "README.md"
packages = [{include = "tadak_server"}]

[tool.poetry.dependencies]
python = "3.12.2"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

이제 해당 내용을 바탕으로 가상환경을 생성해보자. 이때는 `poetry install`을 이용한다. 
```zsh
poetry install
```

만일 현재 global하게 사용중인 python 버전이 poetry에 명시된 버전에서 호환되지 않으면(=낮으면) 아래와 같은 오류를 뿜으면서 install 명령이 실행 되지 않는다. 
```zsh
The currently activated Python version 3.10.6 is not supported by the project (3.12.2).
Trying to find and use a compatible version.

Poetry was unable to find a compatible version. If you have one, you can explicitly use it via the "env use" command.
```

이때는 pyenv를 통해 설치한 python 3.12.2를 `env use`를 통해 명시주어야 한다 (`which python3` 명령어를 통해서 .pyenv까지의 경로를 알 수 있다). 이후 다시 `poetry install`을 실행해주자.
```zsh
poetry env use /path-to-pyenv/.pyenv/versions/3.12.2/bin/python
```

`poetry env list`명령으로 가상환경이 잘 생성되었다는 것을 확인할 수 있다. poetry 내부에서 python을 실행하려면 `poetry run` 명령을 사용하면 된다. 예를 들어 `poetry run python --version`를 실행하면 poetry내부 가상환경에서의 python 버전을 확인 할 수 있다. 실행 결과 설정한대로 `Python 3.12.2`라고 잘 출력됨을 확인할 수 있다.

## reference

poetry, poetry-docs: https://python-poetry.org/docs/

pyenv, pyenv-virtualenv: https://github.com/pyenv/pyenv-virtualenv

앎의 공간 YounghunJo, [Python] pyenv 와 poetry의 개념, 그리고 두 개를 함께 사용하기: https://techblog-history-younghunjo1.tistory.com/548