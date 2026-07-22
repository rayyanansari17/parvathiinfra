import { SITE } from '@/lib/siteData';
import { WHATSAPP } from '@/constants/testIds';

export default function WhatsAppFloat() {
        return (
                <a
                        href={SITE.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={WHATSAPP.floatButton}
                        aria-label="Chat on WhatsApp"
                        className="group fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_0_0_0_rgba(201,162,75,0.6)] transition-shadow animate-gold-pulse hover:shadow-[0_0_0_14px_rgba(201,162,75,0)]"
                >
                        <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff">
                                <path d="M19.11 17.55c-.28-.14-1.66-.82-1.92-.91s-.44-.14-.63.14-.72.9-.88 1.09-.32.2-.6.07a7.9 7.9 0 0 1-2.32-1.43 8.78 8.78 0 0 1-1.62-2.02c-.17-.28 0-.44.12-.58s.28-.32.42-.49a1.94 1.94 0 0 0 .28-.47.51.51 0 0 0 0-.49c-.07-.14-.63-1.52-.86-2.08s-.46-.47-.63-.48H10a1 1 0 0 0-.72.34 3 3 0 0 0-.94 2.23A5.2 5.2 0 0 0 9.42 15a11.9 11.9 0 0 0 4.56 4c.64.28 1.13.44 1.52.56a3.68 3.68 0 0 0 1.68.11 2.75 2.75 0 0 0 1.8-1.27 2.24 2.24 0 0 0 .16-1.27c-.07-.11-.25-.18-.53-.32Zm-3-8.87A7.7 7.7 0 0 0 8.4 20.4l-1.1 4 4.1-1.07a7.7 7.7 0 1 0 4.72-14.65Zm4.55 12.28a6.4 6.4 0 0 1-3.55 1.86 6.5 6.5 0 0 1-3.72-.44l-.27-.16-2.44.64.66-2.38-.17-.27a6.5 6.5 0 1 1 9.49.75Z" />
                        </svg>
                        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-sm bg-ink/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                                WhatsApp
                        </span>
                </a>
        );
}
