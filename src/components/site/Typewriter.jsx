'use client';

import { useEffect, useState } from 'react';

/**
 * Typewriter effect that types through an array of strings sequentially.
 * Loops by default; caret blink built in.
 */
export default function Typewriter({
        words = [],
        typeSpeed = 65,
        deleteSpeed = 40,
        holdMs = 1600,
        className = '',
        caretClassName = 'text-gold',
        loop = true,
}) {
        const [wordIndex, setWordIndex] = useState(0);
        const [text, setText] = useState('');
        const [deleting, setDeleting] = useState(false);

        useEffect(() => {
                if (!words.length) return undefined;
                const current = words[wordIndex % words.length];

                let timeout;
                if (!deleting && text === current) {
                        if (!loop && wordIndex === words.length - 1) return undefined;
                        timeout = setTimeout(() => setDeleting(true), holdMs);
                } else if (deleting && text === '') {
                        setDeleting(false);
                        setWordIndex((i) => (i + 1) % words.length);
                } else {
                        timeout = setTimeout(
                                () => {
                                        setText(
                                                deleting
                                                        ? current.slice(0, text.length - 1)
                                                        : current.slice(0, text.length + 1),
                                        );
                                },
                                deleting ? deleteSpeed : typeSpeed,
                        );
                }
                return () => clearTimeout(timeout);
        }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, holdMs, loop]);

        return (
                <span className={className}>
                        {text}
                        <span
                                className={`ml-1 inline-block w-[2px] align-middle ${caretClassName}`}
                                style={{ animation: 'caretBlink 1s steps(2) infinite' }}
                        >
                                &nbsp;
                        </span>
                        <style>{`
                                @keyframes caretBlink {
                                        0%, 50% { background: currentColor; }
                                        51%, 100% { background: transparent; }
                                }
                        `}</style>
                </span>
        );
}
