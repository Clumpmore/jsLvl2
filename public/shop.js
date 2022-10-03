class AbstractList {
    items = []

    constructor(items = []) {
        this.items = []
    }


    render() {
        this.items.forEach(good => {
            good.render()
        })
    }
}
class List extends AbstractList {

    _cartInstance = null
    _pageCounter = 1
    constructor(CartInstance) {
        super()
        this._cartInstance = CartInstance
        this.initBtnShowMore()
        let goodsPromise = this.fetchGoods()
        goodsPromise.then(() => {
            this.render()
        })

    }
    initBtnShowMore() {
        const btn = document.querySelector('.showmore')
        btn.addEventListener('click', () => {
            this.fetchGoods()
                .then(() => {
                    this.render()
                })
        })
    }
    hideBtnShowMore() {
        const btn = document.querySelector('.showmore')
        btn.remove()
    }

    fetchGoods() {
        const result = fetch(`/page${this._pageCounter}.json`)
        return result
            .then(res => {
                return res.json()
            })
            .then(data => {
                this._pageCounter++
                this.items.push(...data.data.map(cur => {
                    return new GoodItem(cur, this._cartInstance)

                }))
            })
            .catch(e => {
                this.hideBtnShowMore()
                console.log(e)
            })

    }
    render() {
        const placeToRender = document.querySelector('.goods-list')
        if (placeToRender) {
            placeToRender.innerHTML = ''
            this.items.forEach(good => {
                good.render(placeToRender)
            })
        }


    }
}

class Cart extends AbstractList {

    constructor() {
        super()
        this.init()

    }
    add(item) {
        const foundItem = this.items.find((fitem) => {
            return fitem.name === item.name
        })
        console.log(foundItem)
        const addedPromise = new Promise(resolve => {
            if (foundItem) {
                foundItem.counter++
            } else {
                this.items.push(item)
            }
            resolve()
        })
        addedPromise.then(this.render.bind(this))


    }
    remove(item) {
        console.log(item)
        const foundItem = this.items.find((fitem) => {
            return fitem.name === item.name
        })
        const removedPromise = new Promise(resolve => {
            if (foundItem.counter > 1) {
                foundItem.counter--
            } else {
                const index = this.items.indexOf(foundItem)
                console.log(index)
                this.items.splice(index, 1)
            }
            resolve()
        })
        removedPromise.then(this.render.bind(this))

    }

    init() {
        const block = document.createElement('div')
        block.classList.add('cart')
        const list = document.createElement('div')
        list.classList.add('cart_list')
        block.appendChild(list)
        const ButtonInstance = new Button('Корзина', () => {
            list.classList.toggle('shown')
        })
        block.appendChild(ButtonInstance.getTemplate())
        const placeToRender = document.querySelector('header')
        if (placeToRender) {
            placeToRender.appendChild(block)
        }
        this.render()

    }
    render() {
        const placeToRender = document.querySelector('.cart_list')
        if (placeToRender) {
            placeToRender.innerHTML = ''
            if (this.items.length) {
                this.items.forEach(good => {
                    good.render(placeToRender, this)
                })
            } else {
                placeToRender.innerHTML = 'Нет товаров в корзине!'
            }
        }

    }
}
class GoodItem {
    name = ''
    price = 0
    counter = 1
    _cartInstance = null
    constructor({ name, price }, CartInstance) {
        this.name = name
        this.price = price
        this._cartInstance = CartInstance
        // console.log(this._cartInstance)
    }

    render(placeToRender) {

        if (placeToRender) {
            const block = document.createElement('div')
            block.classList.add('goods-item')
            block.innerHTML = ` <div class="img">
        <img src="https://png.pngtree.com/png-vector/20190324/ourmid/pngtree-vector-stationery-icon-png-image_862472.jpg"/>
      </div>
      <div class="meta">
        <div class="meta__row">
          <span class="key">Товар:</span>
          <span class="value">${this.name}</span>
        </div>
        <div class="meta__row">
          <span class="key">Цена:</span>
          <span class="value">${this.price}</span>
        </div>
        <div class="btn_holder"></div>
      </div>
    `
            placeToRender.appendChild(block)

            const AddButton = new Button('Добавить в корзину', () => {
                this._cartInstance.add(new GoodItemInCart(this))
                console.log(this)
            })
            block.querySelector('.btn_holder').appendChild(AddButton.getTemplate())

        }
    }
}
class GoodItemInCart extends GoodItem {
    _cartInstance = null
    constructor(props) {
        super(props)
        this._cartInstance = CartInstance
    }

