import React from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

/** Renderer component that converts text into a React component according to Markdown format. */
export default function MarkdownRenderer({ markdown }) {
  return (
    <div style={{backgroundColor: "#181818"}}>
    <Markdown 
      remarkPlugins={[
        remarkGfm, // enables GFM extensions
        remarkFrontmatter // enables frontmatter
      ]} 
      rehypePlugins={[rehypeRaw]} // enables html tags inside markdown file
      components={{ // custom component stylings inside markdown file
        h1(props) {
          const {children, ...rest} = props;
          return (<>
            <h1 style={{color: "white", borderBottom: "double"}} {...rest}>{children}</h1>
          </>)
        },
        h2(props) {
          const {children, ...rest} = props;
          return (<>
            <h1 style={{color: "white", borderBottom: "solid"}} {...rest}>{children}</h1>
          </>)
        },
        h3(props) {
          const {children, ...rest} = props;
          return <h2 style={{color: "white"}} {...rest}>{children}</h2>
        },
        h4(props) {
          const {children, ...rest} = props;
          return <h3 style={{color: "white"}} {...rest}>{children}</h3>
        },
        h5(props) {
          const {children, ...rest} = props;
          return <h4 style={{color: "white"}} {...rest}>{children}</h4>
        },
        h6(props) {
          const {children, ...rest} = props;
          return <h5 style={{color: "white"}} {...rest}>{children}</h5>
        },

        p(props) {
          const {children, ...rest} = props;
          return <p style={{color: "#D0D0D0", fontSize: "2.5vh", lineHeight: "160%"}} {...rest}>{children}</p>
        },

        strong(props) {
          const {children, ...rest} = props;
          return <p style={{color: "white", display: "inline", fontWeight: "bold"}} {...rest}>{children}</p>
        },

        a(props) {
          const {children, ...rest} = props;
          return <a to={children} style={{color: "cadetblue", display: "inline"}} {...rest}>{children}</a>
        },

        li(props) {
          const {children, ...rest} = props;
          return (
            <li style={{color: "#D0D0D0", fontSize: "2.5vh", lineHeight: "150%"}} {...rest}>{children}</li>
          )
        },

        blockquote(props) {
          const {children, ...rest} = props;
          return (
          <div style={{borderLeft: "1vh cadetblue solid", backgroundColor: "#282828"}}>
            <p style={{marginLeft: "1vh", marginRight: "1vh", color: "#D0D0D0", fontSize: "2.5vh", lineHeight: "150%"}} {...rest}>{children}</p>
          </div>
          )
        },

        code(props) { // apply syntax highlighting inside code blocks
          const {children, className, node, ...rest} = props
          const match = /language-(\w+)/.exec(className || '') // find matching language
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={darcula} // dark mode for code block 
            />
          ) : (
            <code style={{color: "darkcyan"}} {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}>
      {markdown}
    </Markdown>
    </div>
  );
}