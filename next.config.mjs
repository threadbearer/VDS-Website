const imageCache = [
	{
		key: "Cache-Control",
		value: "public, max-age=31536000, immutable",
	},
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: "/portfolio/:path*",
				headers: imageCache,
			},
		];
	},
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  }
};

export default nextConfig;
