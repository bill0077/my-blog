---
title: "각종 파일 백업하기"
date: "2024-05-24"
author: "bill0077"
---

결국 입대가 찾아오고 말았다.

입대전에 내 자식과도 같은 파일들을 전부 업해놔야겠다.

## 암호화
혹시나 모를 사태를 위해 민감한 정보는 암호화해두자. 중요한 데이터는 모두 하나로 모아 압축해준 이후 gpg를 이용해 암호화해 주었다.

**Encrypting a file**
```cmd
gpg -c file.tar.gz

< Set passphrase and repeat passphrase >
```

**Decrypting a file**
```cmd
gpg file.tar.gz

< Passphrase prompt >
```


## wsl 백업
사용하던 wsl 인스턴스도 백업해 주자. 아래 명령은 wsl이 아니라 Powershell에서 실행해주어야 한다.

현재 실행중인 wsl 인스턴스 목록은 아래 명령어로 확인 가능하다
```powershell
wsl -l -v
```

**Export wsl**
```powershell
wsl --export Ubuntu d:\Ubuntu_backup_20240524.tar
```

**Import wsl**
```powershell
wsl --import Ubuntu . d:\Ubuntu_backup_20240524
```

## reference
Ken Hess, File encryption and decryption made easy with GPG: https://www.redhat.com/sysadmin/encryption-decryption-gpg

makepluscode, WSL 백업하고 다른 위치에서 복원하기: https://makepluscode.tistory.com/271