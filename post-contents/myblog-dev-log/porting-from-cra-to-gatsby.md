---
title: "개발 블로그 개발기 - 6. CRA에서 Gatsby로 Porting & routing 기능 구현하기"
date: "2024-02-05"
author: "bill0077"
---

**Demo: https://bill0077.github.io/my-blog  
Git commit: https://github.com/bill0077/my-blog/commit/14ab068b6eef3a070698a9f7783ed36af45a2d25**

본래는 React Router의 BrowserRouter을 이용해 dynamic routing을 구현하려 했었다. 하지만 몇가지 문제로 인해 static site generator 중 하나인 Gatsby를 이용하는 방법을 택하게 되었다. Gatsby를 이용한 routing 구현과정 이전에 BrowserRouter을 이용하는 과정에서 발생한 문제와 해결 방법을 살펴보자.

## 404 File Not Found ??
<center>
<img src="___MEDIA_FILE_PATH___/routing-error.png" width="60%" title="routing-error"/>
</center>

앞서 말했듯이 본래는 BrowserRouter를 이용해 라우팅을 구현하려고 하였고, 실제로 BrowserRouter를 이용해 구현을 진행하였다. 이후 라우팅 기능이 정상 작동하는 것을 확인하고 deploy 하였지만, deploy된 결과물을 다시 한번 확인해보는 과정에서 문제점을 알게되었다.

development server(=localhost)에서는 url을 직접 입력해도, 기존의 페이지에서 새로고침을 해도 문제없이 의도된 페이지를 렌더링해줬다. 하지만 아무 문제도 없던 블로그가 gh-pages를 이용해 배포를 하자 동일한 동작을 수행할 때 404 not found 오류가 발생했다. 결론적으로 말하자면 이 문제는 SPA를 static site만 호스팅 가능한 Github Pages로 배포했을 때 생기는 것으로, 다양한 해결방법이 존재한다. 먼저 SPA와 SSG가 무엇인지 부터 간단히 알아보자.

> **SPA란?**  
**Mdn Docs**: An SPA (Single-page application) is a web app implementation that loads only a single web document, and then updates the body content of that single document via JavaScript APIs such as Fetch when different content is to be shown.  
>
> SPA는 하나의 web document(create-react-app의 기본 설정이자 나의 현재 블로그 앱에서는 index.html가 해당 web document이다)만을 가지고 있고, Javascript API를 이용해 내용을 바꿔가며 사용자에게 보여주는 방식을 택하는 어플리케이션이다. 그리고 이 SPA의 가장 유명한 프레임워크 중 하나가 바로 React이다. 당연히 create-react-app을 이용한 나의 블로그도 SPA로 구성되어 있다.

> **SSG란?**  
**Gatsby Docs**: A static site generator is a software application that creates HTML pages from templates or components and a given content source.
>
> SSG는 static site generator의 약자로써 SPA처럼 하나의 web document에서 모든 요청을 처리하는 것이 아니라 각 페이지마다 개별의 html 파일이 존재하도록 만들어주는 어플리케이션이다. 이는 SPA에 비해 앱이 빠른 속도로 페이지 전환이 가능하도록 해주며, 클라이언트 측에서 페이지를 렌더링해야 하는 SPA와 달리 완성된 페이지가 서버에서 이미 렌더링 된 상태로 사용자에게 제공되다 보니 SEO에서도 이점을 볼 수 있다(그래서 SEO가 중요한 마케팅 웹사이트는 대부분 SSG를 이용해 만들어진다고 한다). 대신 모든 페이지를 빌드하고 배포하는 과정에서 시간이 오래 걸린다는 단점이 있다.

문제는 Github Pages는 Static Site만 호스팅 가능한 플랫폼이라는 것이다(SPA를 위한 routing을 지원하지 않음). 따라서 Github pages는 index.js로의 접근은 의도한 대로 처리할 수 있지만 다른 url을 직접 입력한다면 해당 요청은 처리할 수 없는 것이다. 즉 Github Pages는 bill0077.github.io/my-blog 로의 접근은 처리 가능하지만 bill0077.github.io/my-blog/home 으로의 접근은 404 에러를 띄우게 된다. 이 문제를 해결하는 몇가지 방법을 알아보자.

