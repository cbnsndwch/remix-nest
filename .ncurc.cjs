// as of 2024/02/25 these are known to be major version changes
// hide them for now
const reject = [
    'stripe',
    'change-case',
    'nanoid',
    'unleash-client',
    '@unleash/proxy',
    'date-fns',
    'i18next*',
    'conventional-changelog-cli',
    'query-string',
    'cookie',
    '@mdx-js/react',
    '@nivo/*',
	'mui-markdown',
	'@tanstack*'
];

/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    packageManager: 'yarn',
    deep: true,
    reject
};
