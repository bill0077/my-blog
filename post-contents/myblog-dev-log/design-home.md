---
title: "개발 블로그 개발기 - 9. 홈 페이지 디자인"
date: "2024-02-25"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/a1417ecde09d3bb2b4739ed126803c46fa45750a**

## 홈 페이지 디자인
지금 블로그가 지원하는 기능들은 아래와 같다.
1. 홈에서 글 목록 페이지로 이동 가능
3. 글 페이지를 모아둔 글 목록 페이지에서 각각의 글 조회 가능
3. 각각의 글 페이지 접속 가능

이정도면 블로그 글 조회에는 큰 문제가 없다고 생각한다 (글 작성 기능도 추가하고 싶지만 이는 별도의 서버 준비 등 할일이 꽤나 많으므로 또 처음부터 다시 작업하는 일이 없으려면 충분한 조사 이후 진행하는 것이 나을 거 같다). 하지만 각종 페이지의 가독성이나 디자인 등에는 전혀 신경을 쓰지 않았으므로 외견을 좀 꾸며주는 작업을 먼저 진행하려고 한다. 가장 먼저 홈 페이지부터 다시 꾸며주도록 했다. 기존 블로그 홈은 아래와 같다.
<center>
<img src="___MEDIA_FILE_PATH___/blog_finish_decorating.png" width="100%" title="before-redesigning-home"/>
</center>

임시 방편으로 띄워져 있는 자동차 모델과 작동되지 않는 dummy 추천 리스트 등 불필요한 부분은 지우고 간략히 다시 디자인 해보았다. 처음 Home 페이지를 만들때처럼 이번에도 ThreeJS를 이용했다. 구현된 결과부터 살펴보면 아래와 같다.
<center>
<img src="___MEDIA_FILE_PATH___/home_after_redesign.png" width="100%" title="after-redesigning-home"/>
</center>

