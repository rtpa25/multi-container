/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ['@multi-docker/eslint-config/next.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
    },
};

