module.exports = {
  plugins: ['sort-exports'],
  rules: {
    // disallow spaces between curly braces
    'array-bracket-spacing': ['error', 'never'],
    // allows omitting parens when there is only one argument
    'arrow-parens': ['error', 'as-needed'],
    // "promise/always-return": "error",
    // requires space before/after arrow function's arrow.
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    // put brace after statement with 1 space and allow one inline statement
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // looks for any underscores (_) located within the source code.
    camelcase: 0,
    // disallow trailing commas
    'comma-dangle': ['error', 'never'],
    // required to use type comparison === or !==
    // enforces spacing around commas.
    'comma-spacing': ['error', { after: true, before: false }],
    // enforce consistent comma style in <template>
    'comma-style': ['error', 'last'],
    // Enforces newline before dots.
    'dot-location': ['error', 'property'],
    // enforces dot notation whenever possible.
    'dot-notation': 'error',
    // requires destructuring from arrays and/or objects
    eqeqeq: ['error', 'always'],
    // requires or disallows a space before function parenthesis.
    indent: ['error', 2, { SwitchCase: 1 }],
    'keyword-spacing': ['error', { after: true, before: true }], // ?
    // required 2 indented spaces
    'newline-after-var': 'error', // ?
    // enforce consistent spacing after keywords
    'no-async-promise-executor': 'error',
    // require an empty line after variable declarations
    'no-console': 'error',
    // isn't allowed to use async Promises
    'no-debugger': 'error', // ?
    // allow only console.error or console.warn
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    // allow debugger during development
    'no-trailing-spaces': 'error',
    // amount of empty lines has been exceeded
    'no-unneeded-ternary': 'error',
    // required not to have trailing spaces
    'no-var': 'error',
    // disallow ternary operators when simpler alternatives exist
    'object-curly-spacing': ['error', 'always'],
    // require `let` or `const` instead of `var`
    'object-shorthand': 'error',
    // allow spaces between curly braces
    'prefer-const': 'error',
    // require object literal shorthand syntax
    'prefer-destructuring': 'error',
    // Suggest using const
    'prefer-template': 'error',
    // Suggest using template literals instead of string concatenation
    'quote-props': ['error', 'as-needed'],
    // require quotes around object literal property names
    quotes: ['error', 'single'],
    // enforce the consistent use of either backticks, double, or single quotes
    semi: ['error', 'never'],
    // disallow semicolons
    'sort-exports/sort-exports': 'error', // ?
    // sorted list of export declarations
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple']
      }
    ],
    // sorted list of import declarations
    'space-before-blocks': 'error',
    // disallow Space Before Blocks
    'space-before-function-paren': 'error'
    // enforces the spaces inside of blocks after opening blocks and before closing blocks.
  }
}