나의 세계관을 나타낸다는 느낌으로 중심에 지구를 두고 여러 행성이 공전하도록 꾸며주었다. 각 행성은 커서를 올리면 행성별로 지정된 블로그 카테고리가 나타나고 행성을 클릭하면 해당 글목록으로 이동하게 된다. (여기에서 확인해보자! link: https://bill0077.github.io/my-blog) 구현된 코드는 아래와 같다. 

`Planet`는 각 카테고리를 담당할 행성들을 주어진 인자에 따라 구성해서 행성 모델링이 화면에 나타나도록 해준 컴포넌트이고, `Home`는 각 이 Planet을 import해서 `Canvas`에 그려내고 부가적인 정보를 표시하는 홈 페이지 컴포넌트이다 (`Planet` 내부에서 사용할 3D 모델은 Poly Pizza: https://poly.pizza/ 에서 다운받았으며, 모든 모델은 출처만 남기면 자유로운 사용이 가능한 라이선스를 가지고 있다). `Planet`전부 Home과 Planet모두 three-fiber과 three-drei를 사용하므로 실행을 위해서는 설치가 필요하다.
```cmd
npm install @react-three/drei
npm install three @types/three @react-three/fiber
```
```js
//Planet.js
import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text3D, BBAnchor } from "@react-three/drei";

import taebaekJsonPath from "../../static/fonts/TAEBAEK-Regular.json";
import { MeshNormalMaterial, Vector3 } from "three";

export default function Planet(props) {
  const { name, link, filePath, heightOffset, rotateSpeed, orbitRadius, orbitSpeed, defaultScale } = props;
  const [isHovered, setHover] = useState(false);
  const hoverStartTime = useRef(0);
  const totalHoverTime = useRef(0);
  const cameraPosition = useRef({});
  const cameraAngle = useRef({});

  const handleHover = () => setHover(true);
  const handleLeave = () => setHover(false);
  const handleClick = () => {
    window.location.href = `${process.env.GATSBY_PUBLIC_URL}/${link}`; 
  };

  const { scene } = useGLTF(`${process.env.GATSBY_FILESERVER_URL}/${filePath}`);
  const planetRef = useRef();
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.position.y = heightOffset; // set y axis offset
      cameraAngle.current = state.camera.rotation; // save current camera angle
      cameraPosition.current = state.camera.position; // save current camera position
      
      const elapsedTime = state.clock.getElapsedTime(); // get the elapsed time

      if (isHovered && hoverStartTime.current === 0) {
        hoverStartTime.current = elapsedTime;
      } else if (!isHovered && hoverStartTime.current) {
        totalHoverTime.current += elapsedTime - hoverStartTime.current;
        hoverStartTime.current = 0;
      } else if (!isHovered) {
        hoverStartTime.current = 0;
      }

      // Update the scale based on time elased after hover
      const hoverElapsedTime = elapsedTime - hoverStartTime.current;
      const scaleMotionFrame = 1;
      const scaleMotionSpeed = 4;
      const maxScaleRatio = 1.5;
      var scaleRatio;
      if (hoverStartTime.current) { // hoverStartTime used instead of isHovered because isHovered cause flickering in motion 
        scaleRatio = Math.max(1, maxScaleRatio - Math.pow(Math.max(0, scaleMotionFrame - hoverElapsedTime), scaleMotionSpeed));
      } else {
        scaleRatio = 1;
      }
      const scale = [defaultScale*scaleRatio, defaultScale*scaleRatio, defaultScale*scaleRatio];
      planetRef.current.scale.set(...scale);

      if (!hoverStartTime.current) {
        // Update the position based on the orbit equation (when not hovered)
        planetRef.current.position.x = Math.cos((elapsedTime - totalHoverTime.current)* orbitSpeed) * orbitRadius;
        planetRef.current.position.z = Math.sin((elapsedTime - totalHoverTime.current)* orbitSpeed) * orbitRadius;
      
        // Rotate by given speed (when not hovered)
        planetRef.current.rotation.y -= rotateSpeed;
      }
    }
  });

  var textVec = new Vector3(0, 0, 0);
  const textDistance = 200;
  if (planetRef.current && cameraAngle.current) {
    const vecCurr = new Vector3(
      cameraPosition.current.x-planetRef.current.position.x,
      cameraPosition.current.y-planetRef.current.position.y,
      cameraPosition.current.z-planetRef.current.position.z,
    );
    textVec = vecCurr.normalize().multiplyScalar(textDistance);
  }

  const planetMaterial = new MeshNormalMaterial();
  return (
    <group>
      {isHovered && planetRef.current && cameraAngle.current && (
        <BBAnchor anchor={[0.3, 0.3, 0.3]}> 
          <Text3D
          position={[ // set the position of the text same as object
            planetRef.current.position.x+textVec.x,
            planetRef.current.position.y+textVec.y,
            planetRef.current.position.z+textVec.z
          ]}
          rotation={[ // set the angle of the text to face camera
            cameraAngle.current.x,
            cameraAngle.current.y,
            cameraAngle.current.z
          ]}
          font={taebaekJsonPath} // font type
          size={50} // set the font size
          height={40}
          material={planetMaterial}>
          {name}
          </Text3D>
        </BBAnchor>
      )}
      
      <primitive 
        onPointerOver={handleHover}
        onPointerOut={handleLeave}
        onClick={handleClick}
        object={scene}
        ref={planetRef}
        {...props}
      />
    </group>
  );
}
```
```js
// Home.js
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, PerspectiveCamera, CameraControls } from "@react-three/drei";

import Planet from "../components/Planet";

import * as styles from "../styles/Home.module.css";

export default function Home() {
  const cameraRef = useRef();

  return (
  <div className={styles["home"]}>
    <div className={styles["home__main"]}>
      <div className={styles["home__main__canvas"]}>
        <Canvas dpr={[1,2]} shadows={false}>
          <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={1} far={100000} position={[0, 500, 1000]} />
          <CameraControls camera={cameraRef.current} minDistance={750} maxDistance={2500} azimuthRotateSpeed={0.3} polarRotateSpeed={0.5} dollySpeed={0.5} />
          <Stage camera={cameraRef.current} preset={"soft"} shadows={false} adjustCamera={false}>
            <Planet name={"bill0077"} link={`/`} filePath={"models/solarsystem/Earth.glb"} heightOffset={150} rotateSpeed={0.002} orbitRadius={0} orbitSpeed={0} defaultScale={15}/>
            <Planet name={"my-blog"} link={`myblog-dev-log`} filePath={"models/solarsystem/Moon.glb"} heightOffset={150} rotateSpeed={0.025} orbitRadius={250} orbitSpeed={1} defaultScale={1.2}/>
            <Planet name={"devops"} link={`devops`} filePath={"models/solarsystem/Jupiter.glb"} heightOffset={150} rotateSpeed={-0.01} orbitRadius={400} orbitSpeed={-0.5} defaultScale={0.6}/>
            <Planet name={"etc"} link={`etc`} filePath={"models/solarsystem/Venus.glb"} heightOffset={150} rotateSpeed={0.02} orbitRadius={550} orbitSpeed={0.25} defaultScale={0.4}/>              
            <Planet name={"etc"} link={`etc`} filePath={"models/solarsystem/Neptune.glb"} heightOffset={150} rotateSpeed={0.005} orbitRadius={650} orbitSpeed={0.05} defaultScale={1.75}/>
            <Planet name={"etc"} link={`etc`} filePath={"models/solarsystem/Saturn.glb"} heightOffset={150} rotateSpeed={0} orbitRadius={800} orbitSpeed={-0.1} defaultScale={100}/>
          </Stage>
        </Canvas>
      </div>
      <div className={styles["home__main__titleBox"]}>
        <div className={styles["home__main__titleBox__title"]}>bill0077.log</div>
        <div className={styles["home__main__titleBox__subtitle"]}>함께 성장하는 개발자를 꿈꿉니다</div>
        <a href="mailto:bill007tjr@gmail.com" rel="noreferrer noopener" className={styles["home__main__titleBox__contact"]}>bill007tjr@gmail.com</a>
        <a href="https://github.com/bill0077" target="_blank" rel="noreferrer noopener" className={styles["home__main__titleBox__contact"]}>https://github.com/bill0077</a>
      </div>
    </div>
  </div>
  );
}
```

## Planet
각 행성들은 아래와 같은 기능을 가져야 한다.
1. 지구를 중심으로 공전, 자전을 할 수 있어야 하고
2. 커서를 올리면(=hover되면) 카테고리 이름을 띄우면서 이동을 멈추고
3. 클릭하면 해당 카테고리의 글 목록 페이지로 이동한다.
어떻게 이러한 기능을 구현하였는지 적어보겠다.

### model motion
각 모델링의 움직임은 모두 `useFrame` 안에서 이루어졌다. `useFrame`은 three-fiber의 hook중 하나로, 이 hook은 내부의 코드가 특정 시간 간격, 즉 frame마다 실행되게 만들어서 내부에서 object들의 움직임을 제어할 수 있도록 해준다. Ref를 생성해서 각 frame마다 어떤 행동을 할지 지정한다음, 해당 ref를 object를 생성하며 넘겨주면 object에 움직임을 추가해 줄 수 있다. Ref의 이름은 마음대로 정할수 있으므로 행성 ref을 의미하는 `planetRef`를 선언하고 사용하였다. 

공전과 자전을 위해서는 움직임과 각도를 모두 제어해야 하기 때문에 position과 rotation을 모두 조절해 주어야 한다. 렌더링 이후 흐른 시간을 `state.clock.getElapsedTime()`을 이용해 얻고 시간에 따른 원운동 식을 이용하면 공전운동이 가능하다. 자전의 경우 현재 y축 방향 각도를 서서히 증가시키기만 해도 가능하다. 간단한 공전 및 자전 코드는 아래와 같다. 
```js
const planetRef = useRef();
useFrame((state) => {
  const elapsedTime = state.clock.getElapsedTime();

  planetRef.current.position.x = Math.cos(elapsedTime * orbitSpeed) * orbitRadius; // 공전 시 x 좌표 (+x축은 화면 우측 방향)
  planetRef.current.position.z = Math.sin(elapsedTime * orbitSpeed) * orbitRadius; // 공전 시 z 좌표 (+z축은 화면을 뚫고 나오는 방향)
  planetRef.current.rotation.y -= rotateSpeed; // 자전 (+y축은 화면 위쪽 방향)
});
```

useFrame을 사용하며 주의할 점은 각 frame마다 내부의 코드가 실행되기 때문에 `setState`처럼 컴포넌트 렌더를 다시 일으키는 동작이나 복잡한 코드의 실행은 최대한 피해야 한다는 것이다. state 대신 최대한 ref를 사용하도록 하자.

>**react-three-fiber docs:** Be careful about what you do inside useFrame! You should never setState in there! Your calculations should be slim and you should mind all the commonly known pitfalls when dealing with loops in general, like re-use of variables, etc.

### hover & click event handler
간단한 움직임을 처리했으므로 hover과 click 등의 이벤트를 감지하기 위해 handler를 추가해주자. three의 object, mesh는 js와 비슷한 이벤트 핸들러를 사용할 수 있다. 커서 올라옴, 빠져나감, 클릭됨의 이벤트를 사용하기 위해 `onPointerOver`, `onPointerOut`, `onClick`를 사용해주자. 각 이벤트마다 handleHover, handleLeave, handleClick을 호출하도록 해주었다. 또한 현재 커서 상태를 저장하는 `isHovered`라는 state를 만들어 관리해주었다.
```js
const handleHover = () => setHover(true);
const handleLeave = () => setHover(false);
const handleClick = () => {
  window.location.href = `http://link-to-go`; 
};
```

`isHovered`를 커서 상태에 따라 업데이트 해주고 `useFrame` 내부에서 이를 활용해 모델 위에 커서가 올라왔다면 멈출 수 있도록 해주었다. 또한 현재 각 모델링은 렌더된 이후로부터 총 흐른 시간을 이용해 공전하도록 되어 있는데, 이러면 커서가 hover된 동안 멈춰있던 행성은 hover가 풀리면 원래의 시간상 올바른 위치로 순간이동하게 된다. 때문에 hover된 시간만큼의 차이를 되돌려주어야 하고, 이를 위해 `totalHoverTime`이라는 ref를 추가적으로 사용했다 (자세한건 Planet.js 코드 참조).

### show name when hovered
마지막으로 각 행성들이 hover되면 카테고리 항목을 표시하도록 해보자. `Text3D`를 이용하면 간단하게 문자열을 3D 모델로 변경할 수 있다. `Text3D`는 폰트 지정이 반드시 필요한데, 이때 원하는 폰트파일을 typeface.json라는 곳에서 JSON 형태로 변환해서 사용해야 한다. 

> Text3D requires fonts in JSON format generated through (typeface.json)[http://gero3.github.io/facetype.js]

`Text3D`는 material을 지정하지 않으면 그림자 등의 빛 효과 또한 받지 못하므로 적절한 material을 적용해 주었다 (사용 가능한 material은 https://threejs.org/docs/?q=material#api/en에서 material을 검색하면 확인 가능하다).

`isHovered`의 상태에 따라 참이라면 `Text3D` object를 포함해서 return하고, 그렇지 않다면 행성만 return해도록 구현했다. 각 `Text3D`는 행성의 위치에서 카메라를 향할 수 있도록 위치와 각도를 설정해 주었다 ( *(행성에서 카메라로 향하는 단위 벡터) * (원하는 거리) + (행성의 현재 위치)* 의 식을 통해 Text3D object가 위치해야 할 좌표를 알 수 있다. threejs는 Tait–Bryan angle을 사용하므로 각 object의 각도를 현재 카메라의 각도와 동일하게 설정해주면 각 object가 카메라를 향하게 된다).

## Home
기존의 Home에서 자동차 모델을 띄워줄때는 `Canvas` 내부에서 `PresentationControls` 이라는 control을 이용했다. control은 간단히 생각하면 마우스 등을 이용해서 Canvas 내부의 object를 보는 것을 도와준다고 보면 된다. `PresentationControls`은 물체를 바라보는 각도에 따라 적절한 줌을 해준다거나, 부드럽게 물체를 회전시켜 살펴볼 수 있도록 해준다. control 내부에는 `Stage`가 있는데, 옵션으로 간단하게 원하는 조명을 설정할 수 있고, 물체의 크기에 상관없이 카메라가 적절한 거리를 유지할 수 있도록 해준다. 이러한 `Canvas` -> `PresentationControls` -> `Stage`의 구성은 간단히 원하는 object를 컴포넌트로 렌더링하는 것이 가능하지만, 2가지 단점으로 기존 구현을 버리고 별개의 카메라와 control을 추가해주었다.

1. 현재 카메라 각도를 알기 어렵다 (물체가 카메라를 향하도록 하는 것이 어렵다)
2. 마우스 휠등을 이용한 줌 (정확히는 dolly)이 불가능하다

`PresentationControls`은 카메라의 각도를 움직여가며 물체를 살펴보는 것이 아니라, 직접 물체를 회전시키도록 구현되어 있다. 따라서 사용자가 `PresentationControls` 내부의 물체를 원하는 대로 회전이나 이동시킨 다음 control 내부의 물체가 카메라 방향을 볼 수 있도록 해주려면 물체의 회전 기록을 저장해 두었다가 역산해주어야 하는데, 실시간으로 회전을 기록하고 역산하는 과정이 꽤나 번거로우며 많은 연산을 소비한다. 따라서 물체 자체가 아니라 카메라를 움직이는 control를 택해 간단히 camera를 향하도록 변경하였다. 카메라로는 가장 많이 사용되는 일반적인 `PerspectiveCamera`를 사용하고 해당 camera의 ref를 `CameraControls`와 `Stage`에 넘겨줌으로써 전체 `Cavnas`에서 하나의 카메라를 사용할 수 있다. 이때 `PerspectiveCamera`에 `makeDefault` 옵션을 줘서 모든 물체에 대해 `PerspectiveCamera`를 사용할 것이라고 명시해주어야 한다 (그렇지 않으면 여러 카메라가 동시에 이용되며 화면이 여러 시점으로 순간이동 된다). 이후 drei Github의 docs를 살펴보며 적당히 원하는 설정을 camera와 Stage에 적용해주었다 (PerspectiveCamera, CameraControls, Stage의 각 설정에 따라 물체가 제대로 로드되지 않거나 카메라에 나타나지 않으니 적절한 설정이 반드시 필요하다. 필수적인 설정은 완성 코드에 대부분 적용되어 있으니 한번 확인해보자). 

## reference

pmndrs, drei: https://github.com/pmndrs/drei

Pmndrs.docs, react three fiber Hooks: https://docs.pmnd.rs/react-three-fiber/api/hooks

Pmndrs.docs, react three fiber Events: https://docs.pmnd.rs/react-three-fiber/api/events

three.js docs, MeshNormalMaterial: https://threejs.org/docs/?q=material#api/en/materials/MeshNormalMaterial

three.js docs, TextGeometry: https://threejs.org/docs/index.html?q=textgeo#examples/en/geometries/TextGeometry

three.js docs, Vector3: https://threejs.org/docs/#api/en/math/Vector3.normalize

Wikipedia, Euler angles: https://en.wikipedia.org/wiki/Euler_angles#Tait%E2%80%93Bryan_angles