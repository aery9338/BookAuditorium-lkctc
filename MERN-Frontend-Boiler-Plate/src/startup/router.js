import React, { lazy, Suspense } from "react"
import { useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "commonComponents/AppLayout"
import ErrorBoundary from "commonComponents/ErrorBoundary"
import Protected from "commonComponents/ProtectedRoute"
import { selectIsConfigInitialLoading, selectIsUserInitialLoading } from "reduxStore/selectors"

const routes = [
    // Auth Pages
    {
        Component: lazy(() => import("pages/auth/Login")),
        exact: true,
        hideLayout: true,
        path: "/login",
    },
    // {
    //     Component: lazy(() => import("pages/auth/SignUp")),
    //     exact: true,
    //     hideLayout: true,
    //     path: "/signup",
    // },

    // Private Pages
    {
        auth: true,
        Component: lazy(() => import("pages/public/Homepage")),
        exact: true,
        hideLayout: false,
        path: "/",
        redirect: "/dashboard",
        roles: ["faculty"],
    },
    {
        auth: true,
        Component: lazy(() => import("pages/public/Auditorium")),
        exact: true,
        hideLayout: false,
        path: "/auditorium/:id",
        roles: ["admin", "faculty"],
    },
    {
        path: "/dashboard",
        Component: lazy(() => import("pages/public/Dashboard")),
        hideLayout: false,
        auth: true,
        roles: ["admin", "faculty", "staff"],
        exact: true,
    },

    // Error Pages
    {
        Component: lazy(() => import("pages/Error/404")),
        exact: true,
        path: "/error/404",
    },
    {
        Component: lazy(() => import("pages/Error/500")),
        exact: true,
        path: "/error/500",
    },
]

const Router = (props) => {
    const isUserInitialLoading = useSelector(selectIsUserInitialLoading)
    const isConfigInitialLoading = useSelector(selectIsConfigInitialLoading)

    if (isUserInitialLoading || isConfigInitialLoading) return null
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