    render() {
        const placeToRender = document.querySelector('.cart_list')
        if (placeToRender) {
            const block = document.createElement('div')
            block.classList.add('cart__good')
            block.innerHTML = `Товар: ${this.name}<br/>Количество ${this.counter} | Цена за шт. = ${this.price}<br/>Общая сумма = ${this.price * this.counter}`
            const btnAdd = document.createElement('div')
            btnAdd.classList.add('btn', 'rmv')
            btnAdd.addEventListener('click', () => {
                this._cartInstance.remove(this)
            })
            block.appendChild(btnAdd)

            placeToRender.appendChild(block)

        }
    }
}
class Button {
    _text = ''
    _onClickClb = null

    constructor(text, clb) {
        this._text = text
        this._onClickClb = clb
    }

    get text() {
        return this._text
    }

    set text(value) {
        this._text = value
    }

    onBtnClick() {
        console.log('Clicked!')
        if (typeof this._onClickClb === 'function') {
            this._onClickClb()
        }
    }

    getMainTemplate() {
        const btn = document.createElement('div')
        btn.classList.add('btn')

        return btn
    }

    getTemplate() {
        const btn = this.getMainTemplate()
        btn.innerHTML = this.text

        btn.addEventListener('click', () => {
            this.onBtnClick()
        })

        return btn
    }
}

class Form {

    constructor() {
        this.render()
    }
    render() {
        const placeToRender = document.querySelector('footer')
        if (placeToRender) {
            placeToRender.classList.add('footer')
        }
        placeToRender.classList.add('footer')
        const block = document.createElement('form')
        block.classList.add('form')
        block.innerHTML = `<div class="name" >
        <label for="name-input" class="text">Введите имя:</label>
        <input name='name-input' class='name-input' placeholder = 'Только латиница или кириллица' type="text">
    </div>
    <div class="number">
        <label for='number-input' class="text">Введите номер для связи:</label>
        <input name='number-input' class='number-input' placeholder = '+7(000)000-00-00' type="text">
    </div>
    <div class="email">
        <label for='email-input' class="text">Введите Email для связи:</label>
        <input mame='email-input' class='email-input' placeholder = 'mymail@mail.ru' type="text">
    </div>
    <div class="comment">
        <label class='text' for="comment-area">Оставьте комментарий:</label>
        <textarea name="comment-area" class='comment-area' rows="4"></textarea>
    </div>
    
    <input class="submit" type='submit' value='Отправить'></input>
    <input class='reset' type="reset" value="Сбросить">
        `
        placeToRender.appendChild(block)
        const name = document.querySelector('.name-input')
        name.addEventListener('keyup', () => {

            this.test(name, /^[a-zа-яё\s]+$/ui)
        })
        const number = document.querySelector('.number-input')
        number.addEventListener('keyup', () => {

            this.test(number, /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/)
        })
        const email = document.querySelector('.email-input')
        email.addEventListener('keyup', () => {

            this.test(email, /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-])+\.([A-Za-z]{2,4})$/)
        })
        // test() {
        //     const regName = /^[a-zа-яё\s]+$/iu
        //     const name = document.querySelector('.name-input')
        //     const valName = name.value
        //     const testName = regName.test(valName)
        //     if (!testName) {
        //         name.style = "border:1px solid red"
        //         console.log('net')
        //     } else {
        //         name.style = "border:1px solid green"
        //         console.log('ds')
        //     }

        // }
    }
    test(input, reg) {
        console.log(reg)
        const regName = reg
        const valName = input.value
        const testName = regName.test(valName)
        console.log(input.value)

        console.log(testName)
        if (valName == '') {
            console.log(typeof input.value)
            input.removeAttribute('class')
            input.classList.add('name-input')
        } else {
            while (true) {
                console.log(typeof valName)
                if (!testName) {
                    if (input.classList.length == 1) {
                        input.classList.add('false')
                        break
                    }
                    else if (input.classList.length >= 1) {
                        if (input.classList.contains('right')) {
                            input.classList.remove('right')
                            input.classList.add('false')
                            break
                        } else if (input.classList.contains('false')) {
                            break
                        }
                    }
                }
                else if (testName) {
                    if (input.classList.length == 1) {
                        input.classList.add('right')
                        break
                    }
                    else if (input.classList.length >= 1) {
                        if (input.classList.contains('false')) {
                            input.classList.remove('false')
                            input.classList.add('right')
                            break
                        } else if (input.classList.contains('right')) {
                            break
                        }
                    }
                }
            }
        }

    }
}
// class ItemForm {
//     inner = ''
//     text = ''
//     constructor(inner, text) {
//         this.inner = inner
//         this.text = text
//         render(inner)
//     }
//     render(inner, text) {
//         const placeToRender = document.querySelector('.form')
//         placeToRender.innerHTML = `<div class="${inner}">
//     <label for="${inner}-input" class="text">${text}:</label>
//     <input name='${inner}-input' class='${inner}-input' type="text"></div>}`

// }
// }


const CartInstance = new Cart()
const ListInstance = new List(CartInstance)
const FormInstance = new Form()
