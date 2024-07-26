export default function calcSumShiftHourPerDay(data: any[]) {
    // 全員分シフトの合計時間計算用
    const shiftHoursByDate: { [key: string]: number } = {};

    const calcHours = (start: any, end: any): number => {
        //もし開始が12時以前、かつ、終了が13時以降、なら昼休憩分1H減らす。
        return (start >= 12 && end <= 13) ? end - start - 1 : end - start;
    }

    data.forEach(({ start_time, end_time }) => {
        const start = new Date(start_time).getHours();
        const end = new Date(end_time).getHours();
        const date = start_time.split("T")[0]

        const hours = calcHours(start, end);

        shiftHoursByDate[date] = (shiftHoursByDate[date] || 0) + hours;
    });


    const colorsByDate = Object.fromEntries(
        Object.entries(shiftHoursByDate).map(([date, value]) => [
            date,
            value >= 70 ? 'bg-red' : value <= 56 ? 'bg-gray' : ''
        ])
    );

    return colorsByDate;
}