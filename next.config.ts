import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Reemplaza con el dominio de tu Cloudinary si es diferente
      },
      {
        protocol: 'http',
        hostname: 'example.com', // Reemplaza con el dominio de tu Cloudinary si es diferente
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      "res.cloudinary.com",
      "example.com",
    ]
  },
  /* config options here */
};

export default nextConfig;
