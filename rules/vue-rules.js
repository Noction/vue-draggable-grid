module.exports = {
  rules: {
    // enforce consistent spacing inside array brackets in <template>
    'vue/array-bracket-spacing': ['error', 'never'],
    // enforce consistent spacing before and after the arrow in arrow functions in <template>
    'vue/arrow-spacing': 'error',
    // disallow or enforce spaces inside of blocks after opening block and before closing block in <template>
    'vue/block-spacing': 'error',
    // enforce line breaks after opening and before closing block-level tags
    'vue/block-tag-newline': ['error', { maxEmptyLines: 1,  multiline: 'always', singleline: 'always' }],
    // enforce consistent brace style for blocks in <template>
    'vue/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // disallow trailing commas
    'vue/comma-dangle': 'error',
    // enforce consistent spacing before and after commas in <template>
    'vue/comma-spacing': ['error', { after: true, before: false }],
    // enforce consistent comma style in <template>
    'vue/comma-style': ['error', 'last'],
    // tag of component in template MUST be like my-component
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    // enforce the casing of component name in components options
    'vue/component-options-name-casing': 'error',
    // enforce order of component top-level elements
    'vue/component-tags-order': ['error', { order: ['template', 'script[setup]', 'script:not([setup])', 'style:not([scoped])', 'style[scoped]'] }],

    // enforce order of defineEmits and defineProps compiler macros
    'vue/define-macros-order': 'error',
    // enforce consistent newlines before and after dots in <template>
    'vue/dot-location': ['error', 'property'],
    // enforce dot notation whenever possible in <template>
    'vue/dot-notation': 'error',
    // comparison in template must be !== or ===
    'vue/eqeqeq': 'error',
    // enforce unified line brake in HTML comments
    'vue/html-comment-content-newline': 'error',
    // enforce unified spacing in HTML comments
    'vue/html-comment-content-spacing': 'error',
    // enforce consistent indentation in HTML comments
    'vue/html-comment-indent': 'error',
    // name property in component MUST be same as file name
    'vue/match-component-file-name': ['error', { extensions: ['vue'], shouldMatchCase: false }],
    // require the registered component name to match the imported component name
    'vue/match-component-import-name': 'error',
    // enforce the maximum number of attributes per line
    'vue/max-attributes-per-line': ['error', { singleline: 2 }],
    // disallow element's child contents which would be overwritten by a directive like v-html or v-text
    'vue/no-child-content': 'error',
    // disallow the <template> <script> <style> block to be empty
    'vue/no-empty-component-block': 'error',
    // disallow to pass multiple objects into array to class
    'vue/no-multiple-objects-in-class': 'error',
    // disallow a potential typo in your component property
    'vue/no-potential-component-option-typo': ['error', { custom: [], presets: ['vue'], threshold: 1 }],
    // disallow the use of reserved names in component definitions
    'vue/no-reserved-component-names': 'error',
    // enforce consistent spacing inside braces
    'vue/no-static-inline-styles': 'error',
    // disallow this usage in a beforeRouteEnter method
    'vue/no-this-in-before-route-enter': 'error',
    // disallow unsupported Vue.js syntax on the specified version
    'vue/no-unsupported-features': ['error', { ignores: [], version: '^3.0.0' }],
    // disallow unused properties
    'vue/no-unused-properties': 'error',
    // disallow unused refs
    'vue/no-unused-refs': 'error',
    // disallow use computed property like method
    'vue/no-use-computed-property-like-method': 'error',
    // disallow unnecessary mustache interpolations
    'vue/no-useless-mustaches': 'error',
    // disallow unnecessary v-bind directives
    'vue/no-useless-v-bind': 'error',
    // C: disallow use of v-html to prevent XSS attack
    'vue/no-v-html': 0,
    // disallow v-text / v-html on component
    'vue/no-v-text-v-html-on-component': 'error',
    // enforce sort-keys in a manner that is compatible with order-in-components
    'vue/object-curly-spacing': ['warn', 'always', { arraysInObjects: true, objectsInObjects: true }],
    // require or disallow padding lines between blocks
    'vue/padding-line-between-blocks': 'error',
    // enforce import from 'vue' instead of import from '@vue/*'
    'vue/prefer-import-from-vue': 'error',
    // require static class names in template to be in a separate class attribute
    'vue/prefer-separate-static-class': 'error',
    // require shorthand form attribute when v-bind value is true
    'vue/prefer-true-attribute-shorthand': 'error',
    // require the component to be directly exported
    'vue/require-direct-export': 'error',
    // require a name property in Vue components
    'vue/require-name-property': 'error',
    // disallow static inline style attributes
    'vue/sort-keys': 'error',
    // enforce or forbid parentheses after method calls without arguments in v-on directives
    'vue/v-on-function-call': 'error'
  }
}
