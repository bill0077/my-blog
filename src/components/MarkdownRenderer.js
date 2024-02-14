import React from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

export default function MarkdownRenderer({ text }) {
  return (
    <Markdown 
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code(props) {
          const {children, className, node, ...rest} = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              /*style={dark}*/
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