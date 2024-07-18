/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { dev }) {
        if (dev) {
            config.devtool = "source-map";
        }
        return config;
    },
};

module.exports = nextConfig;
