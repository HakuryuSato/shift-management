// フルカレンダーの日付セル描画に関する設定
export const dayCellClassNames = (info: any,
    calendarViewMode: string,
    customFullCalendarBgColorsPerDay: Record<string, string>
) => {

    const classes = [];
    const today = new Date();
    const dateStr = info.date
        .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .replace(/\//g, "-");

    // 今月の日曜日に灰色のテキストを適用
    // if (
    //     info.date.getDay() === 0 &&
    //     info.date.getMonth() === today.getMonth()
    // ) {
    //     classes.push("text-gray");
    // }

    // 混雑状況に応じて背景色を適用
    if (
        customFullCalendarBgColorsPerDay[dateStr] &&
        calendarViewMode !== "ATTENDANCE"
    ) {
        classes.push(customFullCalendarBgColorsPerDay[dateStr]);
    }

    return classes.join(" ");
};