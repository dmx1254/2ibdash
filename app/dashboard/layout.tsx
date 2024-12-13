// import "@/app/globals.css";
// import { Metadata, Viewport } from "next";
import { UserNav } from "@/components/dash-comp/user-nav";
import Sidebar from "@/components/dash-comp/Sidebar";
import MobileBar from "@/components/MobileBar";
import AuthProvider from "../context/AuthPovider";
import DateFilter from "@/components/DateFilter";

// import { Toaster as DefaultToaster } from "@/components/ui/toaster";
// import { Toaster as NewYorkSonner } from "@/components/ui/sonner";
// import { Toaster as NewYorkToaster } from "@/components/ui/toaster";

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   metadataBase: new URL(siteConfig.url),
//   description: siteConfig.description,
//   keywords: [
//     "Next.js",
//     "React",
//     "Tailwind CSS",
//     "Server Components",
//     "Radix UI",
//   ],
//   authors: [
//     {
//       name: "mamadou SY",
//       url: "https://github.com/dmx1254",
//     },
//   ],
//   creator: "shadcn",
//   openGraph: {
//     type: "website",
//     locale: "fr_FR",
//     url: siteConfig.url,
//     title: siteConfig.name,
//     description: siteConfig.description,
//     siteName: siteConfig.name,
//     images: [
//       {
//         url: siteConfig.ogImage,
//         width: 1200,
//         height: 630,
//         alt: siteConfig.name,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: siteConfig.name,
//     description: siteConfig.description,
//     images: [siteConfig.ogImage],
//     creator: "mamadou SY",
//   },
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon-16x16.png",
//     apple: "/apple-touch-icon.png",
//   },
//   manifest: `${siteConfig.url}/site.webmanifest`,
// }

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <main className="w-full flex bg-dark-300">
        <Sidebar />
        <section className="w-full">
          <div className="flex bg-dark-300 w-full border-b border-dark-400 sticky right-0 p-3 top-0 bottom-8 items-center justify-between space-x-4 z-30">
            <MobileBar />
            <div className="w-full flex items-center justify-between gap-4">
              <UserNav />
            </div>
          </div>
          <div className="p-4 relative w-full flex min-h-screen flex-col">
            {children}
          </div>
        </section>
      </main>
    </AuthProvider>
  );
}
