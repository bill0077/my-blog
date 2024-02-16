**Date: 2024.01.29**

### Docker란?
`Docker`가 무엇인지 먼저 공식 홈의 소개를 읽어보자.

> **What is Docker?**  
Accelerate how you build, share, and run applications
Docker helps developers build, share, run, and verify applications anywhere — without tedious environment configuration or management.

Docker 공식 문서에서 말하듯이 Docker는 제품을 빌드, 공유, 실행하는 것을 도와주는 도구이다. 왜 이러한 과정이 필요할까?
<center>
<img src="___MEDIA_FILE_PATH___/it_works_on_my_computer.png" width="50%" title="docker-building"/>
</center> 
어플리케이션을 실행하려면 개발환경과 배포환경이 필요하다. 만일 A가 잘 작동하는 서버를 만들어놓았고, 서버 증설 등의 이유로 B가 그 서버를 똑같이 따라한다고 해보자. B가 A의 서버와 운영체제, 컴파일러, 패키지 등을 모두 동일하게 맞추기 위해서는 굉장한 노력을 들여야할 것이다. 이는 A가 시간이 지나고 다시 동일한 서버를 구성하려고 해도 마찬가지로 발생하는 상황이다. 이러한 과정에서 원본과는 조금씩 다른 서버들, 즉 *눈송이 서버*(눈송이가 모두 서로 다른 모양이듯이)들이 발생하게 되고, 초기에는 큰 문제가 없었더라도 시간이 지나면 눈송이가 불어나 어떤 문제를 야기할지 모르는 상태가 되는 것이다.

이러한 문제를 해결하기 위해 다양한 방법들이 제안되었고, 현재 산업에서의 표준이 바로 Docker이다. 우리는 Docker를 활용함으로써 서버마다 완전히 동일한 환경을 구성하고, 언제 구성한 서버라도 멱등성(동일한 요청에 의해 여러 번 연산을 수행하더라도 동일한 결과를 나타내는 것을 의미)을 확보할 수 있게 된다.

그럼 Docker는 어떻게 작동하는 것일까? 만일 특정 서버를 구성하는 것에 있어 완전히 상세하고 정확한 구성 기록이 있다면, 이 구성을 따라하는 것만으로도 동일한 서버를 구성할 수 있을 것이다. 비슷하게 Docker에는 `dockerfile`이라는 이름의 서버 구성 기록이 있고, 이 기록을 따라 서버를 구성하면 완전히 동일한 서버가 완성되는 것이다. 

dockerfile의 용도를 알았으니 docker의 작동 과정을 조금만 더 자세히 살펴보자. 궁극적으로 우리가 docker에서 원하는 것은 완전히 동일한 환경을 가진 어플리케이션을 실행하는 것이다. 이를 위한 가상환경 런타임 환경을 `container`이라고 한다. container가 런타임 환경을 구성하고 애플리케이션을 실행하므로, 동일한 container만 있으면 어떤 물리적 시스템에서도 동일한 어플리케이션이 실행 가능한 것이다. 그리고 container를 서버마다 동일하게 만들기 위해서는 똑같은 틀로 찍어내면 되는데, 이 틀을 `image`라고 한다. image는 코드, 라이브러리, 의존성 등 특정 애플리케이션이 작동하는 데 필요한 모든 것이 들어있는 템플릿이라고 볼 수 있고, image를 실행하는 것으로 container를 만들 수 있다. 위에서 언급한 dockerfile이 바로 이 image를 생성하는 설정을 담은 파일이다.

앞서 image는 일종의 템플릿이라고 했다. 그런데 만일 image 내부에 수정사항이 조금 생기게 되면, 실행 환경에 변경이 생기므로 image를 새로 만들어야 할 것이다. 그런데 문제는 하나의 변경사항으로 인해 전체 image를 처음부터 다시 만드는 것은 비효율적이라는 것이다. 이를 위해 docker에서 지원하는 것이 `layering`이며, docker에서 꼭 언급되는 개념 중 하나이다. layering은 image에 변경사항이 생길때마다 전체 image를 새로 만들지 말고, 변동 사항 이전의 부분은 그대로 사용하되 해당 변경 사항을 layer로 추가해서 새로운 image를 만들어 주자는 것이다. 이 layering 개념을 잘 설명한 글이 있어서 이를 옮겨왔다(reference의 KodeKloud 링크 참조).

> A Docker image is composed of multiple layers stacked on top of each other. Each layer represents a specific modification to the file system (inside the container), such as adding a new file or modifying an existing one. Once a layer is created, it becomes immutable, meaning it can't be changed. The layers of a Docker image are stored in the Docker engine's cache, which ensures the efficient creation of Docker images.


docker와 비슷한 기능을 수행하는 virtual machine과 비교했을 때 Docker의 장점은 가볍고 속도가 빠르다는 것이다. 이는 작동 방식의 차이로 인한 것인데, 독립된 가상의 하드웨어를 부여받은 vm은 각 환경마다 OS가 필요해 이 OS들을 위한 자원이 추가적으로 필요한 반면, docker는 host OS의 커널(정확히는 host OS 위에서 docker가 만들어낸 guest OS인 linux의 커널을 말한다. 즉 docker는 linux kernel을 이용한다)을 공유하기 때문에 이러한 자원의 소모를 막을 수 있다(다만 vm의 본래 목적은 멱등성 확보가 아니라 하나의 물리적인 시스템에서 여러 OS를 독립적으로 실행하는 것이기에 무조건적으로 vm이 안좋은 것이 아니다).

## reference
docker.com, what is container: https://www.docker.com/resources/what-container/

내가 보기 위한 기록, Docker Container와 Image란 무엇인가?: https://sunrise-min.tistory.com/entry/Docker-Container%EC%99%80-Image%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80

reaccoony, 왜 굳이 도커(컨테이너)를 써야 하나요?: https://www.44bits.io/ko/post/why-should-i-use-docker-container

KodeKloud, What Are Docker Image Layers and How Do They Work?: https://kodekloud.com/blog/docker-image-layers/

amazon AWS, 도커와 VM의 차이점은 무엇인가요?: https://aws.amazon.com/ko/compare/the-difference-between-docker-vm/