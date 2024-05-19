import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import { socket } from "../components/socket";

import Navigator from "../components/Navigator"
import QueryInput from "../components/QueryInput";

import * as styles from "../styles/PostList.module.css";

/** Component for searching post.
  Use url params to get query.*/
export default function Search() {
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get("query")
  const [searchResult, setSearchResult] = useState(false);
  const [isConnected, setIsConnected] = useState(true)

  function onSearchResult(value) {
    setSearchResult(value)
  }

  useEffect(() => {
    setSearchResult(false)
    setIsConnected(true)
    socket.on("searchResult", onSearchResult);
    socket.timeout(10000).emit("query", {"query":query});

    const interval = setInterval(() => {
      if (!socket.connected) {
        setIsConnected(false);
      }
    }, 5000);

    return () => {
      socket.off("searchResult", onSearchResult);
      clearInterval(interval);
    };
  }, [query, socket.connected]);

  var searchStatus = ''
  if (!isConnected) {
    searchStatus = '현재 검색 서버와 연결되지 않습니다 :('
  } else if (!socket.connected) {
    searchStatus = '검색 서버 연결중...'
  }  
  else if (!searchResult) {
    searchStatus = `'${query}' 검색중...`
  }

  if (!searchResult) {
    return (
      <div className={styles["postList"]}>
        <Navigator />
        <div className={styles["postList__background"]} />
        <div style={{width:"40vw", paddingLeft:"30%"}}>
          <QueryInput />
        </div>
        <div className={styles["postList__category"]}>{searchStatus}</div>
      </div>
    )
  }

  return (
    <div className={styles["postList"]}>
      <Navigator />
      <div className={styles["postList__background"]} />
      <div style={{width:"40vw", paddingLeft:"30%"}}>
        <QueryInput />
      </div>
      <div className={styles["postList__category"]}>'{query}'에 대한 검색 결과입니다</div>
      <div className={styles["postList__content"]}>
        {searchResult.result.map(function(post) { 
          const path = post.path.replace("root/", "").replace(".md", "")
          return (<div className={styles["postList__content__post"]}>
            <Link className={styles["postList__content__post__title"]} to={`${process.env.GATSBY_PUBLIC_URL}/${path}`}>{path.replace("/", " > ")}</Link>
            <br/><br/>
            <span className={styles["postList__content__post__excerpt"]}>keyword: </span>
            {post.elems.map((keyword) => (<span>{keyword}, </span>))}
          </div>)
        })}
      </div>
    </div>
  );
}

