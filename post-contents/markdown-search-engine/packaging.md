---
title: "poetry를 이용한 패키징"
date: "2024-05-12"
author: "bill0077"
---

이제 저번에 완성한 검색 엔진을 이 블로그에 적용해보려 한다. 그러려면 기존에는 frontend 부분만 존재하던 ghpages 블로그에 backend server도 달고 새롭게 코드를 짜야 한다. 그런데 서버는 저번에 사용해본(tadak 개발기 참고) flask-socketio를 이용해 만든다 치고, 지금 만들어 놓은 검색 엔진 코드를 어떻게 적용할까? 

소스코드를 직접 복붙하는 건 유지보수 측면에서 최악인것 같고, git clone등을 해도 검색엔진 코드가 바뀔때마다 따로 관리해야된다는 점이 불편할 것 같다. 그래서 이번에 경험삼아 packaging을 통해 검색엔진 코드도 체계적으로 관리하고, PyPI에 배포까지 해보겠다.
 
> **PyPI란?** The Python Package Index (PyPI) is a repository of software for the Python programming language.

PyPI에 배포하게 되면 모든 사람들이 pip install 명령어를 통해 내가 만든 패키지를 다운받을 수 있게 된다. 검색 엔진 모듈을 패키징, 배포한 후 서버 instance에서 패키지를 다운받아 활용하면 될 것 같다.

# 프로젝트 패키징하기
python project를 package로 만들고 배포하는 것에는 여러 방법이 있지만, 나는 그중에서도 poetry를 이용하는 방식을 택했다. 이는 내가 poetry의 기본 구조에 익숙하기 때문도 있지만, depedency managing과 packaging이 pyproject.toml 하나의 파일로 모두 가능하다는 엄청난 장점 때문이다. 또한 poetry에서는 커맨드 몇개로 패키지를 빌드하고 배포하는 기능 또한 제공하고 있다.

글을 본격적으로 시작하기 앞서 아래의 방법은 reference의 JohnFraney.ca의 Create and Publish a Python Package with Poetry라는 글을 많이 참조하였음을 밝힌다.

# 프로젝트 구조 변경
지금 프로젝트는 config.py를 통해 여러 매개변수들을 미리 선언해서 간단히 넘겨주고 있다. 그런데 이 방식은 소스 코드 상태로 이용하기에는 큰 문제가 없을지 몰라도 패키지로 만들게 되면 config를 변경하고 적용하는 부분이 꽤나 귀찮을 것 같았다. 그래서 그냥 전체 매개변수를 모두 입력받도록 모듈들을 변경했다.

또한 poetry로 패키징하는 것이 원활하도록 프로젝트 폴더 아래에 kor_mark_search로 패키지 폴더를 생성하고 `__init__.py`를 추가해 주었다 (만일 `poetry new`로 새로운 프로젝트를 만들었다면 프로젝트 구조가 패키징에 적합한 형태로 생기기 때문에 이 과정은 필요가 없다).
최종적으로 대강 아래와 같은 프로젝트 구조가 만들어졌다.
```python
kor-mark-search
  ├── kor-mark-search
  │    ├── __init__.py
  │    ├── index_search.py
  │    ├── index_builder.py
     ⋮ 
  │    └── utils.py
  ├── .gitignore
  ├── main.py
  ├── pyproject.toml
  └── README.md
```

