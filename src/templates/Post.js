import React from 'react';

import Navigator from "../components/Navigator";
import MarkdownRenderer from '../components/MarkdownRenderer';

import * as styles from "../styles/Post.module.css";

/** Template component for posting.
    Use 'pageContext' to fetch the markdown file to be used as content. */
export default function Post({ pageContext }) {
  // resolve path variable by replacing placeholder '___MEDIA_FILE_PATH___' inside the markdown file
  const markdown = pageContext.markdown.replace(/___MEDIA_FILE_PATH___/g, `${process.env.GATSBY_FILESERVER_URL}/${pageContext.mediaPath}`);

  return (
    <div className={styles["post"]}>
      <title>{pageContext.category+': '+pageContext.slug}</title>
      <Navigator />
      <div className={styles["post__background"]} />
      <div className={styles["post__content"]}>
        <div className={styles["post__content__markdown"]}>
          <div className={styles["post__content__markdown__title"]}>{pageContext.postTitle}</div>
          <div className={styles["post__content__markdown__author"]}>{`written by ${pageContext.postAuthor}`}</div>
          <div className={styles["post__content__markdown__date"]}>{`date: ${pageContext.postDate}`}</div>
          <MarkdownRenderer markdown={markdown} />
        </div>
      </div>
    </div>
  );
}
