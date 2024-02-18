---
title: "개발 블로그 개발기 - 2. 프로젝트 시작 & Docker 설정"
date: "2024-01-21"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/79bdca8166fb45089fa90bd00b19134d70767741**

이번 글에서는 개발 블로그를 만드는 프로젝트의 첫 삽을 뜨고, 간단히 Docker를 설정해보도록 하겠다. 블로그는 react를 이용해 개발을 진행할 예정이다. 이름은 my-blog로 정하고 `create-react-app`으로 프로젝트를 초기화했다.
```cmd
npx create-react-app my-blog
```
그리고 Docker와 git을 설정해보자. 나는 이 블로그 규모가 커지면 github page가 아니라 개인적으로 호스팅 할 계획이고 또 지금 사용하는 노트북을 언제 바꿀지 모르기 때문에 미래의 나를 위해 미리 Docker를 준비하기로 했다(github pages만 이용할 것이라면 어차피 `npm run build`로 빌드된 결과를 github에서 호스팅하는 것이기 때문에 docker가 필수는 아니다). docker에 관한 내요은 나중에 따로 정리해보도록 하겠다(LINK 여기에서 확인해볼 수 있다).

### dockerfile 작성하기
docker을 설정하기 위해선 `Dockerfile`을 작성해 주어야 한다. 결과부터 보자면 최종적으로 완성된 dockerfile은 아래와 같다. 해당 내용을 "Dockerfile" 이라는 이름으로 확장자 없이 프로젝트 디렉토리 최상단에 위치하면 된다 (이름이 바뀌면 build나 실행 시 여러 추가 설정이 필요하다).
```Dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR "/usr/src/app"

COPY package.json package-lock.json ./

RUN npm install --

COPY ./ ./

ENTRYPOINT ["npm", "start"]
```
이제 위 Dockerfile을 차근차근 살펴보자.

### 1. BaseImage 지정하기 - FROM
Dockerfile은 `BaseImage`를 설정하는 것으로 시작된다. 이는 환경을 처음부터 모두 직접 만드는 대신 기존의 세팅을 이용해 작업을 진행할 수 있도록 해준다. (이렇게 층층이 원하는 환경을 쌓는 것을 layering이라고 한다)
```Dockerfile
FROM node:18-alpine
```
FROM 다음의 node(react를 활용해 js 프로젝트를 만들 것이기 때문에 node 이용)는 이미지 명이고, 18은 버전, alpine은 최소단위의 Linux 버전을 말한다.

### 2. 작업 경로 설정하기 - WORKDIR
현재 DockerImage에는 BaseImage만 존재하는 상태이다. 여기에 RUN, COPY 등의 명령어를 이용해 우리가 원하는 환경을 설정하기 위해서는 원하는 소스 코드를 복사하고, 필요한 라이브러리를 설치하는 등의 작업을 해야한다. 이때 해당 작업을 어떤 폴더에서 진행할지 (DockerImage 내부가 아닌 현재 개발 환경 기준)를 설정하기 위해 WORKDIR을 이용한다.
```Dockerfile
WORKDIR "/usr/src/app"
```
WORKDIR을 이용해 작업할 폴더를 이동할 수 있다. (linux의 `cd`와 같은 역할) Dockerfile의 이후 명령은 /usr/src/app 폴더에서 실행된다.

### 3. 프로젝트 파일 복사하기 - COPY
다음으론 DockerImage 내부에서 사용할 프로젝트 파일을 복사해와야 한다. 이때 Dockerfile은 명령어 한 줄, 한 줄이 Layer 형식으로 실행된다. 따라서 변동성이 적은 파일을 우선 Layer로 깔아놓는 것이 추후에 DockerImage를 build할때 시간을 절약할 수 있다.
```Dockerfile
COPY package.json package-lock.json ./
```
```Dockerfile
COPY ./ ./
```
첫번째 COPY는 현재 디렉토리의 package.json, package-lock.json을 컨테이너의 ./로 복사하라는 의미를 가진다. 종속성은 변하지 않았는데도 소스코드가 변경될 때마다 DockerImage를 처음부터 다시 build 한다면 멀쩡한 환경을 다시 설정하느라 시간이 낭비될 것이다. 대신 환경에 영향을 미치는 package.json, package-lock.json를 먼저 layer로 쌓아 놓으면 이 단계까지는 cache되어 build 속도가 빨라진다. 이후 다시 모든 파일을 복사해 필요한 파일을 준비해준다.

