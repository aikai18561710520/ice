module.exports = {
    root: false,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true
    },
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    rules: {
        'space-before-function-paren': [
            2,
            {
                anonymous: 'always',
                named: 'never'
            }
        ],
    },
    globals: {}
}