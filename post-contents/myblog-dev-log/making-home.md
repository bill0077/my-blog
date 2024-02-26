---
title: "개발 블로그 개발기 - 4. ThreeJS를 이용해 Home 페이지 제작"
date: "2024-01-26"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/217e1e4aca424e668ae79ea37f187f6efdaac42b**

먼저 사용자가 들어오면 가장 먼저 만나게 될 Home 페이지를 만들어 보자. 블로그의 첫인상이라고도 할 수 있겠다.

### 구성
블로그 한가운데에 나를 표현할 수 있는 모델을 하나 띄워 놓으면 첫인상이 부각될 수 있겠다는 생각이 들었다. 그리고 화면 오른쪽 부분에 블로그 컨텐츠를 카테고리별로 분리해 탐색 가능한 목차를 놓아두면 깔끔한 메인 화면이 될 것 같다.

## 모델링 띄우기
### three.js 이용해보기
react에서 3D 모델을 띄우기 위해서는 대게 three.js라는 라이브러리를 많이 사용한다. 직접 WebGL을 이용해 개발해도 되지만, 훨씬 간편하고 `react-three-fiber`를 이용해 react와 연계도 쉬운 three.js를 많이 이용하는 것 같다. 먼저 공식 github의 가이드대로 `react-three-fiber`의 설치부터 진행해보자
```cmd
npm install three @types/three @react-three/fiber
```

`react-three-fiber`는 three.js를 react 문법에 맞게 사용할 수 있도록 해주는 패키지이고,
react-three/drei는 그걸 더 쉽게 도와주는 라이브러리이다. 역시 설치해주도록 하자.
```cmd
npm install @react-three/drei
```

