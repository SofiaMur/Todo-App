const form = document.querySelector('form');
const input = document.querySelector('#item');
const todo = document.querySelector('#items');
const done = document.querySelector('#completed');
const countTodo = document.querySelector('#countTodo');
const countDone = document.querySelector('#countDone');

const items = JSON.parse(localStorage.getItem('items')) || [];
const completed = JSON.parse(localStorage.getItem('completed')) || [];

function renderItems() {
    todo.innerHTML = '';
    done.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>${item}</p>
            <div>
                <button><img src="./icons/check.svg" alt="Завершить" width="16" height="16" id="complete"></button>
                <button><img src="./icons/trashSimple.svg" alt="Удалить" width="16" height="16" id="delete"></button>
            </div>
        `;
        todo.appendChild(li);
        updateCount();
    });
    completed.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>${item}</p>
        `;
        done.appendChild(li);
        updateCount();
    });
}

function updateCount() {
    const countTodoVal = todo.getElementsByTagName('li').length;
    const countDoneVal = done.getElementsByTagName('li').length;
    countTodo.textContent = countTodoVal;
    countDone.textContent = countDoneVal;
}

renderItems();

form.addEventListener('submit', e => {
    e.preventDefault();
    if (!input.value) return;
    items.push(input.value);
    localStorage.setItem('items', JSON.stringify(items));
    const li = document.createElement('li');
    li.innerHTML = `
        <p>${input.value}</p>
        <div>
            <button><img src="./icons/check.svg" alt="Завершить" width="16" height="16" id="complete"></button>
            <button><img src="./icons/trashSimple.svg" alt="Удалить" width="16" height="16" id="delete"></button>
        </div>
    `;
    todo.appendChild(li);
    input.value = '';
    updateCount();
});

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'delete') {
        let li = e.target.closest('li');
        todo.removeChild(li);
        let itemText = li.querySelector('p').textContent;
        let index = items.indexOf(itemText);
        if (index !== -1) {
            items.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(items));
        }
        renderItems();
    }
});

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'complete') {
        let li = e.target.closest('li');
        todo.removeChild(li);
        let p = li.querySelector('p');
        let newLi = document.createElement('li');
        newLi.innerHTML = `<p>${p.innerText}</p>`;
        done.appendChild(newLi);
        let index = items.indexOf(p.innerText);
        if (index !== -1) {
            items.splice(index, 1);
            completed.push(p.innerText);
        }
        localStorage.setItem('items', JSON.stringify(items));
        localStorage.setItem('completed', JSON.stringify(completed));
        renderItems();
        updateCount();
    }
});