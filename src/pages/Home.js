import React from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

import ContentsTree from "../components/ContentsTree";

import * as styles from "../styles/Home.module.css";
import "../assets/fonts/font.css";

function CarModel(props) {
  const { scene } = useGLTF(`${process.env.GATSBY_PUBLIC_URL}/models/bmw/bmw_m4_competition_m_package.glb`);
  return <primitive object={scene} {...props} />
}

function RecommendedList() {
  return (
    <div>
      <div className={styles["recommendedList__title"]}>Recommended Posts</div>
      <li className={styles["recommendedList__elem"]}>개발 블로그 개발기</li>
      <li className={styles["recommendedList__elem"]}>테트리스 ai 개발기</li>
      <li className={styles["recommendedList__elem"]}>PS: 백준(boj) 1234번 풀이 </li>
    </div>
  );
}

function Home() {
  return (
  <div className={styles["home"]}>
    <div className={styles["home__main"]}>
      <div className={styles["home__main__canvas"]}>
        <Canvas dpr={[1,2]} shadows camera={{ fov: 45 }}>
          <PresentationControls speed={0.5} global zoom={0.75} polar={[-Math.PI/8, Math.PI/4]}>
            <Stage shadows={false} environment={null}>
              <CarModel scale={0.012} />
            </Stage>
          </PresentationControls>
        </Canvas>
      </div>
      <div className={styles["home__main__titleBox"]}>
        <div className={styles["home__main__titleBox__title"]}>bill0077.log</div>
        <div className={styles["home__main__titleBox__subtitle"]}>함께 성장하는 개발자를 꿈꿉니다</div>
        <a href="mailto:bill007tjr@gmail.com" rel="noreferrer noopener" className={styles["home__main__titleBox__contact"]}>bill007tjr@gmail.com</a>
        <a href="https://github.com/bill0077" target="_blank" rel="noreferrer noopener" className={styles["home__main__titleBox__contact"]}>https://github.com/bill0077</a>
      </div>
    </div>
    <div className={styles["home__contents"]}>
      <div className={styles["home__contents__categories"]}>
        <ContentsTree />
      </div>
      <div className={styles["home__contents__recommended"]}>
        <RecommendedList />
      </div>
    </div>
  </div>
  );
}

export default Home;