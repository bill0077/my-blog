---
title: "개발 블로그 개발기 - 8. 글 목록 페이지 제작"
date: "2024-02-18"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/ab89267c0e932eb1d13fe00d9d4a6c61f78a3102**

## 글 목록 만들기
현재 프로젝트는 gatsby-node.js에서 각 마크다운 파일을 템플릿 컴포넌트에 적용해 마크다운 파일별로 static page가 개별적으로 생성되어 있다. 고정된 url로 각 페이지를 직접 접속하는 것은 가능항지만 생성된 페이지들을 모아서 확인하고 이동할 수 있는 목록 페이지가 없는 상황이므로, 작성한 글을 카테고리 별로 묶어서 확인할 수 있는 글 목록 페이지를 만들어보자.

### gatsby-node.js
6번째 글에서 gatsby-node.js의 활용법을 파악하고 static page를 형성했으므로 이번에도 크게 어려운 점은 없었다. 각 글 페이지 별로 static page를 생성해주던 `createPages` 함수에 글 목록 또한 static하게 생성할 수 있도록 추가해주자.
```js
// gatsby-node.js
exports.createPages = ({ actions }) => {
  const { createPage } = actions
  get_post_as_node("post-contents", "./public/post-contents").forEach(node => {
    createPage({
      path: `/${node.category}/${node.slug}`,
      component: require.resolve(`./src/templates/Post.js`),
      context: node
    });
  });

  get_postList_as_node("post-contents", "./public/post-contents").forEach(node => {
    createPage({
      path: `/${node.category}`,
      component: require.resolve(`./src/templates/PostList.js`),
      context: node
    });
  });
}
```

글 목록을 node 형태로 가져오기 위해 /post-contents 폴더 내부의 마크다운 파일들을 dfs해서 각 폴더 별로 마크다운 파일의 목록을 조회하는 `get_postList_as_node` 함수를 간단히 구현해 사용했다. `get_postList_as_node`에서 아래와 같은 데이터를 반환하면 이를 템플릿으로 활용할 페이지에서 각각의 글 목록에 표시할 정보로 활용할 수 있게 된다.
```js
const postList_as_node = [
  {
    category: "myblog-dev-log",
    postList: [
      {
        postTitle: "title of the post",
        postDate: "date of the post",
        postAuthor: "author of the post",
        postExcerpt: "excerpt of the post",
        postLink: "link to the post"
      },
      {
        postTitle: "title of the post2",
        postDate: "date of the post2",
        postAuthor: "author of the post2",
        postExcerpt: "excerpt of the post2",
        postLink: "link to the post2"
      }
    ]
  },
  {
    category: "etc",
    postList: [
      {
        postTitle: "etc post",
        postDate: "today",
        postAuthor: "me",
        postExcerpt: "foo",
        postLink: "http://bar"
      }
    ]
  },

]
```

/templates의 PostList 컴포넌트를 템플릿으로 활용해 카테고리별로 글목록 페이지마다 글 목록을 pageContext로 넘겨주면 PostList에서는 각 글마다 제목, 작성자, 날짜 등을 보여주는 컴포넌트를 생성해 목록으로 보여주게 된다 (get_postList_as_node 함수에서 마크다운 파일들을 읽어 frontmatter를 해석하고, 해석된 정보를 context로 넘겨준다. 이때 간략하게 yaml frontmatter을 해석하고 활용하기 위해 추가적인 함수를 구현해 사용했다).
```js
// PostList.js
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
      <div className={styles["postList__category"]}>{pageContext.category}</div>
      <div className={styles["postList__content"]}>
        {pageContext.postList.map((post) => (
          <div className={styles["postList__content__post"]}>
            <Link className={styles["postList__content__post__title"]} to={`${process.env.GATSBY_PUBLIC_URL}/${post.postLink}`}>{post.postTitle}</Link>
            <div className={styles["postList__content__post__excerpt"]}>{post.postExcerpt}</div>
            <div className={styles["postList__content__post__date"]}>{`date: ${post.postDate}`}</div>
            <div className={styles["postList__content__post__author"]}>{`written by ${post.postAuthor}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 결과물
완성된 글 목록 페이지는 아래와 같은 모습을 하고 있다.
<center>
<img src="___MEDIA_FILE_PATH___/postlist_img.png" width="100%" title="postlist-page"/>
</center>

<br>
<br>

**P.S.** yaml frontmatter 해석이 가능한 `get_yaml_frontmatter`의 코드이다. 간단히 마크다운 텍스트를 입력으로 받고 frontmatter 부분을 찾은 후 `js-yaml` 모듈을 사용해 yaml로 번역한다. `js-yaml`은 아래처럼 설치가 가능하다.
```cmd
npm install js-yaml
```
```js
/** Simple function to get YAML frontmatter markdown.
    Return parsed object when success.
    Return undefined when there is no frontmatter or parsing is failed. */
var get_yaml_frontmatter = function(markdown) {
  markdown = markdown.trim();
  if (!markdown.startsWith('---') || !markdown.indexOf('---', 3)) { // check if markdown has frontmatter
    return;
  }

  const yaml = require('js-yaml');
  try {
    const frontmatterString = markdown.slice(3, markdown.indexOf('---', 3)).trim();
    const frontmatter = yaml.load(frontmatterString);
    return frontmatter;
  } catch (error) {
    return;
  }
}
```

## reference

npm, js-yaml, https://www.npmjs.com/package/js-yaml