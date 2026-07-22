import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const CONCIERGE_SYSTEM_PROMPT = `You are 'Aria', the digital concierge for THE VIEW, the flagship gated villa-plot community by Parvathi Infra Developers in Kadthal, Telangana, India.

Speak warmly, concisely and with refined luxury hospitality. Keep replies short (2-4 sentences) unless asked for detail. Never invent facts. If you don't know something (e.g. exact current pricing), politely offer to connect them with the sales team and encourage them to share their contact details or download the brochure.

VERIFIED PROJECT FACTS:
- Project: THE VIEW — "A Scenic Address for a Selective Few".
- Developer: Parvathi Infra Developers.
- Total extent: 3.6 Acres. 41 exclusive villa plots.
- Plot sizes: approx. 200 to 388 sq. yards. 100% Vastu-compliant layout.
- Location: Kadthal, near Srisailam Highway, Telangana.
- Approvals: TG RERA approved, HMDA, Clear Title.
- Connectivity: Srisailam Highway 1 min, Regional Ring Road 6 min, 6-Lane NH to Tirupati 15 min, Proposed 4th City & Amazon Data Center 25 min, Fab City 35 min, RGI Airport 45 min, Foxconn 50 min.
- Amenities: 2220 sqft elegant clubhouse, swimming pool & kids pool, amphitheatre, landscaped parks, children's play area, gazebos, party lawn, senior citizens area, granite seating, 24x7 security with CC cameras, street lights, 30ft CC roads.
- Infrastructure: water connection & plantation for each plot, underground drainage, underground water line, overhead tank, elegant entrance gate.
- Contact: info@parvathiinfra.com (general enquiries), sales@parvathiinfra.com (sales), admin@parvathiinfra.com (admin/office). Office: Brindavan Colony, Ootapally Village, near Tondupally Toll Gate, Shamshabad, Telangana.

Always steer interested buyers toward booking a site visit or requesting the brochure. Do not discuss competitors negatively. If asked about price, say pricing is shared on request and offer to arrange a call.`;

const ChatMessageSchema = z.object({
        session_id: z.string().optional(),
        message: z.string().min(1),
});

function nowIso() {
        return new Date().toISOString();
}

export async function POST(request) {
        const body = await request.json();
        const parsed = ChatMessageSchema.safeParse(body);
        if (!parsed.success) {
                return NextResponse.json({ detail: parsed.error.flatten() }, { status: 422 });
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
                return NextResponse.json({ detail: 'LLM key not configured' }, { status: 500 });
        }

        const sessionId = parsed.data.session_id || crypto.randomUUID();
        const supabase = getSupabase();

        // Load prior history for this session and fold it into the system context.
        const { data: historyDocs, error: historyError } = await supabase
                .from('chat_messages')
                .select('role, content')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })
                .limit(40);

        if (historyError) {
                console.error('chat history fetch error', historyError);
        }

        let systemMessage = CONCIERGE_SYSTEM_PROMPT;
        if (historyDocs && historyDocs.length) {
                const transcript = historyDocs
                        .map((d) => `${d.role === 'user' ? 'Visitor' : 'Aria'}: ${d.content}`)
                        .join('\n');
                systemMessage += `\n\nCONVERSATION SO FAR:\n${transcript}`;
        }

        let replyText;
        try {
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${groqApiKey}`,
                        },
                        body: JSON.stringify({
                                model: GROQ_MODEL,
                                messages: [
                                        { role: 'system', content: systemMessage },
                                        { role: 'user', content: parsed.data.message },
                                ],
                        }),
                });

                if (!groqRes.ok) {
                        const errBody = await groqRes.text();
                        throw new Error(`Groq API error ${groqRes.status}: ${errBody}`);
                }

                const groqJson = await groqRes.json();
                replyText = groqJson.choices?.[0]?.message?.content;
                if (!replyText) throw new Error('Empty Groq response');
        } catch (e) {
                console.error('Chat error:', e);
                return NextResponse.json(
                        { detail: 'Concierge is unavailable right now.' },
                        { status: 502 },
                );
        }

        const { error: insertError } = await supabase.from('chat_messages').insert([
                { session_id: sessionId, role: 'user', content: parsed.data.message, created_at: nowIso() },
                { session_id: sessionId, role: 'assistant', content: replyText, created_at: nowIso() },
        ]);
        if (insertError) {
                console.error('chat_messages insert error', insertError);
        }

        return NextResponse.json({ session_id: sessionId, reply: replyText });
}
