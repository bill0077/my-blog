---
title: "그냥 기록"
date: "2024-02-19"
author: "bill0077"
---

Gatsby가 갑자기 build가 안될 때: https://github.com/gatsbyjs/gatsby/issues/27644
가끔 build가 안되면 .cache, public 내부를 지우고
```cmd
npm rebuild --update-binary
```
실행 이후 다시 build 해주면 되는 경우가 많다.
(build는 잘 되는데 deploy 안되는 경우에도 마찬가지)