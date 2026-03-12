import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import router from "./router";
import { ThemeProvider } from "./context/theme-provider";

const queryClient = new QueryClient()

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vas-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App