import React from "react";
import { Link } from "gatsby";

import * as styles from "../styles/ContentsTree.module.css";

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
      <Link to={`${process.env.GATSBY_PUBLIC_URL}/myblog-dev-log`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── my-blog </Link>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── tetris-ai</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <Link to={`${process.env.GATSBY_PUBLIC_URL}/devops`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;└── etc</Link>
    </div>
  );
}

export default ContentsTree;