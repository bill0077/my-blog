import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import ContentsTree from "../components/ContentsTree"

import * as styles from "../styles/Post.module.css";
import "../assets/fonts/font.css";


function Post({ pageContext }) {
  const [postData, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.GATSBY_PUBLIC_URL}/${pageContext.filePath}`)
        .then((r) => r.text())
        .then(text  => {
          setData(text);
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
        <div>{postData}</div>
      </div>
    </div>
  );
}

export default Post;
