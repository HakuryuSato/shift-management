export default async function fetchUserNames() {

    try {
        // APIからシフトデータを取得
        const response = await fetch(
            `/api/getUserNames`,
        );

        const responseData = await response.json();
        const data = responseData.data;
        console.log("fetchUserNames data:11",data)
        return data

    } catch (error) {
        console.error("Failed to fetch shifts:", error);
        return [];
    }

};