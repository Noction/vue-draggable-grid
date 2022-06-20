module.exports = {
  extends: [
    'stylelint-config-standard-scss', // configure for SCSS
    'stylelint-config-recommended-vue', // add overrides for .Vue files
    'stylelint-config-recess-order', // use the recess order for properties
    'stylelint-config-css-modules', // configure for CSS Modules methodology
    'stylelint-config-prettier' // turn off any rules that conflict with Prettier
  ],
  rules: {
    'no-empty-source': null,
    'block-no-empty': null,
    'unit-allowed-list': ['px', 'em', 'rem', 's', '%', 'vh', 'vw', 'fr', 'deg', 'cm'],
    'color-function-notation': null, // should be enabled later
    'comment-no-empty': true,
    'no-descending-specificity': null,
    'no-extra-semicolons': true,
    'number-leading-zero': 'never',
    'indentation': [2, { 'baseIndentLevel': 1 }],
    'font-weight-notation': 'numeric',
    'comment-empty-line-before': null,
    'comment-whitespace-inside': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'declaration-no-important': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoElements: ['deep'] }]
  }
}
