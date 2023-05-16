import { $, $$ } from "./utils.js";
import { APIManager } from "./api.js";
import { NavManager } from "./navigation.js";
import { ListPage, EntryPage, EditPage, NewPage } from "./page.js";
import { ContentManager, EntryManager } from "./content.js";

const BATCH_SIZE = 10;

document.addEventListener('DOMContentLoaded', async () => {
    // API
    const api = new APIManager();

    // Page managment
    const pagesElements = [
        $('#list-page'),
        $('#entry-page'),
        $('#edit-page'),
        $('#new-page')
    ];
    const entryPageElements = {
        image: $('#entry-page-img'),
        title: $('#entry-page-title'),
        author: $('#entry-page-author'),
        type: $('#entry-page-type'),
        timestamp: $('#entry-page-timestamp')
    };
    const editPageElements = {
        image: $('#edit-page-img'),
        imageUrl: $('#edit-page-img-url'),
        title: $('#edit-page-title'),
        author: $('#edit-page-author'),
        type: $('#edit-page-type')
    };
    const newPageElements = {
        image: $('#new-page-img'),
        imageUrl: $('#new-page-img-url'),
        title: $('#new-page-title'),
        author: $('#new-page-author'),
        type: $('#new-page-type')
    };
    const listPage = new ListPage(pagesElements, 0);
    const entryPage = new EntryPage(pagesElements, 1, entryPageElements);
    const editPage = new EditPage(pagesElements, 2, editPageElements);
    const newPage = new NewPage(pagesElements, 3, newPageElements);
    entryPage.addButton($('#entry-page-edit-btn'), entry => {
        editPage.loadEntry(entry);
        editPage.select()
    });
    entryPage.addButton($('#entry-page-delete-btn'), async entry => {
        if (await api.deleteEntry(entry.id)) {
            contentManager.clearEntries();
            listPage.select();
        }
    }, true);
    editPage.addButton($('#edit-page-save-btn'), async entry => {
        const response = await api.editEntry(entry);
        if (response !== false) {
            entryPage.loadEntry(response.body);
            entryPage.select();
            contentManager.clearEntries();
        }
    }, true);
    editPage.addButton($('#edit-page-cancel-btn'), entry => {
        entryPage.select();
    });
    newPage.addButton($('#new-page-save-btn'), async entry => {
        const response = await api.addEntry(entry);
        if (response !== false) {
            entryPage.loadEntry(response.body);
            entryPage.select();
            contentManager.clearEntries();
        }
    }, true);
    newPage.addButton($('#new-page-cancel-btn'), entry => {
        listPage.select();
        newPage.clear();
    });

    // Navigation managment
    const navManager = new NavManager('active');
    navManager.addNavElement($('#list-nav-element'), () => {
        listPage.select();
    });
    navManager.addNavElement($('#add-nav-element'), () => {
        newPage.select();
    });

    listPage.addSelectEvent(() => {
        navManager.setActive(0);
    });
    entryPage.addSelectEvent(() => {
        navManager.unsetActive();
    });
    editPage.addSelectEvent(() => {
        navManager.unsetActive();
    });
    newPage.addSelectEvent(() => {
        navManager.setActive(1);
        newPage.claer();
    });

    // Content managment
    const entryOnClick = entry => {
        navManager.unsetActive();
        entryPage.loadEntry(entry);
        entryPage.select();
    };
    const contentManager = new ContentManager($('#list-page-content'), EntryManager, BATCH_SIZE, entryOnClick);
    const scrollEvent = async () => {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight && listPage.isSelected()) {
            await contentManager.loadEntries();
        }
    };
    window.addEventListener('scroll', scrollEvent);
    listPage.addSelectEvent(scrollEvent);

    // Search managment
    // const searchManager = new SearchManager($('#search-form'), $('#search'), $('#search-list'), BATCH_SIZE);

    // Finish
    listPage.select();
});
