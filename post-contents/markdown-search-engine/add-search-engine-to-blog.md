---
title: "한국어 마크다운 검색엔진 블로그 적용"
date: "2024-05-19"
author: "bill0077"
---

저번에 만들었던 패키지를 이용해서 이 블로그에 적용해보았다.

tadak을 만들면서 (https://bill0077.github.io/my-blog/tadak-dev-log/ 에서 볼 수 있다) 썼던 코드들을 많이 재활용해서 server 코드를 만들고 oracle cloud에 배포까지 진행했다.

서버는 간단한 로직을 따른다. 세션으로부터 query가 도착하면 `kor-mark-search`의 search 함수에 넣고 돌려서 결과를 해당 세션으로 돌려준다. 그러면 다시 frontend에서 그 결과를 해석해 검색 결과 페이지를 재구성하는 방식이다.

## 결과

<center>
<img src="___MEDIA_FILE_PATH___/blog-search-from-home.png" width="100%" title="search-from-home"/>
</center>

<center>
<img src="___MEDIA_FILE_PATH___/blog-search-result.png" width="100%" title="search-result"/>
</center>

의도한대로 검색이 잘 되는 것을 확인할 수 있다!

## TODO
지금 버전은 최소한의 기능만 구현한 데모 버전이다. 아래와 같은 개선이 필요할 것 같다.

1. 지금은 단순히 검색에 필요한 index 파일을 서버 container에 포함시켰다. 추후에는 주기적으로 블로그 포스팅들을 직접 다운로드해서 index 파일을 스스로 생성하도록 만들어 주어야 할 것이다. 
2. 또한 지금은 모든 요청에 대해 전부 검색 함수를 실행하는데, 이는 서버 과부하에 매우 취약할 것이다. cache를 따로 저장하거나 요청 빈도에 따라 다르게 대응하는 전략을 생각해 보아야겠다. 
3. 마지막으로 `kor-mark-search`를 실제로 사용하다보니 개발 단계에선 느껴지지 않던 검색 딜레이가 크게 체감된다! 빨리 더 나은 알고리즘을 고안해봐야겠다.

## reference
지금 이 블로그