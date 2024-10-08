import { NextResponse } from 'next/server';

// このAPIだけdataを分解して返している、統合するためにdataのままreturnするよう変更する必要がある。

export async function GET() {
    const apiKey = process.env.GOOGLE_CALENDAR_API_KEY!;
    const calendarId = 'japanese__ja@holiday.calendar.google.com';

    // 3か月後まで取得
    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth() -3, 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 1).toISOString();

    // encodeURIComponent: URL用のエンコード
    const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            calendarId
        )}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
            // キャッシュ時間を1ヶ月(2592000秒)に設定
            next: { revalidate: 2592000 },
        }
    );

    if (!res.ok) {
        console.error('Failed to fetch holidays');
        return NextResponse.error();
    }

    const data = await res.json();

    const holidays = data.items.map((event: any) => ({
        title: event.summary,
        date: event.start.date,
    }));

    return NextResponse.json(holidays);
}
