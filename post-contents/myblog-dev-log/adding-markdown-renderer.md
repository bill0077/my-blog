---
title: "개발 블로그 개발기 - 7. Post 페이지 만들기"
date: "2024-02-14"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/c030623bfdbe6c13103e021cef33d504edbdc7f0**

현재까지 만든 블로그는 홈과 dummy인 목차와 추천 글 항목만이 있을 뿐이다. 이제 실제로 글을 포스팅 할 수 있도록 구현해보자.

## 글 페이지 만들기
Gatsby를 이용해 라우팅을 구현하며 Post 컴포넌트가 마크다운 파일들을 읽어와 각 페이지에서 보여주는 것까지 구현했다. 이제 마크다운 파일에서 그냥 텍스트를 불러오는 것이 아니라 html로 변환해서 사용자가 더 글을 읽기 편하도록 구현하는 것이 목표이다.

### gatsby-transformer-remark & gatsby-source-filesystem
이 방법은 쉽게 gatsby project에서 마크다운을 html로 변환하는 것이 가능하지만, 여러개의 source, 즉 여러개의 .md 파일들이 존재한다면 굉장히 처리가 복잡해지는 단점이 있다. 나는 디렉토리별로 카테고리를 분류하고, 목차 등을 폴더 구조에 따라 완성하고 싶었기 때문에 이 방법을 택하지 않았다.

### react-markdown
`gatsby-transformer-remark`를 제외하고 react에서 마크다운을 렌더링하는 방법을 찾아보았을 때 가장 상위에 노출되는 `react-markdown`이라는 패키지를 사용해보자. 이 패키지는 XX하는 패키지이다.
설치를 진행하자. 마크다운에서 syntax highlighting까지 이용할 것이기 때문에 관련 패키지들도 함께 설치했다.
공식 docs에서 Markdown을 사용하라는 것과는 다르게 다른 블로그 글들을 보면 ReactMarkdown을 사용하는 경우가 굉장히 많은데, 이는 이름이 계속 변경되어서 그렇다. 약 5개월 전(commit은 Sep 27, 2023) 9.0.0에서 Markdown을 사용하도록 리팩토링 되었으므로 Markdown을 사용하도록 해주자. 6.0.0이전에는 Markdown을 사용하다 ReactMarkdown으로 바뀌고, 최근 버전에서 다시 바뀐 셈인데, 왜 자꾸 이름이 변경되는지 명확한 이유는 모르겠으나 어쨌든 두 이름 모두 내가 확인한 범주 이내에서는 정상적으로 동작하므로 큰 문제는 없을 것 같다. 하지만 docs에서 Markdown을 사용하라고 명시했으니 Markdown을 사용해보자.

```cmd
npm install react-markdown
npm install remark-gfm
npm install react-syntax-highlighter
```

기본적인 Markdown에서 syntax highlighting과 여러 기능들을 추가하여 MarkdownRenderer이라는 컴포넌트를 만들어 추가해주자.


아래는 각각 react-markdown을 적용해 렌더링을 하기 전과 후의 차이이다
<center>
<img src="___MEDIA_FILE_PATH___/before_md_rendering.png" width="40%" title="routing-error"/>
<img src="___MEDIA_FILE_PATH___/after_md_rendering.png" width="40%" title="routing-error"/>
</center>

그런데 렌더링을 적용한 경우에도 img 태그가 제대로 적용되지 않고 텍스트 그대로 나온 것을 볼 수 있다. 이는 react-markdown의 기본 행동 때문인데, markdown 안에서의 html 사용을 최대한 지양하고자 react-markdown에서는 html을 `skipHtml`을 이용해 해석하지 않도록 행동하게 되어있다. 하지만 만일 해당 마크다운을 신뢰한다면 `rehype-raw`을 이용해 다시 허용해 주는 것이 가능하다. 더 자세한 설명은 각 github repo의 README를 확인해보자. rehype-new를 사용하면 img 태그와 center 등의 태그를 사용하는 것이 가능해진다.

```cmd
npm install rehype-raw
```

rehype 플러그인에 추가해주자. 하지만 아직 문제가 있는데, 마크다운 파일 내부 img 태그의 src는 기존의 local을 기준으로 작성되어 배포 환경에선 불가능하다는 것이다. 이를 위해 간단하게 placeholder를 이용하기로 하였다. ___ VARNAME ___ 의 형식으로 마크다운을 작성한 뒤 Post.js에서 해당 placeholder를 환경에 맞는 값으로 치환한 후 마크다운으로 활용하였다.

<center>
<img src="___MEDIA_FILE_PATH___/image_resolved.png" width="100%" title="image_resolved"/>
</center>

## reference
remarkjs, react-markdown : https://github.com/remarkjs/react-markdown

https://www.jamesqquick.com/blog/multiple-datasets-with-gatsby-source-filesystem/