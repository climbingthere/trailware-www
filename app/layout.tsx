import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trailware — Next-Gen Outdoor Adventure Platform for Hikers & Trail Runners",
  description: "Trailware is a next-generation outdoor adventure platform for hikers, trail runners, and backcountry explorers. Powered by patent-pending behavioral intelligence. Join the early access list.",
  openGraph: {
    title: "Trailware — Next-Gen Outdoor Adventure Platform",
    description: "Powered by patent-pending behavioral intelligence, Trailware learns how YOU explore — your pace, terrain preferences, risk tolerance — to keep you safe and guide you smarter.",
    type: "website",
    url: "https://www.trailware.com/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    siteName: "Trailware",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trailware - Something Big is Coming",
    description: "A new way to explore. Stay informed. Stay safe. Be the first to experience the future of trail adventures.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Trailware",
  },
  icons: {
    icon: "/trailware_logo.png",
    apple: "/trailware_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
