module.exports = {
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    ignorePatterns: ['dist/**', 'target/**', 'src/openapi/**', '.eslintrc.js', 'src/sdk/**'],
};
