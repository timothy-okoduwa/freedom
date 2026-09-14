import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['@freedom/ui', '@freedom/config', '@freedom/firestore-schema'],
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
};

export default nextConfig;
