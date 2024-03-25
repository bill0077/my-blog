import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, PerspectiveCamera, CameraControls, SpotLight } from "@react-three/drei";

import FallingObjects from "./FallingObjects";
import HomeObjectList from "./HomeObjectList";
import ContentsTree from "./ContentsTree";

import * as styles from "../styles/Home.module.css";

function MainCanvas() {
  const cameraRef = useRef();

  return (
    <Canvas dpr={[1,2]} shadows={false}>
      <SpotLight position={[0, 500, 1000]} angle={0.3} penumbra={0.1} />
      <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={1} far={10000} position={[-200, 500, 1500]} />
      <CameraControls camera={cameraRef.current} truckSpeed={0} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI*2/3} minDistance={750} maxDistance={1500} azimuthRotateSpeed={0.3} polarRotateSpeed={0.5} dollySpeed={0.5} />
      <Stage camera={cameraRef.current} preset={"soft"} intensity={5} shadows={false} adjustCamera={false}>
        <FallingObjects objectList={HomeObjectList()} fallLimitHeight={-3000}/>
      </Stage>
    </Canvas>
  );
}

function Title({ vibrate }) {
  return (
    <div className={vibrate ?
      styles["home__main__titleBox__title__text__vibration"] :
      styles["home__main__titleBox__title__text"]}>
      bill0077.log
    </div>
  )
}

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const handleHover = () => setIsHovered(true);

  useEffect(() => {
    if (isHovered) {
      setVibrate(false);
      return;
    }

    const interval = setInterval(() => {
      setVibrate(true); // make main title vibrate every 3 seconds until hovered
      setTimeout(() => {
        setVibrate(false); // vibrate for 0.3 seconds
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // prevent the main canvas from being rerendered every time the state changes.
  const fixedCanvas = useMemo(() => <MainCanvas />, []); 

  return (
  <div className={styles["home"]}>
    <div className={styles["home__main"]}>
      <div className={styles["home__main__canvas"]}>
        {fixedCanvas}
      </div>
      <div className={styles["home__main__titleBox"]}>
        <div className={styles["home__main__titleBox__title"]} onMouseEnter={handleHover}>
          <Title vibrate={vibrate}/>
          <div className={styles["home__main__titleBox__title__contentsTree"]}>
            <ContentsTree />
          </div>
        </div>
        <div className={styles["home__main__titleBox__subtitle"]}>함께 성장하는 개발자를 꿈꿉니다</div>
        <a href="mailto:bill007tjr@gmail.com" rel="noreferrer noopener" className={styles["home__main__titleBox__contact"]}>bill007tjr@gmail.com</a>
        <a href="https://github.com/bill0077" target="_blank" rel="noreferrer noopener" className={styles["home__main__titleBox__contact"]}>https://github.com/bill0077</a>
      </div>
    </div>
  </div>
  );
}