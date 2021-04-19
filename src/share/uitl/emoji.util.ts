export function emojiChange(value: string) {
  return value
    .replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    .replace(/[^\\x00-xF]/g, "")
}
