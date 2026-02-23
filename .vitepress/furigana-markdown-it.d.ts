declare module 'furigana-markdown-it' {
  import MarkdownIt from 'markdown-it';
  
  interface FuriganaOptions {
    fallbackParens?: string;
    extraSeparators?: string;
    extraCombinators?: string;
  }
  
  function furiganaMarkdownIt(options?: FuriganaOptions): (md: MarkdownIt) => void;
  export default furiganaMarkdownIt;
}
