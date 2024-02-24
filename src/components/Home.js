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