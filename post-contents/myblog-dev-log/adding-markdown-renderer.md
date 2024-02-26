---
title: "개발 블로그 개발기 - 7. react-markdown을 이용해 Post 페이지 제작"
date: "2024-02-14"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/c030623bfdbe6c13103e021cef33d504edbdc7f0**

현재까지 만든 블로그는 홈과 dummy인 목차와 추천 글 항목만이 있을 뿐이다. 이제 실제로 글을 포스팅 할 수 있도록 구현해보자.

## 글 페이지 만들기
Gatsby를 이용해 라우팅을 구현하며 Post 컴포넌트가 마크다운 파일들을 읽어와 각 페이지에서 보여주는 것까지 구현했다. 이제 마크다운 파일에서 그냥 텍스트를 불러오는 것이 아니라 html로 변환해서 사용자가 더 글을 읽기 편하도록 구현하는 것이 목표이다.

### gatsby-transformer-remark & gatsby-source-filesystem
마크다운 렌더링은 gatsby에서 제공하는 gatsby-transform-remark를 사용하면 쉽게 마크다운 렌더 기능을 구현할 수 있다. 하지만 gatsby에서는 파일을 여러개의 source로부터 갖고 오는 기능을 직접적으로 지원하지 않았고, 미리 source를 명시해 두어야 한다는 단점이 있었다.

### react-markdown
결론적으로 `gatsby-transformer-remark`를 제외하고 react에서 마크다운을 렌더링하는 방법을 찾아보았을 때 자주 사용되면서 최근까지도 업데이트가 계속된 `react-markdown`이라는 패키지를 사용하기로 결정하였다. npm trends를 보면 지난 1년간 다운로드 수가 관련 패키지 중 가장 많은 것을 확인할 수 있다.
<center>
<img src="___MEDIA_FILE_PATH___/react_markdown_downloads.png" width="100%" title="3d-rendering-test"/>
</center>

설치하기 이전에 Github의 소개글을 읽어보자
> This package is a React component that can be given a string of markdown that it’ll safely render to React elements.

즉 `react-markdown`은 string을 마크다운 문법에 맞추어 react component로 렌더링 해주는 패키지이다. 설치 과정에서 어차피 gfm과 syntax highlighting까지 이용할 것이기 때문에 관련 패키지들도 함께 설치했다.
```cmd
npm install react-markdown
```
패키지 이용 자체는 매우 간단하다. `Markdown`이라는 컴포넌트에 string을 마크다운 문법에 맞춰 넣어주면 이를 렌더링하여 해당 컴포넌트에서 볼 수 있게 된다. 예를 들어
```js
const markdown = '# Hi, *Pluto*!';
<Markdown>{markdown}</Markdown>
```
위 예제는 아래와 같은 JSX와 동일하다.
```jsx
<h1>
  Hi, <em>Pluto</em>!
</h1>
```

하지만 이 패키지에서 렌더링 해주는 것은 h1, h2, blockquote와 같은 정말 기본적인 태그 뿐이므로, syntax highlighting 등의 기능을 위해서는 추가적인 플러그인이나 커스터마이징을 활용해 꾸며주는 작업이 필요하다. 따라서 해당 Markdown 컴포넌트에 각종 설정과 부가기능을 추가한 `MarkdownRenderer` 컴포넌트를 만들어 추가해 주었다. 결과적으로 완성된 렌더러는 다음과 같다. 아래의 `MarkdownRenderer` 컴포넌트는 
1. GFM extension 사용
2. syntax highlighting
3. 마크다운 내부에서 HTML 태그 해석
4. frontmatter 해석

4가지가 추가적으로 가능하도록 설정해주었다.
```js
// MarkdownRenderer.js
import React from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

/** Renderer component that converts text into a React component according to Markdown format. */
export default function MarkdownRenderer({ markdown }) {
  return (
    <Markdown 
      remarkPlugins={[
        remarkGfm, // enables GFM extensions
        remarkFrontmatter // enables frontmatter
      ]} 
      rehypePlugins={[rehypeRaw]} // enables html tags inside markdown file
      components={% raw %}{{
        code(props) { // apply syntax highlighting inside code blocks
          const {children, className, node, ...rest} = props
          const match = /language-(\w+)/.exec(className || '') // find matching language
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              /*style={dark}*/ // dark mode for code block 
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}{% endraw %}>
      {markdown}
    </Markdown>
  );
}
```

