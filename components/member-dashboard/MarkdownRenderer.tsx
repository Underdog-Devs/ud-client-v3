import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './markdownRenderer.module.scss';
interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className={styles.markdownContainer}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};