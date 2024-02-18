import React from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

/** Renderer component that converts text into a React component according to Markdown format. */
export default function MarkdownRenderer({ text }) {
  return (
    <Markdown 
      remarkPlugins={[
        remarkGfm, // enables GFM extensions
        remarkFrontmatter // enables frontmatter
      ]} 
      rehypePlugins={[rehypeRaw]} // enables html tags inside markdown file
      components={{
        code(props) { // apply syntax highlighting inside code blocks
          const {children, className, node, ...rest} = props
          const match = /language-(\w+)/.exec(className || '') // find matching language
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              /*style={dark}*/ // dark mode for code block 
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}>
      {text}
    </Markdown>
  );
}