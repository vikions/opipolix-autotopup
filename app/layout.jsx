import "./globals.css";

export const metadata = {
  title: "OpiPoliX AutoTopUp - Automated Balance Management",
  description: "Automated balance top-up for Polymarket, Kalshi, Opinion using ERC-7715 Advanced Permissions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