## 해결방법
### 1. HashRouter 사용
가장 간단한 방법은 BrowserRouter 대신 HashRouter을 사용하는 것이다. 서버 단에서 BrowserRouter와 HashRouter의 가장 큰 차이점은 HashRouter을 쓰는 경우 # 이후의 URL 부분은 전부 무시되고 해당 부분을 해쉬 처리하여 따로 전달받는다는 것이다. 즉 사용자가 *abc.com/#/foo/bar*를 요청한다 해도 서버에서는 *abc.com*만을 받고, 해쉬처리된 */foo/bar* 부분에 해당하는 페이지를 반환한다. 따라서 HashRouter을 이용한 SPA를 Github Pages에서 호스팅하면 Github Pages 서버가 받는 요청은 결국 *abc.com*에 해당하는 내용이므로 정상적으로 라우팅이 가능하게 된다 (BrowserRouter을 사용했을 때 404 에러가 발생하는 이유가 Github Pages 서버에 요청된 부가 URL 때문이므로, 부가 URL을 무시하는 HashRouter에서는 문제가 발생하지 않는다).

HashRouter을 사용하면 Github Pages에서도 문제없이 호스팅이 가능하게 되며 해쉬된 결과는 캐싱이 가능하므로 SPA 내부에서 빠른 페이지 전환에도 활용이 가능하다는 장점이 있다. 하지만 URL에서 해쉬된 부분은 구글에서 인덱스되지 않기 때문에(https://support.google.com/webmasters/thread/27227839?hl=en) /# 이후의 URL은 전부 구글 검색 결과에 노출되지 않으므로 SEO에 매우 취약해진다. 그래서 HashRouter은 페이지간 라우팅에서는 거의 사용되지 않고 웹 페이지 내부에서 특정 세션간 이동에 주로 사용된다(URL 주소의 가장 마지막에 #을 붙이고 어느 위치로 스크롤할지를 지정하는 등).

> **인덱싱이란?**  
> 검색 엔진 최적화(SEO) 영역에서 '색인화'라는 용어는 Google과 같은 검색 엔진이 웹 페이지 및 기타 온라인 콘텐츠를 데이터베이스에 저장하고 구성하는 과정을 의미합니다. 웹사이트가 색인화되었다는 것은 검색 엔진이 사이트를 크롤링하여 콘텐츠를 분석하고 색인에 추가하여 관련 검색어를 입력할 때 검색 엔진 결과 페이지(SERP)에 표시할 수 있게 되었다는 것을 의미합니다.

### 2. 404 page trick
Single Page Apps for GitHub Pages라는 이름으로 제안되었으며 404 page를 이용해서 Github Pages에서 SPA를 실행하는 것이 가능하도록 해주는 일종의 꼼수이다. 이 방법을 제안한 rafgraph의 github에서 소개글을 확인해보자.
> **How It Works**  
> GitHub Pages 서버가 프런트엔드 경로로 정의된 경로에 대한 요청을 받을 때 (예: `example.tld/foo`), 사용자 정의 404.html 페이지를 반환합니다. 사용자 정의 404.html 페이지에는 현재 URL을 가져와 경로와 쿼리 문자열을 쿼리 문자열로 변환한 다음 쿼리 문자열과 해시 조각만 사용하여 브라우저를 새 URL로 리디렉션하는 스크립트가 포함되어 있습니다. 예를 들어 `example.tld/one/two?a=b&c=d#qwe`는 `example.tld/?/one/two&a=b~and~c=d#qwe`가 됩니다.

즉 Github Pages는 BrowserRoute를 이용해 정의된 URL을 요청을 받으면 자동으로 404.html을 반환하는데, 이때 사용자가 정의한 404.html이 있다면 해당 파일을 리턴하게 된다. 이를 이용해 404.html에서 사용자가 요청한 URL을 쿼리 스트링으로 변환하고 그 결과를 원래의 index.html로 리다이렉트해주는 것이다. 단순하게는 404.html을 SPA를 위한 앱으로 활용하는 것으로 이해하면 된다. 더 자세한 설명과 해당 방법을 적용하기 위한 적용 방법은 rafgraph의 github에 잘 설명되어 있으므로 관심이 있다면 reference의 rafgraph 항목을 참조하면 된다. 해당 repo에서 제시하는 코드는 전부 MIT 라이선스의 오픈소스이므로 만일 이 방법을 적용한다면 MIT 라이선스를 잘 명시해 주도록 하자.

이 방법을 적용하면 Github Pages에서 호스팅 된 react app에서 BrowserRouter을 활용하면서도 정상적으로 dynamic routing이 가능하지만, 제안자도 명시했듯이 기본적으로 구글에서는 404 페이지에서 리다이렉트 되는 페이지를 인덱싱하지 않기 때문에 검색엔진에 노출되는 것이 어렵고(인덱싱이 되도록 하려면 추가적인 작업 필요), `example.tld/one/two?a=b&c=d#qwe`로 요청된 URL이 `example.tld/?/one/two&a=b~and~c=d#qwe`와 같은 방식으로 변환되는 등 URL이 변형된 형태로 요청된다는 것이다. 또한 Github Pages가 404.html을 반환한다는 특성을 이용하는 것이기 때문에 다른 Github Pages가 아닌 static site 호스팅 업체에서는 사용하는 것이 불가능할 수도 있다.

### 3. Static Site Generator
마지막 방법은 Github Pages에서 SPA를 호스팅하는 것을 포기하고 본래 목적에 맞게 static site를 만들어 호스팅하는 것이다. 이 방법은 현재 상태에서 가장 번거롭긴 하지만 위에서 언급한 단점들이 모두 없어지고, 개인적으로 SSG에 관심이 생겨 SSG를 이용하는 것으로 결정하였다. (Github Pages에서 블로그를 만들 때 괜히 SSG중 하나인 Jekyll을 이용하는 방법을 추천한 것이 아니었다.)

## CRA 에서 Gatsby로 Porting하기
여러 SSG가 각자의 장단점을 가지고 있지만 현재 블로그가 react를 기반으로 작성된 만큼 기존의 react app을 최대한 재활용하면서도 static site로 변환하는 것이 가능한 Gatsby를 이용하기로 결정했다. Gatsby는 react에서 공식적으로 react app을 처음 시작할 때 추천하는 방법 중 하나이기도 하다. 또한 CRA(=create-react-app)에서 Gatsby로 이전하는 것도 documentation이 굉장히 잘 되어 있어서 Porting 도중 웬만한 이슈는 전부 document에서 해결책을 찾을 수 있었다. 때문에 이 글에서는 실제로 CRA로 생성된 앱을 Gatsby로 이전하며 routing, deploy 등에서 겪은 문제들을 위주로 적어보겠다.

### Installation
먼저 gatsby를 설치해주자. `npm init gatsby`로 새로운 Gatsby 프로젝트를 시작해도 되지만 이번에는 기존의 코드에서 이어서 version control을 진행하고 싶었고, Gatsby에서도 새로운 프로젝트를 시작하는 방법 외에도 porting 하는 방법을 잘 작성해 놓아서 기존의 dependency에 추가만 해주었다.
```cmd
npm install gatsby
```

gatsby를 설치했다면 porting을 위해 필요한 것은 **1. 프로젝트 구조 변경 2. 라우팅 3. 기타 변경점 적용**이다.

## Project Structure
개인적으로 porting을 진행하며 가장 중요한 부분은 Gatsby 프로젝트 구조의 변화였던 것 같다. CRA가 최소한의 구성만 갖추고 대부분을 개발자의 재량에 맡기는 것에 비해 Gatsby는 어느정도의 가이드라인을 갖추고 있고, 이 가이드라인을 지켜야 서로가 편해진다.

Gatsby 프로젝트 구조의 핵심은 src 밑에 components, images, pages 폴더가 있고, pages 아래에 바로 Home.js, Contact.js처럼 static page로 변환될 react component 파일들이 위치해야 한다는 것이다. 이때 components, images, pages 폴더는 이름과 위치가 동일해야 한다! 또한 기존의 react app에서는 /src 바로 밑에 있던 App.js 또한 pages 아래로 옮겨 주어야 하며, 이름 또한 index.js로 바뀌어야 한다 (후술할 routing 때문).

변환된 프로젝트 구조는 크게 아래와 같다. pages 아래에 바로 .js 파일이 위치해야 하므로 기존에 컴포넌트를 감싸던 폴더들은 없앴고, css 파일들은 그냥 다 styles 밑으로 옮겨주었다. Post.js를 pages가 아닌 templates에 옮긴 이유는 바로 다름에 다룰 routing 때문이다.
```
my-app
  ├── node_modules
     ⋮
  ├── src
  │    ├── assets
  │    ├── components
  │    │    └── ContentsTree.js (목차 컴포넌트이다)
     ⋮
  │    ├── pages
  │    │    ├── Home.js
  │    │    └── index.js (기존의 App.js이다)
  │    ├── templates
  │    │    └── Post.js
  │    ├── styles
  │    │    ├── ContentsTree.module.css
  │    │    ├── Home.module.css
  │    │    ├── index.css
  │    │    └── Post.module.css
     ⋮
```

## Routing
위의 project structure와도 겹치는 내용인데, Gatsby에서 static site를 통한 라우팅을 구현하기 위해서는 **1. pages 폴더 아래에 페이지 컴포넌트 놓기 2. gatsby build** 의 과정만 거치면 된다.

**1. pages 폴더 아래에 페이지 컴포넌트 놓기**  
Gatsby는 pages 폴더 아래의 react 컴포넌트를 static page로 변환해주는 것이 가능하다 (static page라고는 하지만 기본적인 react app처럼 런타임에 DB나 다른 곳에서 데이터를 fetch하는 등의 동작은 모두 가능하다). 위의 구조를 가진 나의 프로젝트를 예시로 들면 index.js, Home.js가 pages 폴더 아래에 있으므로 따로 라우팅 처리를 하지 않아도 자동으로 bill0077.github.io/my-blog 에는 index.js의 내용이 보여지고, bill0077.github.io/my-blog/Home를 요청하면 Home 컴포넌트가 렌더링된 페이지가 보여지게 된다. 이는 nested routing에서도 동일하게 동작이 가능해서, 만일 bar 컴포넌트를 bar.js라는 이름으로 /src/pages/foo 라는 폴더에 저장해놓고 빌드하면, bill0077.github.io/my-blog/foo/bar 를 요청했을 때 bar 컴포넌트가 보여지게 된다 (이때 static page가 될 컴포넌트를 export default 해주어야 하는것에 유의하자). 정말 편리한 기능이다!

**2. gatsby build**  
pages 아래에 원하는 라우팅 형태로 페이지를 작성한 후 `npm run develop`으로 빌드하면(`npm run develop`을 사용하기 위한 방법은 후술함) public 폴더 아래에 각 컴포넌트의 이름을 한 폴더가 동일한 구조로 생성되며, 각 폴더 안에는 index.html 파일이 1개씩 생성된다 (예를 들어 /public/Home/index.html 같은 파일들이 생성된다는 뜻). 결론적으로 사용자는 URL 주소에 있는 index.html 파일을 통해 원하는 페이지에 접근이 가능한 것이다.

그런데 만일 블로그의 포스팅 페이지 처럼 동일한 컴포넌트를(이 컴포넌트를 Post라고 하자) 사용하지만 내용만 다른 페이지들을 만들기 위해 Post 컴포넌트를 복붙하여 사용하는 것은 딱봐도 개발 및 유지보수 측면에서 옳지 않아 보인다. 대신 템플릿으로 사용할 컴포넌트를 지정하고, 그 컴포넌트가 사용할 내용을 각 컴포넌트에 채워서 페이지로 변환하는 것이 더 좋은 구현처럼 보인다.

이를 위해 reach router을 이용해 CRA와 같은 dynamic routing도 가능하긴 하지만, 이는 BrowserRouter을 사용하는 것과 동일한 효과이므로 여기서는 사용할 이유가 없다. 대신 Gatsby가 제시하는 것은 `File System Route API`를 이용하거나, `gatsby-node.js`를 이용하는 방법이다. 그런데 `File System Route API`는 GraphQL이라는 쿼리 언어를 추가적으로 알아야 하므로, 나는 `gatsby-node.js`를 이용하는 방법을 택했다. 구현한 `gatsby-node.js`를 보며 어떻게 작동하는 것인지 알아보자.

```js
// gatsby-node.js
exports.createPages = ({ actions }) => {
  const { createPage } = actions
  get_mdfiles_as_node("./public/post-contents").forEach(node => {
    createPage({
      path: `/posts/${node.postTitle}`,
      component: require.resolve(`./src/templates/Post.js`),
      context: node
    })
  })
}
```
`gatsby-node.js` 파일 내부에는 `createPages` 함수를 구현하게 된다. `gatsby-node.js`는 프로젝트가 빌드되면 자동으로 실행되어, `createPages`가 미리 페이지들을 렌더링하게 된다. `createPages`는 매개변수로 1개의 object를 사용하는데 이 object는 라우팅 될 경로를 지정하는 `path`, 템플릿이 될 컴포넌트를 지정하는 `component`, 해당 컴포넌트가 내용으로 사용할 `context`를 멤버로 가지고 있어야 한다. 위의 `createPages` 함수를 보면 /posts/:postTitle의 경로에 /src/templates/Post.js의 컴포넌트를 템플릿으로 사용하는 것을 알 수 있다. `get_mdfiles_as_node`은 내가 직접 구현한 함수로, `get_mdfiles_as_node`가 반환할 결과의 예시는 아래와 같다. 
```js
const mdfiles_as_node = [
  {postTitle: "what-is-docker", filePath: "post-contents/what-is/what-is-docker.md" },
  {postTitle: "myblog-dev-log_1", filePath: "post-contents/myblog-dev-log/myblog-dev-log_1.md" },
  {postTitle: "myblog-dev-log_2", filePath: "post-contents/myblog-dev-log/myblog-dev-log_2.md" }
]
```
마크다운을 기반으로 포스팅을 만들 것이기 때문에 /post-contents 폴더에서 .md 파일들을 찾아 이름과 경로를 `context`로 사용할 수 있도록 해주었다. 이 방법이 아니라 local의 마크다운이 아니라 GraphQL, DB를 사용하는 방법도 가능할 것이다. 이후 Post.js에서 `pageContext`를 props로 받아와서 사용하도록 구성하면 된다. 구현한 Post.js는 아래와 같다.
```js
// Post.js
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
```
`pageContext`에서 각 마크다운 파일들의 경로를 받아와 fetch를 이용해 해당 경로에서 파일들을 읽어왔다. 파일의 내용을 직접 context로 전달한다면 포스팅 내부 내용이 변경될 때마다 새로 build를 해야하므로 위와 같은 방식을 선택하였다. `GATSBY_PUBLIC_URL`는 Gatsby에서 활용하는 환경변수인데 이는 다음 항목에서 다루겠다.

## Additional settings
routing까지 끝났다면 Gatsby를 활용하기 위한 큰 산을 넘었다고 생각한다. 이제부터는 porting된 프로젝트를 build하고 deploy하는 과정에서 겪은 여러가지 문제들을 공유해보겠다.

### build & deploy with gh-pages
`npm init gatsby`로 Gatsby 프로젝트를 시작한 것이 아니라 CRA 앱을 Gatsby로 Porting 하였다면 `npm run develop` 또는 `npm run dev`를 실행한다 하더라도 build가 되지 않는다. 이를 위해 package.json을 수정해 주어야 한다. 기존의 start, build, test 부분을 없애고 develop과 build 부분을 수정해주면 된다.

Github Pages에 Gatsby 프로젝트를 deploy를 하려면 공식 docs의 안내대로 packages.json 파일을 변경해주면 된다. *githubusername.github.io/repo*처럼 user page가 아닌 repository에서 배포할 것이라면 path prefix를 사용하기 위해 gatsby-config.js 파일을 추가해주어야 한다. 추가해준 gatsby-config.js과 수정된 package.json 파일은 아래와 같다.

```json
// package.json
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gatsby build --prefix-paths && gh-pages -d public",
    "develop": "gatsby develop -p 3000 -o",
    "build": "gatsby build"
  },
```

```js
// gatsby-config.js
module.exports = {
  pathPrefix: "/my-blog",
}
```

### css import
Gatsby 2.0에서 3.0으로 변경되며 CSS module을 import할 때 주의할 점은 기본 css loader 설정에서 class 이름에 대쉬 즉 "-" 기호를 사용하면 camelCase로 자동으로 변형된다는 것이다 (개발자 도구로 확인해본 결과 home__title-box가 home__titleBox와 같은 방식으로 변경된다). BEM naming 등 대쉬를 class의 이름으로 사용한다면 import가 제대로 되지 않기에 유의해야 한다. 대쉬가 포함된 기존의 이름을 그대로 사용하려면  `gatsby-plugin-postcss`라는 플러그인을 설치해 css loader의 기본 설정을 변경해 주어야 한다. 하지만 이를 소개한 gatsby 공식 docs만 따라할 경우 잘 작동되지 않는다는 글이 있으니 reference stackoverflow 항목을 참조해보면 좋을 것 같다. 나의 경우 사용한 css class가 별로 많지 않기에 그냥 class 이름들을 전부 camelCase로 변경해 주었다. 

또한 버전이 변경되며 css 파일을 import 할때도 아래와 같이 *를 사용해야 하는 것으로 변경되었으니 주의하자.
```js
import styles from "../styles/Home.module.css"; // 작동되지 않음
import * as styles from "../styles/Home.module.css"; // 제대로 작동함
```

### environment variables
react app에서는 브라우저에서 환경 변수에 접근이 가능하려면 `REACT_`를 변수 앞에 붙여 `REACT_PUBLIC_URL`와 같은 형식으로 사용해주어야 한다. 비슷하게 Gatsby에서는 `GATSBY_`를 붙여주어야 한다. `GATSBY_PUBLIC_URL` 와 같은 형식의 변수를 사용해 주면 된다. .env 파일은 Gatsby 공식 문서에서 알려주는 것처럼 작성하면 된다. .gitignore에 .env 파일은 제외하는 것을 잊지말자.
> **Gatsby Docs**: In development, Gatsby will load environment variables from a file named `.env.development`. For builds, it will load from `.env.production`.
```
# .env.development
GATSBY_PUBLIC_URL=https://foo.com/baz
```
```
# .env.production
GATSBY_PUBLIC_URL=https://bar.com/fie
```

## Porting 완료 !
위의 과정을 전부 거쳐 최종적으로 정상적으로 작동하는 Gatsby 프로젝트로 만들 수 있었다. 꽤나 고생했지만 그래도 깔끔하게 작동하는 블로그를 보니 만족스럽다. 이 글이 Create React App에서 Gatsby로 Porting 하려는 다른 분들께도 도움이 된다면 좋겠다.

<br>

***P.S.*** 이번 글을 쓰기 위해서 참고한 자료가 많다. 굉장히 잘 쓰여진 글들이니 본문이 이해가 안된다면 방문해서 읽어보는 것을 매우매우 추천한다.

## reference
**preliminary investigation:**  
Mdn web docs, SPA (Single-page application): https://developer.mozilla.org/en-US/docs/Glossary/SPA

Gatsby docs, Static Site Generator: https://www.gatsbyjs.com/docs/glossary/static-site-generator/

StackOverflow, What is the difference between HashRouter and BrowserRouter in React?: https://stackoverflow.com/questions/51974369/what-is-the-difference-between-hashrouter-and-browserrouter-in-react

changjun.log, React Router의 HashRouter 알아보기: https://velog.io/@ckdwns9121/React-Router%EC%9D%98-HashRouter-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0

SEO London, 인덱싱이란?: https://seo.london/ko/%EC%A7%80%EC%8B%9D-%EA%B8%B0%EB%B0%98/%EC%9D%B8%EB%8D%B1%EC%8B%B1-%EB%8C%80%EC%83%81/

rafgraph, spa-github-pages: https://github.com/rafgraph/spa-github-pages

<br>

**porting from cra to gatsby:**  
Gatsby Docs, Porting from Create React App to Gatsby: https://www.gatsbyjs.com/docs/porting-from-create-react-app-to-gatsby/

Gatsby Docs, Creating and Modifying Pages: https://www.gatsbyjs.com/docs/creating-and-modifying-pages/

Sukjoon Kim, Gatsby 동적 라우팅(Dynamic Routing) 처리하기: https://medium.com/@sjoonk/gatsby-%EB%8F%99%EC%A0%81-%EB%9D%BC%EC%9A%B0%ED%8C%85-dynamic-routing-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0-9e2a8a68931d

StackOverflow, Creating and Modifying Pages: https://stackoverflow.com/questions/20822273/best-way-to-get-folder-and-file-list-in-javascript

StackOverflow, Dashes in CSS class names with Gatsby v3 (css-loader v5): https://stackoverflow.com/questions/66633882/dashes-in-css-class-names-with-gatsby-v3-css-loader-v5

Gatsby Docs, Environment Variables: https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/

Gatsby Docs, How Gatsby Works with GitHub Pages: https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/how-gatsby-works-with-github-pages/