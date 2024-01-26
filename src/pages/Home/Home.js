import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

import styles from "./Home.module.css";
import "../../assets/fonts/font.css";

function CarModel(props) {
  const { scene } = useGLTF("/my-blog/models/bmw/bmw_m4_competition_m_package.glb");
  return <primitive object={scene} {...props} />
}

function ContentsTree() {
  return (
    <div>
      <div className={styles["home__contents__contents-tree__leaf"]}>Contents</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;├── PersonalHistory</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;├── ProblemSolving</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── boj </div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── programmers</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;├── SideProjects</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── arbitrage-bot</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── lambda-calculator </div>      
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── my-blog </div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── tetris-ai</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["home__contents__contents-tree__leaf"]}>&nbsp;&nbsp;└── etc</div>
    </div>
  );
}

function RecommendedList() {
  return (
    <div>
      <div className={styles["home__recommended__title"]}>Recommended Posts</div>
      <li className={styles["home__recommended__post"]}>개발 블로그 개발기</li>
      <li className={styles["home__recommended__post"]}>테트리스 ai 개발기</li>
      <li className={styles["home__recommended__post"]}>PS: 백준(boj) 1234번 풀이 </li>
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
      <div className={styles["home__main__title-box"]}>
        <div className={styles["home__main__title-box__title"]}>bill0077.log</div>
        <div className={styles["home__main__title-box__subtitle"]}>함께 성장하는 개발자를 꿈꿉니다</div>
        <a href="mailto:bill007tjr@gmail.com" rel="noreferrer noopener" className={styles["home__main__title-box__contact"]}>bill007tjr@gmail.com</a>
        <a href="https://github.com/bill0077" target="_blank" rel="noreferrer noopener" className={styles["home__main__title-box__contact"]}>https://github.com/bill0077</a>
      </div>
    </div>
    <div className={styles["home__contents"]}>
      <div className={styles["home__contents__contents-tree"]}>
        <ContentsTree />
      </div>
      <div className={styles["home__recommended"]}>
        <RecommendedList />
      </div>
    </div>
  </div>
  );
}

export default Home;