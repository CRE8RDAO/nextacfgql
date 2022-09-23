module.exports = {
  singleQuote: true,
  printWidth: 120,
  endOfLine: 'LF',
  overrides: [
    {
      files: '*.scss',
      options: {
        singleQuote: false
      }
    }
  ]
}
