class Storage {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    retrieve(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
}

class ObserverManager {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.renderItems());
    }
}

class TodoData extends ObserverManager {
    constructor(storage) {
        super();
        this.storage = storage;
        this.items = this.storage.retrieve('items');
        this.completed = this.storage.retrieve('completed');
    }

    addItem(item) {
        this.items.push(item);
        this.storage.save('items', this.items);
        this.notifyObservers();
    }

    markComplete(index, item) {
        this.items.splice(index, 1);
        this.completed.push(item);
        this.storage.save('items', this.items);
        this.storage.save('completed', this.completed);
        this.notifyObservers();
    }

    deleteItem(index) {
        this.items.splice(index, 1);
        this.storage.save('items', this.items);
        this.notifyObservers();
    }

    getTodoCount() {
        return this.items.length;
    }

    getDoneCount() {
        return this.completed.length;
    }
}

class ItemCreator {
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
}

class EventManager {
    constructor(data) {
        this.data = data;
    }

    actionItem(e) {
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

    addItem(e, input) {
        e.preventDefault();
        if (!input.value.trim()) return;
        this.data.addItem(input.value);
        input.value = '';
    }
}

class TodoUI extends ItemCreator {
    constructor(form, input, todo, done, countTodo, countDone, data) {
        super();
        this.form = form;
        this.input = input;
        this.todo = todo;
        this.done = done;
        this.countTodo = countTodo;
        this.countDone = countDone;
        this.data = data;
        this.data.addObserver(this);
        this.eventManager = new EventManager(this.data);
        this.form.addEventListener('submit', (e) => this.eventManager.addItem(e, this.input));
        this.todo.addEventListener('click', this.eventManager.actionItem.bind(this.eventManager));
        this.done.addEventListener('click', this.eventManager.actionItem.bind(this.eventManager));
        this.renderItems();
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
}

document.addEventListener('DOMContentLoaded', () => {
    let storage = new Storage();
    let todoData = new TodoData(storage);
    let todoUI = new TodoUI(document.querySelector('form'), document.querySelector('#item'), document.querySelector('#items'), document.querySelector('#completed'), document.querySelector('#countTodo'), document.querySelector('#countDone'), todoData);
    todoData.addObserver(todoUI);
});
