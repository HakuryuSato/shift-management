export default async function deleteUser(user_name:string) {
    try {
        const response = await fetch(`/api/deleteUser?user_name=${user_name}`, {
            method: 'DELETE'
        });


        if (response.ok) {
            const responseData = await response.json();
        }
    } catch (error) {
        // console.error('Failed to delete user:', error);
    }
}