# pyproject.toml 생성
이제 `poetry init`으로 pyproject.toml 파일을 생성해주자. 패키지 이름이나 license, dependency 등을 지정해 아래와 같은 toml파일이 결과적으로 만들어졌다. 
```toml
# pyproject.toml
[tool.poetry]
name = "kor-mark-search"
version = "0.1.0"
description = "A package suitable for searching queries in Korean-based Markdown, including features such as automatic typo correction."
authors = ["bill0077 <<bill007tjr@gmail.com>>"]
license = "MIT"
readme = "README.md"
homepage = "https://github.com/bill0077/kor-mark-search"
repository = "https://github.com/bill0077/kor-mark-search"
keywords = ["korean", "markdown", "search"]
packages = [{include = "kor_mark_search"}]

[tool.poetry.dependencies]
python = "^3.10"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

위 파일의 구성요소를 차근히 살펴보면
- `name`: 패키지 이름. 소문자로 작성해야 하며, 짧고 직관적인 것이 좋다.
- `version`: 패키지 버전. PyPI에 한번 배포하면 수정하는 것이 불가능하니 버전을 통해 관리해주어야 한다.
- `description`: 패키지의 한줄 소개. 추후에 PyPI 배포하면 한줄 소개에 뜨게 된다. 패키지의 첫인상이나 다름없다.
- `authors`: 패키지 작성자
- `license`: 이 패키지의 라이선스. 나는 MIT를 택했으나 어떤 라이센스를 택할지 모르겠다면 https://choosealicense.com/ 에서 다양한 라이센스를 알아보고 고르면 된다. pyproject.toml에는 poetry에서 기본으로 제공해주는 라이센스를 간단히 선택해 기입할 수 있다 (https://python-poetry.org/docs/pyproject/#license 에서 확인 가능)
- `readme`: README로 쓰일 파일의 경로. pyproject.toml 파일에 대한 상대경로로 적어준다. PyPI에서 상세 페이지에 표시되는 내용이니 다른 사람들도 쓸 수 있도록 README는 꼼꼼히 잘 작성해 주자.
- `homepage`: 패키지 홈페이지. 나는 그냥 github repository로 연결했다.
- `repository`: 해당 패키지의 repository. PyPI에서 링크로 접속 가능하다.
- `keywords`: 해당 패키지를 검색하는데 사용할 키워드.
- `packages`: 이 패키지를 배포할때 포함할 함수나 패키지의 목록.
- `tool.poetry.dependencies`: 해당 패키지의 dependency. python 버전이나 필요한 다른 패키지 등이 기입되어 있다. 
- `tool.poetry.scripts`: 실행 가능한 스크립트. CLI 기능을 추가하는데 사용된다.

위 항목 말고도 원하는 항목을 추가하는 것이 가능하며, https://python-poetry.org/docs/pyproject/ 에서 각 항목에 대해 자세히 확인 가능하다.

# build package
pyptoject.toml까지 만들었다면 패키지를 생성하는 것은 정말 간단하다. `poetry build` 명령을 통해 코드와 wheels archives를 생성할 수 있다.
```cmd
peotry build
```

이러면 프로젝트 폴더에 `dist`폴더가 새로 생성되는데, 여기에 여태까지 build한 결과물이 저장된다.

# publish package
## test with TestPyPI
배포 또한 명령어 한줄로 가능하지만, 그전에 앞서 build한 결과물이 정상적으로 작동하는지 확인해 보자. PyPI에 직접 배포해보기 전에 TestPyPI에서 미리 배포해고 테스트할 수 있다. 참고로 TestPyPI의 계정과 패키지는 경고없이 사라질 수 있으니 문제가 없다는 것을 확인하면 PyPI에도 배포하는 것을 잊지 말아야 한다.
> **TestPyPI** – a separate instance of the Python Package Index that allows you to try distribution tools and processes without affecting the real index.

먼저 TestPyPI 계정을 만들어주자. recovery key등은 안전한 곳에 잘 저장하고, 보안을 위해 Two-factor authentication을 등록해주었다. 나는 google의 Authenticator 어플을 이용했다. 

계정 생성이 완료되면 API token을 생성해주어야 한다. 
Account settings > API tokens에서 새로 token을 하나 생성해주자. 이 token은 한번 생성되면 다시는 따로 확인할 수 없으니, 잘 저장해주어야 한다.

이제 poetry에 만든 계정을 연결해주자. 먼저 아래 명령어를 입력해 TestPyPI를 repository에 추가해준다.
```cmd
poetry config repositories.testpypi https://test.pypi.org/legacy/
```

그리고 앞서 생성한 토큰을 아래와 같이 설정해준다.
```cmd
poetry config pypi-token.testpypi <your-token>
```

이제 시범 배포할 준비가 끝났다! 아래 명령으로 TestPyPI에 앞서 build한 kor-mark-search 패키지를 배포해보자.
```cmd
poetry publish -r testpypi
```

바로 TestPyPI에 접속해 내가 만든 패키지를 확인해 볼 수 있다.
<center>
<img src="___MEDIA_FILE_PATH___/publish-at-testpypi.png" width="100%" title="publish-at-testpypi"/>
</center>

정식 PyPI가 아니기 때문에 일반적인 pip install 명령이 아니라 아래와 같은 명령어로 다운받아 볼 수 있다.
```cmd
pip install -i https://test.pypi.org/simple/ kor-mark-search
``` 

직접 install해 확인해본 결과 패키지 경로 등이 꼬여 오류가 발생했다.. 미리 시험해본 것이 천만 다행이다.

## publish at PyPI
오류를 수정하고 이제 진짜 PyPI에 배포해보자. TestPyPI는 PyPI와는 완전히 독립된 instance이기 때문에 PyPI에서 계정 과정을 다시 해주어야 한다. 똑같이 auth를 등록하고 API token을 생성해 주었다.

그리고 아래의 명령을 차례로 입력해 publish가 가능하다.
```cmd
poetry config pypi-token.pypi <my-token>
poetry publish
```

이제 PyPI 페이지에서 내가 배포한 패키지가 확인 가능하다!
<center>
<img src="___MEDIA_FILE_PATH___/publish-at-pypi.png" width="100%" title="publish-at-pypi"/>
</center>

# 결론
배포 완료한 패키지를 설치해보고 테스트해보자.
```cmd
pip install kor-mark-search
```

<center>
<img src="___MEDIA_FILE_PATH___/test-package.png" width="100%" title="test-package.png"/>
</center>

문제없이 잘 작동한다!

## reference
JohnFraney.ca, Create and Publish a Python Package with Poetry: https://johnfraney.ca/blog/create-publish-python-package-poetry/

Poetry docs, The pyproject.toml file: https://python-poetry.org/docs/pyproject/

Poetry docs, Publishable Repositories: https://python-poetry.org/docs/repositories/#publishable-repositories