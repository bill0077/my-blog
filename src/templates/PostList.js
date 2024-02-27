import React from 'react';
import { Link } from "gatsby";

import Navigator from "../components/Navigator"

import * as styles from "../styles/PostList.module.css";

/** Template component for post list.
    Use 'pageContext' to fetch the list of postings. */
export default function PostList({ pageContext }) {
  return (
    <div className={styles["postList"]}>
      <Navigator />
      <div className={styles["postList__background"]} />
      <div className={styles["postList__category"]}>{pageContext.category}</div>
      <div className={styles["postList__content"]}>
        {pageContext.postList.map((post) => (
          <div className={styles["postList__content__post"]}>
            <Link className={styles["postList__content__post__title"]} to={`${process.env.GATSBY_PUBLIC_URL}/${post.postLink}`}>{post.postTitle}</Link>
            <div className={styles["postList__content__post__excerpt"]}>{post.postExcerpt}</div>
            <div className={styles["postList__content__post__author"]}>{`written by ${post.postAuthor}`}</div>
            <div className={styles["postList__content__post__date"]}>{`date: ${post.postDate}`}</div>
            </div>
        ))}
      </div>
    </div>
  );
}
