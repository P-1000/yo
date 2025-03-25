import { ThemeProvider } from "@/components/theme-provider";
import { IconProvider } from '@/lib/icons/IconProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <IconProvider>
            {children}
          </IconProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}