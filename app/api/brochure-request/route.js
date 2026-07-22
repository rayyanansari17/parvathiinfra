import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase';

const BrochureRequestSchema = z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email(),
});

export async function POST(request) {
        const body = await request.json();
        const parsed = BrochureRequestSchema.safeParse(body);
        if (!parsed.success) {
                return NextResponse.json({ detail: parsed.error.flatten() }, { status: 422 });
        }

        const supabase = getSupabase();
        const { name, phone, email } = parsed.data;

        const { data, error } = await supabase
                .from('brochure_requests')
                .insert({ name, phone, email })
                .select()
                .single();

        if (error) {
                console.error('brochure request insert error', error);
                return NextResponse.json({ detail: 'Could not save brochure request' }, { status: 500 });
        }

        // Also store as a lead for the sales pipeline — mirrors the original
        // FastAPI backend's dual-write.
        const { error: leadError } = await supabase.from('leads').insert({
                name,
                phone,
                email,
                source: 'brochure_download',
        });
        if (leadError) {
                console.error('brochure->lead insert error', leadError);
        }

        return NextResponse.json(data, { status: 201 });
}
