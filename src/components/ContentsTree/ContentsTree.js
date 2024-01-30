import styles from "./ContentsTree.module.css";
import "../../assets/fonts/font.css";

function ContentsTree() {
  return (
    <div>
      <div className={styles["contents-tree__leaf"]}>Contents</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;├── PersonalHistory</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;├── ProblemSolving</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── boj </div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── programmers</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;├── SideProjects</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── arbitrage-bot</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── lambda-calculator </div>      
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── my-blog </div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── tetris-ai</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contents-tree__leaf"]}>&nbsp;&nbsp;└── etc</div>
    </div>
  );
}

export default ContentsTree;