import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { useCustomCanonStore } from "../store/use-custom-canon-store";

/**
 * Lazy Loading:
 * O navegador só baixará os 255 textos do seu cânone ou o código da API
 * quando o usuário clicar na respectiva aba.
 */
const CustomCanon = lazy(
  () => import("../features/bible-custom/pages/CustomCanon"),
);
const CommonBible = lazy(
  () => import("../features/bible-api/pages/CommonBible"),
);
const BibleReader = lazy(
  () => import("../features/bible-api/pages/BibleReader"),
);

const RootRedirect = () => {
  const activeProfile = useCustomCanonStore((state) => state.activeProfile);
  
  if (!activeProfile) return null;
  
  if (activeProfile === "conventional") {
    return <Navigate to="/default-bible" replace />;
  }
  
  return <Navigate to="/my-personal-bible" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <RootRedirect /> },

      {
        path: "my-personal-bible",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                Opening Sacred Scrolls...
              </div>
            }
          >
            <CustomCanon />
          </Suspense>
        ),
      },

      {
        path: "default-bible",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                Connecting to Divine API...
              </div>
            }
          >
            <CommonBible />
          </Suspense>
        ),
      },

      {
        path: "read/:bookId/:chapter",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                Preparando os Pergaminhos...
              </div>
            }
          >
            <BibleReader />
          </Suspense>
        ),
      },
    ],
  },
]);

/**
 * Provider principal que será injetado no seu main.tsx
 */
export const AppRouter = () => <RouterProvider router={router} />;
