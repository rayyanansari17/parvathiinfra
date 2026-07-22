import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase';

const LeadCreateSchema = z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email().optional().or(z.literal('')).optional(),
        project_interested: z.string().optional().default('THE VIEW'),
        message: z.string().optional(),
        source: z.string().optional().default('website'),
});

export async function POST(request) {
        const body = await request.json();
        const parsed = LeadCreateSchema.safeParse(body);
        if (!parsed.success) {
                return NextResponse.json({ detail: parsed.error.flatten() }, { status: 422 });
        }

        const supabase = getSupabase();
        const { data, error } = await supabase
                .from('leads')
                .insert({
                        name: parsed.data.name,
                        phone: parsed.data.phone,
                        email: parsed.data.email || null,
                        project_interested: parsed.data.project_interested,
                        message: parsed.data.message || null,
                        source: parsed.data.source,
                })
                .select()
                .single();

        if (error) {
                console.error('lead insert error', error);
                return NextResponse.json({ detail: 'Could not save lead' }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
}

export async function GET() {
        const supabase = getSupabase();
        const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);

        if (error) {
                console.error('lead list error', error);
                return NextResponse.json({ detail: 'Could not list leads' }, { status: 500 });
        }

        return NextResponse.json(data);
}
