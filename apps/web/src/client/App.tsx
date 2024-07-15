import { appRoutes } from "@/client/router/appRoutes";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const createRouter = () => createBrowserRouter(appRoutes());

export function App() {
	return <RouterProvider router={createRouter()} />;
}
