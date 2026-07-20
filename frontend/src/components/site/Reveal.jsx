import { motion } from 'framer-motion';

export function Reveal({ children, delay = 0, y = 24, className = '' }) {
        return (
                <motion.div
                        className={className}
                        initial={{ opacity: 0, y }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
                >
                        {children}
                </motion.div>
        );
}

export function SectionIndex({ n, label }) {
        return (
                <div className="mb-6 flex items-center gap-4">
                        <span className="font-ui text-[0.7rem] tracking-[0.32em] text-gold">
                                {String(n).padStart(2, '0')}
                        </span>
                        <span className="h-px w-8 bg-gold/50" />
                        <span className="micro-label">{label}</span>
                </div>
        );
}
