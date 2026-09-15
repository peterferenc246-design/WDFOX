import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function TawkWidget() {
  useEffect(() => {
    const w = window as typeof window & {
      Tawk_API?: Record<string, unknown>;
      Tawk_LoadStart?: Date;
    };

    // Tawk's official bootstrap requires these globals to exist before
    // the embed loader is inserted.
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = w.Tawk_LoadStart || new Date();

    if (document.getElementById("tawkto-widget-script")) return;

    const script = document.createElement("script");
    script.id = "tawkto-widget-script";
    script.async = true;
    script.src = "https://embed.tawk.to/6a951d52c3c46c344587662a/1k1b9121q";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Insert into the document before the first script element, matching
    // Tawk's official installation snippet as closely as possible.
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }, []);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <TawkWidget />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
