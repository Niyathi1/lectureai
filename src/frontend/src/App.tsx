import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const HomePage = lazy(() => import("./pages/Home"));
const LecturePage = lazy(() => import("./pages/Lecture"));
const HistoryPage = lazy(() => import("./pages/History"));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div
        className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
        data-ocid="app.loading_state"
      />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const lectureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lecture/$id",
  component: LecturePage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  lectureRoute,
  historyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
