import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </>
  );
}
