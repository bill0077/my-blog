import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import ContentsTree from "../../components/ContentsTree/ContentsTree"
import postmapData from './PostMapper.json';

import styles from "./Post.module.css";
import "../../assets/fonts/font.css";


function Post() {
  const { postId } = useParams();
  const [postnotfound, setPostnotfound] = useState(false);
  const [postData, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedPost = postmapData.posts.find(post => post.id === postId);
    if (selectedPost) {
      const fetchData = async () => {
        try {
          await fetch(`${process.env.PUBLIC_URL}/${selectedPost.path}`)
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
    } else {
      setPostnotfound(true)
    }

  }, [postId]);

  if (postnotfound) {
    return <p>404</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["post"]}>
      <div className={styles["post__side"]}>
        <div className={styles["post__side__title"]}>bill0077.log</div>
        <div className={styles["post__side__contents-tree"]}>
          <ContentsTree />
        </div>
      </div>
      <div className={styles["post__content"]}>
        <div>{postData}</div>
      </div>
    </div>
  );
}

export default Post;
