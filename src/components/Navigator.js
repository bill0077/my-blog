import React from 'react';
import { Link } from 'gatsby';

import ContentsTree from "../components/ContentsTree"
import QueryInput from './QueryInput';

import * as styles from "../styles/Navigator.module.css";

/** Navigator component for blog. */
export default function Navigator() {
  return (
    <nav className={styles["navigator"]}>
      <Link to={process.env.GATSBY_PUBLIC_URL} className={styles["navigator__title"]}>bill0077.log</Link>
      <ContentsTree />
      <div style={{width:'80%'}}><QueryInput /></div>
    </nav>
  );
}
