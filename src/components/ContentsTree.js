import React from "react"

import * as styles from "../styles/ContentsTree.module.css";
import "../assets/fonts/font.css";

/** Dummy table of contents component.
    To be modified later. */
function ContentsTree() {
  return (
    <div>
      <div className={styles["contentsTree__leaf"]}>Contents</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;├── PersonalHistory</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;├── ProblemSolving</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── boj </div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── programmers</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;├── SideProjects</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── arbitrage-bot</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── lambda-calculator </div>      
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── my-blog </div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── tetris-ai</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;└── etc</div>
    </div>
  );
}

export default ContentsTree;