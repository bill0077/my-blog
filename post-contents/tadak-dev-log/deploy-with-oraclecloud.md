---
title: "tadak 개발기 - 3. [Backend] Oracle Cloud free tier에 tadak-server 배포"
date: "2024-03-04"
author: "bill0077"
---

frontend는 github pages에서 호스팅하고 있고, backend는 평생 무료 vm을 2개나 제공해주는 oracle cloud에서 `docker`를 통해 호스팅하기로 결정했다. 이 글에서는 그 과정에서 해결한 **여러가지** 문제를 다뤄보겠다. 크게 3가지 과정으로 분리해 보았다.
1. dockerfile 작성
2. oracle vm instance 생성 및 접속
3. 생성된 vm instance에서 docker image build 및 run

### dockerfile 작성
경우에 따라 oracle cloud의 vm instance를 초기화하거나 만에하나 다른 서비스를 이용하게 될지도 모른다. 그게 아니더라도 oracle vm에서 현재 local과 완전히 동일한 서버 설정을 할 수 있을 확률은 매우 희박하다고 생각한다. 따라서 docker을 이용해 개발중인 서버를 containerize한 상태로 배포하는 것이 편할 것이라고 생각했다. 현재 프로젝트가 `poetry`를 이용해 depedency를 관리하므로 가상환경 설정 또한 poetry install을 통해 쉽게 가능하다. 완성한 `Dockerfile`과 `.dockerignore`는 아래와 같다. `git clone`으로 repository를 복사하고 `docker build`를 실행하면 /usr/src/app 경로에 필요한 파일을 복사하고 poetry가 venv를 생성, 서버(app.py)가 해당 환경에서 실행된다.
```Dockerfile
# Dockerfile
FROM python:3.11

WORKDIR "/usr/src/app"

RUN pip install poetry

COPY pyproject.toml poetry.lock ./

RUN poetry install

COPY ./ ./

ENTRYPOINT ["poetry", "run", "python", "app.py"]
```
```Dockerfile
# .dockerignore
__pycache__
.venv
.git
.gitignore
Dockerfile
.dockerignore
*.md
```

아래 두 명령으로 image를 빌드하고 실행해보면 잘 작동하는 것을 확인할 수 있다.
```cmd
docker build -f Dockerfile -t tadak-docker .
docker run -p 5000:5000 tadak-docker
```
<center>
<img src="___MEDIA_FILE_PATH___/docker-working.png" width="100%" title="docker-working"/>
</center>

### oracle cloud 인스턴스 생성 및 접속
이제 만들어진 container를 호스팅할 vm instance를 만들어 보자. 먼저 oracle cloud에서 회원가입하고 oracle mobile authenticator 앱도 다운받아 준다.authenticator를 이용해 oracle cloud에 접속하면 free tier vm을 무료로 생성할 수 있다.

하단에 `Create a VM instance`를 클릭해 vm instance를 생성해보자. 이때 `Image and Shape` 항목에서 기본 설정인 oracle linux가 아닌 ubuntu로 변경하는 것을 추천한다. 기본 설정인 oracle linux의 경우 `apt-get` 명령이 존재하지 않는 등 몇번의 시행착오 끝에 속 편하게 그냥 `ubuntu`로 설정하였다. 또한 `Add SSH keys`에서도 Save private key로 private key를 다운받거나 public key를 등록해주어야 나주에 ssh로 접속해서 원활히 사용이 가능하다. **SSH 키의 경우 지금 화면에서밖에 설정할 수 없으니 조심하자!**

이후로 생성을 완료하면 Dashboard에서 나의 instance 목록을 확인할 수 있다. 생성된 instance를 클릭하면 IP주소나 user 이름(기본은 ubuntu) 등을 확인할 수 있다.

이제 생성한 instance에 SSH를 이용해 접속해보자. 나는 vscode에서 작업하기 위해 vscode의 `SSH FS`라는 extension을 이용해 접속하였다. 사용하는 방법은 간단하다.
1. vscode의 Extensions에서 SSH FS를 추가하고
2. SSH FS의 `Configurations`에서 `Create a SSH FS Configuration` 클릭
3. 이름을 간단히 설정해주고 Host와 Port 부분에서 Oracle vm instace의 IP와 port(보통은 22)를 입력
4. `Private key`에서 다운받은 SSH key의 경로 입력

이후 `Open remote SSH terminal`을 통해 oracle vm instace에 접속 가능하다. 접속이 되었다면 유저 비밀번호 설정등 보안에 신경써주자.

