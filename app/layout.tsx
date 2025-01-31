import "./globals.css";
import TopNav from '@/app/components/TopNav';
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div>{children}</div>
        <TopNav />
          <div>{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
