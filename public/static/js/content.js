export class ContentManager{
    constructor(listElement, EntryManager, batchSize = 10, entryOnClick = null) {
        this.listElement = listElement;
        this.EntryManager = EntryManager
        this.batchSize = batchSize;
        this.entryOnClick = entryOnClick;

        this.clearEntries();
    }

    clearEntries() {
        this.listElement.innerHTML = '';
        this.entries = [];
        this.cursor = 1;
        this.running = false;
        this.noContentLeft = false;
    }

    async loadEntries() {
        if (this.noContentLeft) return 204;
        if (this.running) return 1;
        this.running = true;
        try {
            const response = await fetch(`media?cursor=${this.cursor}&batch=${this.batchSize}`, {
                method: 'GET'
            });
            const status = response.status;
            if (status === 204) {
                this.noContentLeft = true;
            }
            if (status === 200) {
                const data = await response.json();
                data.body.forEach(entry => {
                    const entryManager = new this.EntryManager(this.entries.length + 1, entry, this.listElement);
                    this.entries.push(entryManager);
                    if (this.entryOnClick !== null) {
                        entryManager.setClickEvent(() => {
                            this.entryOnClick(entry);
                        });
                    }
                });
                this.cursor = this.entries[this.entries.length - 1].getId() + 1;
            }
            this.running = false;
            return status;
        } catch (error) {
            console.error(error);
            this.running = false;
            return 0;
        }
    }
}

export class EntryManager {
    constructor(number, entry, listElement) {
        this.number = number;
        this.entry = entry;
        this.listElement = listElement;

        this.generate();
    }

    generate() {
        const post = document.createElement('tr');
        this.listElement.appendChild(post);

        const tdNumber = document.createElement('td');
        post.appendChild(tdNumber);
        const tdImage = document.createElement('td');
        post.appendChild(tdImage);
        const tdTitle = document.createElement('td');
        post.appendChild(tdTitle);
        const tdAuthor = document.createElement('td');
        post.appendChild(tdAuthor);
        const tdType = document.createElement('td');
        post.appendChild(tdType);

        this.btn = document.createElement('button');
        this.btn.type = 'button';
        this.btn.classList.add('link');
        this.btn.innerText = this.entry.title;

        const img = document.createElement('img');
        img.src = this.entry.image ? this.entry.image : '';
        img.alt = '';

        tdNumber.classList.add('number');
        tdNumber.innerText = this.number;
        tdImage.classList.add('image');
        tdImage.appendChild(img);
        tdTitle.classList.add('title');
        tdTitle.appendChild(this.btn);
        tdAuthor.classList.add('author');
        tdAuthor.innerText = this.entry.author;
        tdType.classList.add('type');
        tdType.innerText = this.entry.type;
    }

    getId() {
        return this.entry.id;
    }

    setClickEvent(event) {
        this.btn.addEventListener('click', event);
    }
}
