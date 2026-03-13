import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/theme-context";
import { UserProvider } from "./context/user-context";
import router from "./router";

const queryClient = new QueryClient()

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vas-ui-theme">
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App