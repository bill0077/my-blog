import React, { useState, useEffect } from 'react';

import Navigator from "../components/Navigator";
import MarkdownRenderer from '../components/MarkdownRenderer';

import * as styles from "../styles/Post.module.css";

/** Template component for posting.
    Use 'pageContext' to fetch the markdown file to be used as content. */
export default function Post({ pageContext }) {
  const [postContent, setPostContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.GATSBY_PUBLIC_URL}/${pageContext.filePath}`)
        .then((r) => r.text())
        .then(text  => {
          // resolve path variable by replacing placeholder '___MEDIA_FILE_PATH___' inside the markdown file
          const path_resolved = text.replace(/___MEDIA_FILE_PATH___/g, `${process.env.GATSBY_PUBLIC_URL}/${pageContext.mediaPath}`);
          setPostContent(path_resolved);
        })
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
      
    fetchData();
  }, []);

  if (loading) { // markdown file not yet fetched
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["post"]}>
      <Navigator />
      <div className={styles["post__content"]}>
        <div className={styles["post__content__title"]}>{pageContext.postTitle}</div>
        <div className={styles["post__content__date"]}>{`date: ${pageContext.postDate}`}</div>
        <div className={styles["post__content__author"]}>{`written by ${pageContext.postAuthor}`}</div>
        <MarkdownRenderer text={postContent} />
      </div>
    </div>
  );
}
