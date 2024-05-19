import React from "react";
import { Link } from "gatsby";

import * as styles from "../styles/ContentsTree.module.css";

/** Dummy table of contents component.
    To be modified later. */
export default function ContentsTree() {
  return (
    <div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;├── SideProjects</div>    
      <div><Link to={`${process.env.GATSBY_PUBLIC_URL}/myblog-dev-log`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── myblog-dev-log</Link></div>
      <div><Link to={`${process.env.GATSBY_PUBLIC_URL}/markdown-search-engine`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── markdown-search-engine</Link></div>
      <div><Link to={`${process.env.GATSBY_PUBLIC_URL}/tadak-dev-log`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── tadak-dev-log</Link></div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;├── Study</div>
      <div><Link to={`${process.env.GATSBY_PUBLIC_URL}/AI`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── AI</Link></div>
      <div><Link to={`${process.env.GATSBY_PUBLIC_URL}/devops`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── devops</Link></div>
      <div className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;│</div>
      <div><Link to={`${process.env.GATSBY_PUBLIC_URL}/etc`} className={styles["contentsTree__leaf"]}>&nbsp;&nbsp;└── etc</Link></div>
    </div>
  );
}