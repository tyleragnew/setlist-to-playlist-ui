import { useMemo } from 'react'
import { useLocation, matchPath } from 'react-router-dom'

/**
 * Returns the active step index based on the current location.
 * Mapping:
 *  '/' => 0
 *  '/setlistMetadata' => 1
 *  '/playlist' => 2
 */
export function useStepIndex(): number {
    const { pathname } = useLocation()

    const index = useMemo(() => {
        if (matchPath({ path: '/setlistMetadata/*', end: false }, pathname)) return 1
        if (matchPath({ path: '/playlist/*', end: false }, pathname)) return 2
        // default to choose artist for any other path (including '/callback')
        return 0
    }, [pathname])

    return index
}

export default useStepIndex
