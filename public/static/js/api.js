export class APIManager {
    async addEntry(entry) {
        try {
            const response = await fetch(`media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: entry.title,
                    author: entry.author,
                    type: entry.type,
                    image: entry.image,
                })
            });
            if (response.status === 201) return await response.json();
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async editEntry(entry) {
        try {
            const response = await fetch(`media/${entry.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: entry.title,
                    author: entry.author,
                    type: entry.type,
                    image: entry.image,
                })
            });
            if (response.status === 200) return await response.json();
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async deleteEntry(id) {
        try {
            const response = await fetch(`media/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 204) return true;
        } catch (error) {
            console.error(error);
        }
        return false;
    }
}
