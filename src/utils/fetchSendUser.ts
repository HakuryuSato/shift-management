export default async function sendUser(userName: string) {

    const response = await fetch('/api/sendUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName })
    });
    return await response.json();
}

