export default async function fetchUserNames() {

    try {
        // APIからシフトデータを取得
        const response = await fetch(
            `/api/getUserNames`,
        );

        const responseData = await response.json();
        const data = responseData.data;

        return data

    } catch (error) {

        return [];
    }

};