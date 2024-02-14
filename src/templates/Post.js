import React, { useState, useEffect } from 'react';

import ContentsTree from "../components/ContentsTree"
import MarkdownRenderer from '../components/MarkdownRenderer';

import * as styles from "../styles/Post.module.css";
import "../assets/fonts/font.css";

export default function Post({ pageContext }) {
  const [postContent, setPostContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.GATSBY_PUBLIC_URL}/${pageContext.filePath}`)
        .then((r) => r.text())
        .then(text  => {
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["post"]}>
      <div className={styles["post__side"]}>
        <div className={styles["post__side__title"]}>bill0077.log</div>
        <ContentsTree />
      </div>
      <div className={styles["post__content"]}>
        <MarkdownRenderer text={postContent} />
      </div>
    </div>
  );
}
