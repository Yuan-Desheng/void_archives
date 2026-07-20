import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

/** MDX/Markdown 讲解渲染（R1）。react-markdown + rehype-highlight 语法高亮，样式见 globals .prose-lesson */
export function MarkdownView({ children }: { children: string }) {
  return (
    <div className="prose-lesson text-sm text-foreground">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 延伸阅读等外链在新标签打开，不打断当前学习
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
