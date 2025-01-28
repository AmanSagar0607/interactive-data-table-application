import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Interactive Data Table",
  description: "A responsive interactive data table application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">{children}</div>
      </body>
    </html>
  )
}

