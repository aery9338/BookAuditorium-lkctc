import { useNavigate, useSearchParams } from "react-router-dom"

export const useQueryParams = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const setQueryParams = (params) => {
        const newSearchParams = new URLSearchParams(searchParams)
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, String(value))
            }
        })
        navigate(`?${newSearchParams.toString()}`)
    }

    const getQueryParam = (paramName) => searchParams.get(paramName)

    const removeQueryParam = (paramName) => {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete(paramName)
        navigate(`?${newSearchParams.toString()}`)
    }

    const removeAllQueryParams = () => {
        navigate(window.location.pathname)
    }

    return {
        getQueryParam,
        setQueryParam: (paramName, paramValue) => setQueryParams({ [paramName]: paramValue }),
        setQueryParams,
        removeQueryParam,
        removeAllQueryParams,
    }
}
