# 개발 블로그 개발기 - Post 페이지 만들기
**Demo: https://bill0077.github.io/my-blog  
Git commit:  
Date:**

현재까지 만든 블로그는 홈과 dummy인 목차와 추천 글 항목만이 있을 뿐이다. 이제 실제로 글을 포스팅 할 수 있도록 구현해보자.

## 글 페이지 만들기

대략적인 폴더 구조는 아래와 같다.

```
my-app
  ├── node_modules
  ├── public
  ├── src
  │    ├── assets
    ⋮
  │    ├── pages
  │    │    ├── Home
  │    │    │    ├── Home.js
  │    │    │    └── Home.module.css
  │    │    └── Post
  │    │         ├── Post.js
  │    │         ├── PostMapper.json
  │    │         └── Post.module.css
     ⋮
```

주어진 url에 맞춰 public의 .md 파일을 읽어와 markdown의 형태로 보여줄 것이므로 동적 라우팅이 필요하다. 다양한 router 중에서 react 공식 홈에서 추천하는 React Router를 이용하기로 하였다. 먼저 설치를 진행해보자
```cmd
npm install --save react-router-dom
```

이후 App.js 파일에서 라우팅이 가능하도록 BrowserRouter를 추가해주었다(동적 라우팅은 BrowserRouter또는 HashRouter를 많이 사용한다. BrowserRouter의 경우 검색 엔진에 노출이 용이하고 동적 페이지 생성에 용이하다. 반면 새로고침 등으로 인한 경로 에러를 서버에서 처리해주어야 한다. 반면 HashRouter는 URL의 hash부분을 이용해 UI를 구성하며 정적인 페이지에 적합하여 경로 문제 설정이 간단하지만 대신 hash를 이용하기 때문에 검색 엔진 노출이 되지 않는다. react 공식 홈에서 추천하는 방식이 BrowserRouter이기 때문에 조금 번거롭더라도 BrowserRouter를 이용해 보기로 하였다).

기존에 무조건 Home component만을 반환했던 App을 요청한 url에 따라 다른 페이지를 보여줄 수 있도록 수정해주자.
```js
//App.js
import * as React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Post from './pages/Post/Post';

function App() {
  return (
    <BrowserRouter basename="/my-blog">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/post/:postId" element={<Post />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
이때 BrowserRouter의 `basename`을 설정해주는 것을 잊지말자. 
> Configure your application to run underneath a specific basename in the URL

위의 설명처럼 basename은 어플리케이션이 특정 `basename` 아래에서 실행될 것이라는 것을 명시하게 해준다. 나의 경우 github pages를 이용해 bill0077.github.io의 url 아래의 my-blog라는 repository에서 배포할 것이므로 basename은 my-blog가 된다. basename을 제대로 설정하지 않으면 local에서 실행할 때와 deploy 할 때 차이가 발생할 수 있다. dynamic routing을 위해 /post 이후의 parameter을 postId라는 이름으로 받아와서 postId에 맞는 페이지를 보여줄 것이다.

> **.then**
> https://velog.io/@lak5000/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-.then-%EC%82%AC%EC%9A%A9%EB%B2%95

> **useEffect** https://react.vlpt.us/basic/16-useEffect.html

> **dynamic routing이란?**  
> dynamic routing은 경로를 미리 정해두지 않고 동적으로 설정하는 방식이다. 처리해야할 모든 url을 미리 정의하지 않고 특정 규칙에 맞는 url이 요청되면 해당 url에 맞는 페이지를 화면에 띄워주는 방식이다. 모든 페이지마다 각각의 컴포넌트와 경로를 정의해 두어야하는 static routing의 단점을 보완한 것이다. 위의 App.js에서의 예를 들면 


## 목차 만들기
각종 tistory 블로그 등을 확인해보았을 때 상위 분류와 하위 분류 목차가 있고, 상위 분류를 선택하면 여러 하위분류의 글들이 섞여 나오고, 하위 분류를 선택하면 하위 분류의 글들만이 노출되는 방식으로 이루어져 있었다. 그보다 딱히 더 획기적인 대안이 떠오르지는 않았기에 이 방식을 그대로 구현해 보겠다.


### useEffect란?


### useParams란?


## reference
CSS-TRICKS, 6 Creative Ideas for CSS Link Hover Effects: https://css-tricks.com/css-link-hover-effects/

Create React App, Adding a Router: https://create-react-app.dev/docs/adding-a-router/

React Router, < BrowserRouter >: https://reactrouter.com/en/main/router-components/browser-router

React Router, < useParams >: https://reactrouter.com/en/main/hooks/use-params

헬로코딩, useParams 로 세부 페이지 라우팅 구현하기: https://babycoder05.tistory.com/entry/useParams-%EB%A1%9C-%EC%84%B8%EB%B6%80-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%9D%BC%EC%9A%B0%ED%8C%85-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0