import { useState, useCallback, useRef, useEffect } from 'react';

interface UseRateLimitOptions {
    /** Maximum number of attempts allowed */
    maxAttempts?: number;
    /** Time window in milliseconds */
    windowMs?: number;
    /** Cooldown period in seconds after hitting limit */
    cooldownSeconds?: number;
}

interface UseRateLimitResult {
    /** Whether the action can be performed */
    canProceed: boolean;
    /** Number of attempts remaining */
    attemptsRemaining: number;
    /** Cooldown countdown in seconds (0 if not in cooldown) */
    cooldown: number;
    /** Call this before each action to check/update rate limit */
    checkLimit: () => boolean;
    /** Reset the rate limiter */
    reset: () => void;
}

/**
 * useRateLimit Hook
 * Implements client-side rate limiting to prevent spam on forms.
 * 
 * @param options Configuration options
 * @returns Rate limit state and controls
 * 
 * @example
 * const { canProceed, checkLimit, cooldown, attemptsRemaining } = useRateLimit({
 *   maxAttempts: 3,
 *   windowMs: 60000, // 1 minute
 *   cooldownSeconds: 30
 * });
 * 
 * const handleSubmit = () => {
 *   if (!checkLimit()) {
 *     toast.error(`Too many attempts. Try again in ${cooldown}s`);
 *     return;
 *   }
 *   // ... submit logic
 * };
 */
export function useRateLimit(options: UseRateLimitOptions = {}): UseRateLimitResult {
    const {
        maxAttempts = 5,
        windowMs = 60000, // 1 minute
        cooldownSeconds = 30,
    } = options;

    const [attempts, setAttempts] = useState<number[]>([]);
    const [cooldown, setCooldown] = useState(0);
    const cooldownInterval = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (cooldownInterval.current) {
                clearInterval(cooldownInterval.current);
            }
        };
    }, []);

    // Remove expired attempts
    const getValidAttempts = useCallback(() => {
        const now = Date.now();
        return attempts.filter(timestamp => now - timestamp < windowMs);
    }, [attempts, windowMs]);

    const startCooldown = useCallback(() => {
        setCooldown(cooldownSeconds);

        cooldownInterval.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    if (cooldownInterval.current) {
                        clearInterval(cooldownInterval.current);
                    }
                    setAttempts([]); // Reset attempts after cooldown
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [cooldownSeconds]);

    const checkLimit = useCallback((): boolean => {
        // If in cooldown, deny
        if (cooldown > 0) {
            return false;
        }

        const validAttempts = getValidAttempts();

        // If at limit, start cooldown
        if (validAttempts.length >= maxAttempts) {
            startCooldown();
            return false;
        }

        // Record this attempt
        setAttempts([...validAttempts, Date.now()]);
        return true;
    }, [cooldown, getValidAttempts, maxAttempts, startCooldown]);

    const reset = useCallback(() => {
        setAttempts([]);
        setCooldown(0);
        if (cooldownInterval.current) {
            clearInterval(cooldownInterval.current);
        }
    }, []);

    const validAttempts = getValidAttempts();
    const canProceed = cooldown === 0 && validAttempts.length < maxAttempts;
    const attemptsRemaining = Math.max(0, maxAttempts - validAttempts.length);

    return {
        canProceed,
        attemptsRemaining,
        cooldown,
        checkLimit,
        reset,
    };
}

export default useRateLimit;
