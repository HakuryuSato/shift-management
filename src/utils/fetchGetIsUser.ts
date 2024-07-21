export default async function fetchGetIsUser(user_name: string) { //ユーザー名確認
    try {
        const response = await fetch(`/api/getIsUser?user_name=${user_name}`);
        if (!response.ok) {
            throw new Error(
                `Network response was not ok: ${response.statusText}`,
            );
        }
        const data = await response.json();
        console.log(data)
        return { data, error: null };

    } catch (error) {
        if (error instanceof Error) {
            return { data: null, error: error.message };
        } else {
            return { data: null, error: "An unknown error occurred" };
        }
    }
};