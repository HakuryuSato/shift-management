export default async function fetchUserData() {

    try {
        // APIからシフトデータを取得
        const response = await fetch(
            `/api/getUserData`,
        );

        const responseData = await response.json();
        const data = responseData.data;

        return data

    } catch (error) {

        return [];
    }

};