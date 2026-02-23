/**
 * Markdown-it plugin for Ruby/Furigana text
 * Syntax: {base|ruby} or {base|ruby1|ruby2} for multiple ruby characters
 * Example: {漢字|かん|じ} or {東京|とうきょう}
 */

export default function markdownItRuby(md: any) {
  // Add a new inline rule for furigana
  md.inline.ruler.push('furigana', furiganaRule)
  md.renderer.rules.furigana = renderFurigana
}

function furiganaRule(state: any, silent: any) {
  const pos = state.pos
  const maximum = state.posMax

  // Check if we have opening brace
  if (pos + 2 >= maximum || state.src[pos] !== '{') {
    return false
  }

  // Find closing brace and pipe
  let pipePos = -1
  let bracePos = -1

  for (let i = pos + 1; i < maximum; i++) {
    if (state.src[i] === '|' && pipePos === -1) {
      pipePos = i
    }
    if (state.src[i] === '}') {
      bracePos = i
      break
    }
  }

  // No valid furigana pattern
  if (pipePos === -1 || bracePos === -1 || pipePos >= bracePos) {
    return false
  }

  if (!silent) {
    const base = state.src.slice(pos + 1, pipePos)
    const ruby = state.src.slice(pipePos + 1, bracePos)

    const token = state.push('furigana', 'ruby', 0)
    token.meta = { base, ruby }
    token.content = state.src.slice(pos, bracePos + 1)
  }

  state.pos = bracePos + 1
  return true
}

function renderFurigana(tokens: any, idx: any, options: any, env: any, renderer: any) {
  const token = tokens[idx]
  const { base, ruby } = token.meta

  const rubyParts = ruby.split('|')

  if (rubyParts.length === 1) {
    // Single ruby for entire base
    return `<ruby>${base}<rt>${ruby}</rt></ruby>`
  } else {
    // Multiple ruby parts - create separate ruby elements for each character
    let result = ''
    const baseChars = base.split('')

    for (let i = 0; i < baseChars.length; i++) {
      result += `<ruby>${baseChars[i]}`
      if (i < rubyParts.length) {
        result += `<rt>${rubyParts[i]}</rt>`
      }
      result += '</ruby>'
    }

    return result
  }
}