#### remarkPlugin 
일단 기본적인 렌더링에 더해 GFM을 사용할 수 있도록 remarkPlugin에 `remarkGfm`을, 또 추후에 frontmatter을 이용해 제목이나 저자 등을 지정할 것이므로 `remarkFrontmatter` 플러그인을 추가해주었다 (react-markdown에서 활용 가능한 플러그인은 https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins에서 확인 가능하다).
```cmd
npm install remark-gfm
npm install react-syntax-highlighter
```

#### rehypePlugin
아래는 `remarkPlugin`까지 적용한 이후 react-markdown을 이용해 렌더링을 하기 전과 후의 차이이다
<center>
<img src="___MEDIA_FILE_PATH___/before_md_rendering.png" width="40%" title="routing-error"/>
<img src="___MEDIA_FILE_PATH___/after_md_rendering.png" width="40%" title="routing-error"/>
</center>

그런데 렌더링을 적용한 경우에도 img 태그가 제대로 적용되지 않고 텍스트 그대로 나온 것을 볼 수 있는데, 이는 react-markdown의 기본 설정 때문이다. 기본적으로 react-markdown에서는 HTML 태그가 있으면 바로 `skipHtml`을 이용해 건너뛰는데, 이러면 마크다운 내부에서 `<center>`과 같은 태그를 활용해 정렬이 불가능하고 `img` 태그 또한 모든 인자에 대한 설정을 추가해줘야 한다. 그러므로 HTML 태그를 그대로 해석하는 것을 허용하기 위해 rehypePlugins에 `rehypeRaw`를 추가해주었다 **(⚠️react-markdown은 안전한 렌더링을 위해 마크다운 내부 HTML을 불허하는 것을 지향한다. 마크다운을 신뢰할 수 있는 경우에만 해당 플러그인을 활용하는 것을 추천한다⚠️).**
```cmd
npm install rehype-raw
```

이후 `code`라는 컴포넌트에서 syntax highlighting이 가능하도록 추가해주면 (react-markdown의 예제 코드 참고) 기본적인 작업이 모두 종료된다.

### 이미지 처리
아직 문제가 있는데, 마크다운 내부 img 등 태그의 src는 개발 환경과 배포 환경에서 동일하게 사용하는 것이 불가능하다는 것이다. 링크의 url을 폴더 구조 그대로 사용하는 것이 아니기 때문에 상대경로를 이용한 참조 또한 불가능하다. 결론적으로 마크다운 내부에 이미지 파일 경로를 변수로 설정하고 개발 환경인지 배포 환경인지에 따라 이 변수를 다르게 설정해야 한다는 것인데, 이는 마크다운 내부의 문법으로는 불가능하다. 

이를 해결하기 위해 간단하게 placeholder를 이용하기로 하였다. `___MEDIA_FOLDER_PATH___` 의 형식으로 해당 마크다운이 참조하는 이미지 파일들의 폴더 위치를 지정한 상태에서 마크다운을 작성한 뒤 글 페이지 컴포넌트(Post.js)에서 마크다운을 렌더링하기 이전에 해당 placeholder를 환경에 맞는 값으로 치환해 주었다.
```html
<!--placeholder example-->
<img src="___MEDIA_FILE_PATH___/image_resolved.png" width="100%" title="image_resolved"/>
```

### 결과물
최종적으로 렌더링된 결과는 아래와 같다. 폰트나 인용문 등은 추후에 더 가독성 있도록 꾸며주도록 하겠다.
<center>
<img src="___MEDIA_FILE_PATH___/image_resolved.png" width="100%" title="image_resolved"/>
</center>

<br>
<br>

**P.S.** 공식 docs에서 Markdown을 사용하라는 것과는 다르게 다른 블로그 글들을 보면 ReactMarkdown이라는 이름의 컴포넌트를 사용하는 경우가 굉장히 많은데, git history를 뒤져보니 이는 컴포넌트 이름이 계속 변경되어서 그렇다. ReactMarkdown이라는 이름은 6.0.0 ~ 9.0.0 사이 버전에서 잠깐 사용되다가 약 5개월 전(Sep 27, 2023에 commit) 9.0.0 버전에서 다시 Markdown을 사용하도록 리팩토링 되었다. 왜 이름이 다시 롤백되었는지 명확한 이유는 모르겠으나 어쨌든 두 이름 모두 확인한 범주 이내에서는 정상적으로 동작하므로 큰 문제는 없을 것 같다.

## reference
remarkjs, react-markdown : https://github.com/remarkjs/react-markdown

npm trends, react-markdown vs remark vs remark-react: https://npmtrends.com/react-markdown-vs-remark-vs-remark-react

mia.log, react-markdown 사용하기: https://velog.io/@mia/react-markdown-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
