// Custom Hooks - Barrel Export
// Reusable React hooks for common patterns

export { useDebounce, default as useDebounceDefault } from './useDebounce';
export { useLocalStorage, default as useLocalStorageDefault } from './useLocalStorage';
export {
    useMediaQuery,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    usePrefersDarkMode,
    usePrefersReducedMotion,
    default as useMediaQueryDefault
} from './useMediaQuery';
export { useIntersectionObserver, default as useIntersectionObserverDefault } from './useIntersectionObserver';
export { useCopyToClipboard, default as useCopyToClipboardDefault } from './useCopyToClipboard';
export { useRateLimit, default as useRateLimitDefault } from './useRateLimit';
