import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request, { params }) {
        const { session_id: sessionId } = await params;
        const supabase = getSupabase();

        const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })
                .limit(200);

        if (error) {
                console.error('chat history error', error);
                return NextResponse.json({ detail: 'Could not load chat history' }, { status: 500 });
        }

        return NextResponse.json(data);
}
