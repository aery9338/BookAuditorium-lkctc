import React, { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "commonComponents/AppLayout"
import ErrorBoundary from "commonComponents/ErrorBoundary"
import Protected from "commonComponents/ProtectedRoute"

const routes = [
    // Auth Pages
    {
        path: "/login",
        Component: lazy(() => import("pages/auth/Login")),
        hideLayout: true,
        exact: true,
    },
    {
        path: "/signup",
        Component: lazy(() => import("pages/auth/SignUp")),
        hideLayout: true,
        exact: true,
    },

    // Private Pages
    {
        path: "/",
        Component: lazy(() => import("pages/public/Homepage")),
        hideLayout: false,
        auth: true,
        roles: ["user"],
        redirect: "/login",
        exact: true,
    },
    {
        path: "/auditorium/:id",
        Component: lazy(() => import("pages/public/Auditorium")),
        hideLayout: false,
        auth: true,
        roles: ["user"],
        redirect: "/login",
        exact: true,
    },
    {
        path: "/dashboard",
        Component: lazy(() => import("pages/public/Dashboard")),
        hideLayout: false,
        auth: true,
        roles: ["user"],
        redirect: "/login",
        exact: true,
    },

    // Error Pages
    {
        path: "/error/404",
        Component: lazy(() => import("pages/Error/404")),
        exact: true,
    },
    {
        path: "/error/500",
        Component: lazy(() => import("pages/Error/500")),
        exact: true,
    },
]

const Router = (props) => {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map(({ auth, redirect, roles, path, Component, hideLayout, exact }) => (
                    <Route
                        path={path}
                        key={path}
                        exact={exact}
                        element={
                            <AppLayout hideLayout={hideLayout}>
                                <Suspense fallback={null}>
                                    <ErrorBoundary>
                                        {auth ? (
                                            <Protected roles={roles} redirect={redirect}>
                                                <Component {...props} />
                                            </Protected>
                                        ) : (
                                            <Component {...props} />
                                        )}
                                    </ErrorBoundary>
                                </Suspense>
                            </AppLayout>
                        }
                    />
                ))}
                {/* Define a fallback route for undefined paths */}
                <Route path="*" element={<Navigate to="/error/404" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
