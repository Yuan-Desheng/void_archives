import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

/** MDX/Markdown 讲解渲染（R1）。react-markdown + rehype-highlight 语法高亮，样式见 globals .prose-lesson */
export function MarkdownView({ children }: { children: string }) {
  return (
    <div className="prose-lesson text-sm text-foreground">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{children}</ReactMarkdown>
    </div>
  )
}
