import { defineConfig } from 'vitepress'
import rtlcss from 'postcss-rtlcss'
import markdownItRuby from './plugins/markdown-it-ruby'
import furiganaMarkdownIt from 'furigana-markdown-it'

// @ts-ignore
import { readdirSync, readFileSync } from 'fs'
// @ts-ignore
import { resolve, dirname } from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
// @ts-ignore
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Helper function to generate sidebar items from markdown files
function generateSidebarItems() {
  const docsDir = resolve(__dirname, '../docs')
  const files = readdirSync(docsDir)
    .filter((file: string) => file.endsWith('.md') && file !== 'index.md')
    .sort()

  return files.map((file: string) => {
    const filePath = resolve(docsDir, file)
    const content = readFileSync(filePath, 'utf-8')
    const { data, content: markdown } = matter(content)
    
    // Get title from frontmatter or first heading
    let title = (data.title as string) || file.replace('.md', '')
    if (!data.title) {
      const headingMatch = markdown.match(/^# (.+)$/m)
      if (headingMatch) {
        title = headingMatch[1]
      }
    }
    
    const link = '/' + file.replace('.md', '')
    return { text: title, link }
  })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  
  title: "Cure Dolly in Hebrew",
  description: "Cure Dolly leassons in Hebrew",
  dir: "rtl",
  
  // Vite configuration for RTL support
  vite: {
    css: {
      postcss: {
        plugins: [
          rtlcss({
            safeBothPrefix: true,
            processUrls: true,
            useCalc: true,
            ltrPrefix: ':where([dir="ltr"])',
            rtlPrefix: ':where([dir="rtl"])',
          }),
        ],
      },
    },
  },
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        items: generateSidebarItems()
      }
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Cure Dolly in Hebrew',
      copyright: 'Copyright © Cure Dolly'
    }

  },

  markdown: {
    config(md) {
      md.use(furiganaMarkdownIt({}))
      md.use(markdownItRuby)
      md.renderer.rules.ruby_open  = () => '<span style="direction:ltr;unicode-bidi:isolate;display:inline-block"><ruby>'
      md.renderer.rules.ruby_close = () => '</ruby></span>'
      md.renderer.rules.rt_open    = () => '<rt>'
      md.renderer.rules.rt_close   = () => '</rt>'
      md.renderer.rules.rp_open    = () => '<rp>'
      md.renderer.rules.rp_close   = () => '</rp>'
    }
  },
  base: process.env.VITE_BASE_URL || '/',
})
