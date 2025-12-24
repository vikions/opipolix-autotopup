import "./globals.css";

export const metadata = {
  title: "Opipolix AutoTopUp",
  description: "Automated balance top-up with ERC-7715 Advanced Permissions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
