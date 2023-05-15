export class NavManager {
    constructor(activeClassName) {
        this.activeClassName = activeClassName;
        this.activeElement = null;
        this.navElements = [];
    }

    addNavElement(element, event) {
        this.navElements.push(element);
        const id = this.navElements.length - 1;
        element.addEventListener('click', () => {
            this.setActive(id);
            event();
        });
    }

    unsetActive() {
        if (this.activeElement !== null) {
            this.navElements[this.activeElement].classList.remove(this.activeClassName);
            this.activeElement = null;
        }
    }

    setActive(id) {
        this.unsetActive();
        this.activeElement = id;
        this.navElements[this.activeElement].classList.add(this.activeClassName);
    }
}
