import { ThemeProvider } from "@/components/theme-provider";
import { IconProvider } from '@/lib/icons/IconProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <IconProvider>
          {children}
        </IconProvider>
      </body>
    </html>
  );
}