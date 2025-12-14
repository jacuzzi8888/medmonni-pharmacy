import { useState, useCallback } from 'react';

interface UseCopyToClipboardResult {
    copiedText: string | null;
    copy: (text: string) => Promise<boolean>;
    isCopied: boolean;
    reset: () => void;
}

/**
 * useCopyToClipboard Hook
 * Copies text to clipboard and tracks copied state.
 * 
 * @param resetDelay - Time in ms before isCopied resets (default: 2000)
 * @returns { copiedText, copy, isCopied, reset }
 * 
 * @example
 * const { copy, isCopied } = useCopyToClipboard();
 * 
 * return (
 *   <button onClick={() => copy('Hello!')}>
 *     {isCopied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 */
export function useCopyToClipboard(resetDelay: number = 2000): UseCopyToClipboardResult {
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback(async (text: string): Promise<boolean> => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard API not available');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setIsCopied(true);

            // Auto-reset after delay
            setTimeout(() => {
                setIsCopied(false);
            }, resetDelay);

            return true;
        } catch (error) {
            console.warn('Failed to copy:', error);
            setCopiedText(null);
            setIsCopied(false);
            return false;
        }
    }, [resetDelay]);

    const reset = useCallback(() => {
        setCopiedText(null);
        setIsCopied(false);
    }, []);

    return { copiedText, copy, isCopied, reset };
}

export default useCopyToClipboard;
