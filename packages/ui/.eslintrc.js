/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ['@multi-docker/eslint-config/react-internal.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.lint.json',
    },
};

