class Button {
    _text = ''


    constructor(text) {
        this._text = text
    }
    get text() {
        return this._text
    }
    set text(value) {
        this._text = value
    }
    getMainTemplate() {
        const btn = document.createElement('div')
        btn.classList.add('btn')
        return btn
    }
    getTemplate() {
        const btn = this.getMainTemplate()
        btn.innerHTML = this.text
        return btn
    }
}