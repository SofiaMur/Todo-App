class TodoData {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('items')) || [];
        this.completed = JSON.parse(localStorage.getItem('completed')) || [];
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer());
    }

    addItem(item) {
        this.items.push(item);
        localStorage.setItem('items', JSON.stringify(this.items));
        this.notifyObservers();
    }

    markComplete(index, item) {
        this.items.splice(index, 1);
        this.completed.push(item);
        localStorage.setItem('items', JSON.stringify(this.items));
        localStorage.setItem('completed', JSON.stringify(this.completed));
        this.notifyObservers();
    }

    deleteItem(index) {
        this.items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(this.items));
        this.notifyObservers();
    }

    getTodoCount() {
        return this.items.length;
    }

    getDoneCount() {
        return this.completed.length;
    }
}

class TodoUI {
    constructor(form, input, todo, done, countTodo, countDone, data) {
        this.form = form;
        this.input = input;
        this.todo = todo;
        this.done = done;
        this.countTodo = countTodo;
        this.countDone = countDone;
        this.data = data;
        this.data.addObserver(this.renderItems.bind(this));

        this.form.addEventListener('submit', this.addItem.bind(this));
        this.todo.addEventListener('click', this.action.bind(this));
        this.done.addEventListener('click', this.action.bind(this));

        this.renderItems();
    }
    
    createItem(item, container, index) {
        const li = document.createElement('li');
        li.dataset.index = index;
        if (container === this.done) {
            li.innerHTML = `<p>${item}</p>`
        } else {
            li.innerHTML = `
                <p>${item}</p>
                <div>
                    <button><img src="icons/check.svg" alt="Завершить" width="16" height="16" id="complete"></button>
                    <button><img src="icons/trashSimple.svg" alt="Удалить" width="16" height="16" id="delete"></button>
                </div>
            `;
        }
        container.appendChild(li);
    }

    renderItems() {
        this.todo.innerHTML = '';
        this.done.innerHTML = '';
        this.data.items.forEach((item, index) => this.createItem(item, this.todo, index));
        this.data.completed.forEach(item => this.createItem(item, this.done));
        this.updateCount();
    }

    updateCount() {
        this.countTodo.textContent = this.data.getTodoCount();
        this.countDone.textContent = this.data.getDoneCount();
    }

    addItem(e) {
        e.preventDefault();
        if (!this.input.value.trim()) return;
        this.data.addItem(this.input.value);
        this.input.value = '';
    }

    action(e) {
        if (!e.target.closest('button')) return;

        let li = e.target.closest('li');
        let itemText = li.querySelector('p').textContent;
        let index = parseInt(li.dataset.index);

        if (e.target.closest('#complete')) {
            this.data.markComplete(index, itemText);
        } else if (e.target.closest('#delete')) {
            this.data.deleteItem(index);
        }
    }
}

let todoData = new TodoData();
let todoUI = new TodoUI(document.querySelector('form'), document.querySelector('#item'), document.querySelector('#items'), document.querySelector('#completed'), document.querySelector('#countTodo'), document.querySelector('#countDone'), todoData);