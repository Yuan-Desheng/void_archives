import ReactMarkdown from 'react-markdown'

/** MDX/Markdown 讲解渲染（R1）。一期用 react-markdown，样式见 globals .prose-lesson */
export function MarkdownView({ children }: { children: string }) {
  return (
    <div className="prose-lesson text-sm text-fg">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
