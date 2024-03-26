---
title: "tadak 개발기 - 4. [Backend] ssl 설정"
date: "2024-03-04"
author: "bill0077"
---

저번에 local dev server에서 실행한 frontend 부분이 oracle cloud의 서버에 잘 접속이 되는 것을 확인하고 바로 github pages에 deploy해서 확인해 보았다. 하지만 접속해본 결과
```bash
127.0.0.1 - - [20/Mar/2018 17:07:33] code 400, message Bad request version ("▒\x9c▒▒{▒'\x12\x99▒▒▒\xadH\x00\x00\x14▒+▒/▒,▒0▒\x13▒\x14\x00/\x005\x00")
```
https://stackoverflow.com/questions/49389535/problems-with-flask-and-bad-request에서 나타난 것과 비슷하게 특수문자를 마구 뿜을 뿐이었다. 해당 stackoverflow 질문글에서 문제 원인이 http가 아니라 https로 접속했기 때문이라는 것을 알았다. frontend에서 http로 요청하도록 바꾸어 다시 배포해보았지만, 여전히 `Mixed Content`에러를 띄우며 접속이 되지 않는다. 
```bash
Mixed Content: The page at '<URL>' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '<URL>'. This request has been blocked; the content must be served over HTTPS.
```

> 안전하지 않은 HTTP 프로토콜을 사용하여 하위 리소스를 요청하면 이러한 요청은 공격자가 네트워크 연결을 도청하여 두 당사자 간의 통신을 보거나 수정하는 경로 내 공격에 취약하므로 전체 페이지의 보안이 약화됩니다. 

결론적으로 https 사이트에서 취약한 http사이트에 자원을 요청하는 시도는 브라우저 단에서 막아놓는다는 것이다. 그렇다고 서버에 http연결을 위해 frontend 배포에 http 프로토콜을 이용하는 것은 말이 안된다. 결론적으로 frontend는 https 연결을 사용할 수밖에 없으므로, 서버에서 https 프로토콜을 사용하는 수밖에 없다. 간단히 만든 서버를 잘 배포되는지 확인해보려고 했는데, 꽤나 고려할 사항이 많은 것 같다.

## ssl 설정
처음에는 `let's encrypt`, `certbot` 등을 이용해 직접 ssl certificate 파일들을 받아서 flask에 적용하는 방식으로 해결하려고 했다. 하지만 구글링 결과 확장성, balancing 등의 이유로 reverse proxy 없이 직접 flask를 deploy에 이용하는 방식이 이러한 방식이 좋은 건 아닌것 같다 (출처: https://community.letsencrypt.org/t/attempting-to-launch-flask-socketio-with-issued-ssl-certificate/153396). 대신 let's encrypt 커뮤니티에서 `Caddy`라는 플랫폼에서 https를 자동으로 제공하는 reverse proxy 서버 기능이 있다는 알았고, 바로 적용해보기로 했다.

## Caddy
Caddy가 뭔지 간략히 알아보자
> **Every site on HTTPS**  
> Caddy is a powerful, extensible platform to serve your sites, services, and apps, written in Go. If you're new to Caddy, the way you serve the Web is about to change.
> 1. Easy configuration with the Caddyfile
> 2. Automatic HTTPS by default
> 3. Highly extensible modular architecture lets Caddy do anything without bloat

Nginx와 비슷하지만 자동으로 https 프로토콜을 가능하게 해준다는 점이 굉장히 큰 장점인 것 같다. 또한 사용이 매우 간단히 진입장벽이 적다고 한다. 바로 설치해서 사용해보자. 환경은 WLS2의 Ubuntu를 기준으로 한다.
```zsh
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

설치 이후 `caddy run` 명령을 통해 잘 설치되었는지 확인할 수 있다. 

설치가 완료되었다면 먼저 tls를 적용할 도메인을 먼저 구매해주자. 배포할 단계가 아니라면 구매하지 않고 하는 방법이 있긴 하지만 도메인이 있는 편이 훨씬 간편하다. Godaddy에서 1년에 12$로 적당한 도메인을 하나 구매해줬다. 구매한 도메인의 A 레코드에 나의 vm instance를 등록해주는 것을 잊지말자. 그리고 http를 위해 port 80, https를 위해 port 443번을 열어준다. 여기까지 준비가 되었다면 바로 Caddy를 이용해 reverse proxy 서버를 사용할 수 있다. 구매한 도메인으로부터 현재 서버가 열려있는 port 5000번으로의 reverse proxy서버를 `reverse-proxy` 명령을 이용해 열어주자.
```bash
caddy reverse-proxy --from backendserverodomain.com --to :5000
```

간단하게 load balancing이 적용된  reverse proxy 서버를 열 수 있다!
> **Caddy Docs**: Load balancing is typically used to split traffic between multiple upstreams. By enabling retries, it can also be used with one or more upstreams, to hold requests until a healthy upstream can be selected (e.g. to wait and mitigate errors while rebooting or redeploying an upstream). This is enabled by default, with the `random` (randomly chooses an upstream) policy

## 결론
`Caddy`의 reverse-proxy를 이용해 backend server와 서버 도메인 사이의 reverse proxy 서버를 생성했다. 이로써 oracle cloud vm에 docker container로 감싼 flask서버를 배포, https 프로토콜로 접속하는 것에 성공했다.

## reference
Stackoverflow, Problems with flask and bad request: https://stackoverflow.com/questions/49389535/problems-with-flask-and-bad-request

web.dev, 혼합 콘텐츠란 무엇인가요?: https://web.dev/articles/what-is-mixed-content?hl=ko

Let's Encrypt, Attempting to launch Flask/Socketio with issued SSL Certificate: https://community.letsencrypt.org/t/attempting-to-launch-flask-socketio-with-issued-ssl-certificate/153396

Caddy documentation, Welcome to Caddy: https://caddyserver.com/docs/

Caddy documentation, Install: https://caddyserver.com/docs/install

Caddy documentation, Reverse proxy quick-start: https://caddyserver.com/docs/quick-starts/reverse-proxy

Caddy documentation, Automatic HTTPS: https://caddyserver.com/docs/automatic-https

Caddy documentation, reverse_proxy: https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#load-balancing