### 4. 라이브러리 설치하기 - RUN
그 후 RUN이라는 명령어를 통해서 `npm install` 등을 실행하여 package.json에 명시되어있는 라이브러리를 모두 설치해준다. 
```Dockerfile
RUN npm install
```
이때 npm install 명령어를 사용하면 만약 package.json에 버전을 하나로 명시하지 않고 ^4.17.3 등으로 입력한 경우 해당 4.17.5, 4.17.6등의 버전이 설치될 수도 있으므로 버전 차이가 생길 수 있다. `npm ci`를 이용하면 package-lock.json을 활용해 명확한 버전을 설치하기 때문에 위 문제를 해결할 수 있다. 나는 그냥 npm install을 이용했다. 라이브러리 설치 이외에도 RUN 명령문으로 할 수 있는 작업은 매우 다양하지만, 현재 상태에서는 이정도면 충분하다.

### 4. 실행시키기 - ENTRYPOINT
ENTRYPOINT는 해당 컨테이너가 수행될 때 특정 명령을 수행하도록 지정해주는 것이다. 비슷하게 `CMD`가 있는데, CMD는 ENTRYPOINT처럼 고정된 명령이 아니라 container 실행시 필요에 따라 인자를 변경할 수 있다는 차이가 있다.
```Dockerfile
ENTRYPOINT ["npm", "start"]
```
ENTRYPOINT라는 명령어를 사용해서 node라는 것을 실행할 것이고, index.js를 실행하는 명령어이다.

### .dockerignore
`.dockerignore`는 .gitignore과 비슷하게 필요없는 파일들은 DockerImage 속에 포함하지 않도록 명시해주는 파일이다. .dockerignore는 build 속도를 향상하고, 안전한 이미지를 최적화 하는 것에 도움을 준다 (실제로 .dockerfile을 작성하지 않으면 10분이 넘게 걸리던 build 과정이 .dockerignore 이후 40초 이내로 종료되었다 😲). Dockerfile과 마찬가지로 .dockerfile의 이름을 그대로 이용하도록 하자 (.dockerignore를 .Dockerignore로 잘못 써서 뭐가 문제인지 한참 고민을 했다).  node-modules, build, 및 .git, /gitignore, Dockerfile, .dockerignore, .md 등의 파일들은 컨테이너 환경에서는 전부 필요 없으므로 제외해주면 된다 (*를 통해 특정 확장자를 가진 모든 파일을 제거할 수 있다). 완성된 .dockerignore는 Dockerfile과 같이 프로젝트 최상위 디렉토리에 위치하면 된다.
```Dockerfile
# .dockerignore
node-modules
build
.git
.gitignore
Dockerfile
.dockerignore
*.md
```

## build 및 실행
`Dockerfile` 및 `.dockerignore`을 모두 작성했다면, 이제 build 명령어를 사용해서 이미지를 만들면 된다. 

```cmd
docker build -f Dockerfile -t myblog-docker .
```
"docker build -f **도커_파일_이름** -t **만들어질_이미지_이름** **필요한_파일의_상대위치**" 의 형식에 맞춰 명령을 실행해주면 된다. 여기서는 image 이름을 myblog-docker로 지정하고 파일 위치는 현재 디렉토리임으로 위와 같은 명령을 실행하였다. 그러면 아래처럼 로그를 뿜으면서 이미지를 생성하게 된다.

<center>
<img src="___MEDIA_FILE_PATH___/docker_building.png" width="80%" title="docker-building"/>
</center>

react app의 경우 `npm start` 명령어로 실행하게 되면 기본적으로 3000번 포트에서 실행된다. 그러므로 완성된 이미지를 -p 옵션으로 호스트의 포트 3000과 컨테이너의 포트 3000 간에 매핑을 생성하고 실행해보자. 이후 호스트의 브라우저에서 http://localhost:3000을 열어 확인해 보면 잘 실행되는 것을 알 수 있다.
```cmd
docker run -p 3000:3000 myblog-docker
```

## reference
잉여로운 개발일지, [Docker] Node 환경 만들기: 
https://bum-developer.tistory.com/entry/Docker-Node-%ED%99%98%EA%B2%BD-%EB%A7%8C%EB%93%A4%EA%B8%B0

DaleSeo, Dockerfile에서 자주 쓰이는 명령어: https://www.daleseo.com/dockerfile/