## 생성된 vm instance에서 docker image build 및 run
vm에 접속해서 서버를 직접 실행해보자. 먼저 `git clone`으로 서버파일, dockerfile 등이 포함된 repository를 받아왔다. 이후 위에서처럼 `docker build -f Dockerfile -t tadak-docker .` 명령을 실행해보면 `docker`가 없다고 나온다. 먼저 docker부터 깔아주자 (git은 ubuntu vm의 경우 기본 설치되어있다). docker docs에서 제시하는 방법 그대로 따라가면 된다.

먼저 docker의 apt repository를 설정해주자.
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

이후 apt-get을 이용해 최신 버전의 docker을 설치해준다.
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

설치가 끝나면 아래 명령을 실행해봄으로써 설치가 잘 진행되었는지 확인할 수 있다. 설치가 잘 되었다면 해당 명령을 실행했을 때 image pull등의 작업 이후 hello-world가 출력된다.
```bash
sudo docker run hello-world
```

docker 설치 이후 다시 image build 명령을 해도 `ERROR: permission denied while trying to connect to the Docker daemon socket at...`처럼 권한이 없다며 실행되지 않는다. 단순히 sudo를 사용해도 되지만 docker를 매번 root 권한으로 실행하기는 번거로워보인다. docker docs에서 안내해주는대로 docker group에 user를 추가해보자. 다만 docker group이 user에게 root-level 권한을 준다는 것은 주의해야 한다.
> The docker group grants root-level privileges to the user. 
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

이 과정에서 vm 재시작이 필요할 수도 있다. 이제 다시 sudo 권한없이 `docker run hello-world` 명령을 실행해보면 잘 작동함을 알 수 있다. 이제 매 실행마다 sudo를 붙일 필요 없이 docker 명령 실행이 가능해진다. 이제 진짜로 image build및 실행을 해보자.
```bash
docker build -f Dockerfile -t tadak-docker .
docker run -p 5000:5000 tadak-docker
```

여기까지 문제가 없다면 docer container 내부의 서버가 잘 실행되고 있음을 확인할 수 있을 것이다. 
<center>
<img src="___MEDIA_FILE_PATH___/docker-running.png" width="100%" title="docker-running"/>
</center>


그런데 서버가 잘 실행되는것을 확인하고 해당 container을 실행하는 vm의 public ip와 port를 통해 접속을 하려 해도 접속이 되지 않는다. `docker run` 명령에서 container의 port binding까지 해놓았는데, 무엇이 문제일까?

결론적으로 이는 방화벽 문제였다. docker에서 port binding을 통해 docker container내부와 host(이 경우엔 host는 vm의 ubuntu)간 통신은 가능하지만 vm 외부에서 접속하려는 시도를 firewall에서 막기 때문에 접속이 안되는 것이었다. oracle vm instance는 oracle cloud 방화벽과 ubuntu os자체의 방화벽 2개가 모두 적용되어 있다. 외부와의 통신을 위해 vm과 ubuntu os의 방화벽을 설정해주자.

oracle cloud의 방화벽 설정 방법은 여기에 나와 있다 (https://www.oracle.com/webfolder/technetwork/tutorials/obe/cloud/compute/permitting_public_tcp_traffic_to_compute_instances/permitting_public_tcp_traffic_to_compute_instances.html). 자세한 설명은 이 2곳에서 찾아보면 좋을것 같다 (https://kibua20.tistory.com/124, https://pivox.tistory.com/47). 위 블로그에서 찾은 방법대로 방화벽을 설정하고 나면 이전에는 외부요청에 묵묵부답이던 서버가 요청에 잘 응답함을 확인할 수 있다.
<center>
<img src="___MEDIA_FILE_PATH___/after-firewall-setting.png" width="100%" title="after-firewall-setting"/>
</center>

**다만!** 지금 서버에서 외부 접속이 잘 되는 것은 frontend를 local development server에서 실행했기 때문이다. 만일 현재까지 개발된 frontend를 github pages와 같은곳에 호스팅하고 배포해보면 서버에 접속하지 못한다. 이는 현재 backend 코드는 ssl을 일체 사용하지 않는 반면, github pages에서는 https를 지원하기 때문이다. 따라서 현상태에서는 https frontend가 http 요청을 서버에 하게 되는데, 이때 브라우저 단에서 Mixed content 에러가 발생하며 서버 접속에 실패한다. 이를 위해서는 backend ssl 설정이 필요하다. 이건 다음 글에서 다뤄보겠다.

## reference
docker docs, Install using the apt repository: https://docs.docker.com/engine/install/ubuntu/

docker docs, Manage Docker as a non-root user: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user