그리고 렌더링할 모델(https://github.com/coopercodes/bmwGLB 에서 .glb 파일을 다운로드 할 수있다)을 public 폴더에 넣어주자. 지금은 예시 모델링이지만 나중에 적합한 모델로 변경해주도록 하겠다.

간단히 App.js에서 3d 모델링을 먼저 띄워보자
```js
// App.js
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

function CarModel(props) {
  const { scene } = useGLTF("/bmw.glb");
  return <primitive object={scene} {...props} />
}

function App() {
  return (
  <Canvas>
    <PresentationControls>
      <Stage>
        <CarModel/>
      </Stage>
    </PresentationControls>
  </Canvas>
  );
}

export default App;

```
여기에서 사용된 세가지 태그 `Canvas`, `PresentationControls`, `Stage`를 살펴보자.
- `Canvas`는 3D 모델링을 제어할 scene, camera, light 3가지를 제공해주는 react-three-fiber의 기본 태그이다. Threejs elemets를 렌더링해주는 역할이다. 부모 컨테이너의 크기만큼 확장된다는 특징이 있다.

- `PresentationControls`는 모델링을 돌려보며 확인할 수 있도록 탄성 물리학, 줌 등이 적용된 태그이다. 렌더링된 모델링을 편하게 볼 수 있도록 도와주는 역할을 한다. 카메라를 회전하는 것이 아닌 모델링 자체를 회전시킨다. 
- `Stage`는 적절한 조명, 모델 그림자, 지면 그림자 및 확대/축소 기능이 있는 무대를 만들어준다.

`npm start`로 실행후 확인해보면 아래와 같은 결과를 볼 수 있다 🎉
<center>
<img src="___MEDIA_FILE_PATH___/3d_rendering_test.png" width="100%" title="3d-rendering-test"/>
</center>

현재 모델링에 Stage의 그림자가 보이고 마우스로 모델링을 드래그해보면PresentationControls가 적용돼 모델링이 드래그하는대로 회전하는 것을 확인할 수 있다. 

## 꾸미기
### 메인 화면
모델링이 문제 없이 작동한다는 것은 확인했으니 임시로 작성한 App.js는 깨끗이 지워주고 /src/pages에 Home 페이지를 만들어주자.

대략적인 폴더 구조는 아래와 같이 구성했다.

```
my-blog
  ├── node_modules
  ├── public
  │    ├── bmw.glb
     ⋮
  ├── src
  │    ├── assets
  │    │    └── fonts
  │    │         ├── font.js
  │    │         └── fontfile.ttf
     ⋮
  │    ├── pages
  │    │    └── Home
  │    │         ├── Home.js
  │    │         └── Home.module.css
     ⋮
```
간단히 메인 문구도 넣어주고, 폰트도 넣어서 꾸며보았다. /src/assets에 fonts 폴더를 만들어 폰트를 추가했다. (눈누라는 폰트 사이트에서 무료로 웹사이트에 배포 가능한 다양한 무료 폰트를 ttf 폰트 파일로 받을 수 있다. 나는 태백체와 태백은하수체를 이용했다. 눈누: https://noonnu.cc/#google_vignette)
<center>
<img src="___MEDIA_FILE_PATH___/blog_home_decorating.png" width="100%" title="blog-home-decorating"/>
</center>

### 목차
메인 화면의 오른쪽에 목차를 넣어주면 괜찮을거 같다. 목차를 어떻게 표현할까 고민하다 블로그 내부의 글들도 폴더같은 트리 구조를 이루고 있으므로 목차를 폴더구조처럼 보이도록 꾸며주었다. 일단 느낌을 확인해보기 위해 실제 작동되는 목차는 아니지만 dummy로 목차를 추가해주었다.
<center>
<img src="___MEDIA_FILE_PATH___/blog_contents_decorating.png" width="100%" title="blog-contents-decorating"/>
</center>

### 부가 공간
현재 메인 화면과 목차를 제외하면 우하단에 조그마한 공간이 하나 남게 된다. 이곳은 임시로 추천 글들을 보여주기로 하였다. 목차와 마찬가지로 일단 dummy로 글 제목만 넣어주었다.
<center>
<img src="___MEDIA_FILE_PATH___/blog_recommend_decorating.png" width="100%" title="blog-recommend-decorating"/>
</center>

### 마무리
여기까지 완성하니 그럴싸한 홈 페이지가 하나 만들어진 것 같다. 간단하게 css로 그라데이션과 그림자를 추가해서 홈을 마무리해보자.
<center>
<img src="___MEDIA_FILE_PATH___/blog_finish_decorating.png" width="100%" title="blog-finish-decorating"/>
</center>

이렇게 해서 간단히 블로그 홈을 만들어 주었다. 아직 뜬금없는 차 모델링도 나를 표현할 수 있는 다른 모델로 변경해야 하고 색상이나 꾸밈새도 더 손볼곳이 많지만, 일단 홈은 여기서 마무리하고 우선 필수적인 기능부터 추가해주도록 하겠다.

**P.S.** css를 작성하며 작동이 안되는 경우는 개발자도구 f12를 눌러 각 속성이 제대로 적용되었나 확인해보자. 꼼꼼히 확인해야 오타 하나로 몇시간을 허비하는 사태를 방지할 수 있다.

## reference
#### three.js 관련
Cooper Codes, Create A 3D Model Showcase With React, Three.js, and React Three Fiber: https://www.youtube.com/watch?v=QaRIHrRclVk

pmndrs/react-three-fiber: https://github.com/pmndrs/react-three-fiber

pmndrs/drei: https://github.com/pmndrs/drei?tab=readme-ov-file

#### css 관련
갓대희's 작은 공간, [React] 5. React에 CSS 적용하기: https://goddaehee.tistory.com/304

Ella 프론트엔드일지, 리액트) 폰트 설정 방법 - 글로벌스타일이 아닌 index.css 파일에: https://ella951230.tistory.com/entry/%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%8F%B0%ED%8A%B8-%EC%84%A4%EC%A0%95-%EB%B0%A9%EB%B2%95

Emmanuel Ohans, CSS Naming Conventions that Will Save You Hours of Debugging: https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/