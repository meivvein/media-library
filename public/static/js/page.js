class PageManager {
    constructor(pages, thisPageIndex) {
        const pagesCopy = pages.slice();
        this.page = pagesCopy.splice(thisPageIndex, 1)[0];
        this.otherPages = pagesCopy;
        this.selectEvent = [];
    }

    select() {
        this.otherPages.forEach(page => {
            page.style.display = 'none';
        });
        this.page.style.display = 'block';
        this.selectEvent.forEach(event => {
            event();
        });
    }

    addSelectEvent(event) {
        this.selectEvent.push(event);
    }

    isSelected() {
        return this.page.style.display === 'block';
    }
}

export class ListPage extends PageManager {}

export class EntryPage extends PageManager {
    constructor(pages, thisPageIndex, fields) {
        super(pages, thisPageIndex);
        this.fields = fields;
        this.entry = null;
    }

    loadEntry(entry) {
        this.entry = entry;
        if (entry.image !== null) {
            this.fields.image.src = entry.image;
        }
        this.fields.title.innerText = entry.title;
        this.fields.author.innerText = entry.author;
        this.fields.type.innerText = entry.type;
        this.fields.timestamp.innerText = entry.timestamp;
    }

    addButton(btn, onClick, async = false) {
        if (async) {
            btn.addEventListener('click', async () => {
                if (this.entry !== null) {
                    await onClick(this.entry);
                }
            });
        } else {
            btn.addEventListener('click', () => {
                if (this.entry !== null) {
                    onClick(this.entry);
                }
            });
        }
    }
}

export class EditPage extends PageManager {
    constructor(pages, thisPageIndex, fields) {
        super(pages, thisPageIndex);
        this.fields = fields;
        this.entry = null;
        this.fields.imageUrl.addEventListener('input', () => {
            if (this.fields.imageUrl.value) {
                this.fields.image.src = this.fields.imageUrl.value;
            }
        });
    }

    loadEntry(entry) {
        this.entry = entry;
        if (entry.image !== null) {
            this.fields.image.src = entry.image;
        }
        this.fields.imageUrl.value = entry.image;
        this.fields.title.value = entry.title;
        this.fields.author.value = entry.author;
        this.fields.type.value = entry.type;
    }

    addButton(btn, onClick, async = false) {
        if (async) {
            btn.addEventListener('click', async () => {
                if (this.entry !== null) {
                    await onClick(this.getNewEntry());
                }
            });
        } else {
            btn.addEventListener('click', () => {
                if (this.entry !== null) {
                    onClick(this.getNewEntry());
                }
            });
        }
    }

    getNewEntry() {
        return {
            id: this.entry.id,
            title: this.fields.title.value,
            author: this.fields.author.value,
            type: this.fields.type.value,
            image: this.fields.imageUrl.value
        }
    }
}

export class NewPage extends PageManager {
    constructor(pages, thisPageIndex, fields) {
        super(pages, thisPageIndex);
        this.fields = fields;
        this.fields.imageUrl.addEventListener('input', () => {
            if (this.fields.imageUrl.value) {
                this.fields.image.src = this.fields.imageUrl.value;
            }
        });
    }

    addButton(btn, onClick, async = false) {
        if (async) {
            btn.addEventListener('click', async () => {
                await onClick(this.getNewEntry());
            });
        } else {
            btn.addEventListener('click', () => {
                onClick(this.getNewEntry());
            });
        }
    }

    getNewEntry() {
        return {
            title: this.fields.title.value,
            author: this.fields.author.value,
            type: this.fields.type.value,
            image: this.fields.imageUrl.value
        }
    }

    claer() {
        this.fields.title.value = '';
        this.fields.author.value = '';
        this.fields.type.value = '';
        this.fields.imageUrl.value = '';
    }
}
