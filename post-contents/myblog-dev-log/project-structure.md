---
title: "개발 블로그 개발기 - 3. 프로젝트 구조 설정"
date: "2024-01-21"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/79bdca8166fb45089fa90bd00b19134d70767741**

### 폴더 구조 잡기
본격적으로 코딩을 시작하기 전에 간단히 폴더 구조를 잡고 가보자. 하지만 react 공식 문서에서도 명시하듯이 처음부터 완벽하게 폴더 구조를 잡고 갈 필요는 없다. 크게크게 잡아놓고 추후에 수정하면서 가면 될 듯하다. 다른 블로그에도 설명이 깔끔하게 잘 되어 있으니 간단히만 짚고 넘어가겠다.
```
my-blog
  ├── node_modules
  ├── public
  ├── src
  │    ├── assets 
  │    ├── components
  │    ├── config
  │    ├── constants
  │    ├── contexts
  │    ├── hooks
  │    ├── pages
  │    ├── services
  │    ├── styles
  │    ├── utils
  │    ├── App.js
  │    ├── App.test.js
  │    ├── index.js
  │    ├── reportWebVitals.js
  │    └── setupTests.js
  ├── .gitignore
  ├── Dockerfile
  ├── package-lock.json
  ├── package.json
  └── README.md
```

**전체 구조**
- `node_modules`: 프로젝트에 포함된 라이브러리. Github같은 저장소에는 이 폴더를 올리지 않음. package.json같은 파일을 확인하며 구성이 가능하기 때문.

- `public`: 정적 파일들이 위치한 폴더로 index.html, 파비콘 등이 포함. 컴파일시에 필요없는 파일들.
- `src`: react 앱의 핵심. 해당 폴더의 결과물을 컴파일한 결과가 사용자에게 보여짐. `src` 내부 구조는 아래에 더 자세히 서술.
- `.gitignore`: git에서 제외할 파일들을 지정한 파일.
- `Dockerfile`: docker를 설정해줄 Dockerfile.
- `package-lock.json`, `package.json`: 라이브러리 의존성을 관리하는 파일.
- `README.md`: 프로젝트에 대한 설명이 작성되어 있는 문서.

**`src` 폴더 내부 구조**
- `src/assets`: 컴포넌트 내부에서 사용하는, 컴파일이 필요한 파일들.

- `src/components`: 재사용 가능한 컴포넌트들.
- `src/config`: config 파일들.
- `src/constants`: 공통적으로 사용되는 상수.
- `src/contexts`: contextAPI 관련 파일들. store라고도 표기.
- `src/hooks`: 커스텀 훅.
- `src/pages`: 라우팅을 적용할 페이지 컴포넌트들.
- `src/services`: api나 인증 관련 로직.
- `src/styles`: css 파일들.
- `src/utils`: 공통으로 사용하는 유틸 파일.
- `src/App.js`: 모든 페이지가 초기화될 때 로딩되는 파일.
- `src/App.test.js`: App을 테스트하기 위한 파일.
- `src/index.js`: 가장 먼저 react에서 실행하는 파일. App.js를 불러온다.
- `src/reportWebVitals.js`: 앱의 퍼포먼스 시간들을 분석하여 객체 형태로 보여주는 파일. 사용자들에게 편의를 제공하는 페이지나 컴포넌트는 아니므로 삭제해도 무방.
- `src/setupTests.js`: 테스트를 위한 몇 가지 setup 작업을 수행하는 파일.

`create-react-app`를 통해 프로젝트를 생성하면 기본적으로 위에서 언급한 파일들을 제외하고 index.css, App.css등 css 파일이 생성되는데, 이 프로젝트에서는 `css-module` 방식을 이용해 css 파일을 작성할 예정이기 때문에 삭제해 주었다 (css를 구성하는 방법에도 tailwind, css module 등 여러가지가 있는데, 나중에는 이것도 한번 비교해보도록 하겠다).


## reference
react.org, 파일 구조: https://ko.legacy.reactjs.org/docs/faq-structure.html

coderH.log, [React] 리액트의 폴더 구조: 
https://velog.io/@sisofiy626/React-%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%9D%98-%ED%8F%B4%EB%8D%94-%EA%B5%AC%EC%A1%B0

cooking coding, React 활용 - 7 : 폴더 구조 잡기: https://cookinghoil.tistory.com/127