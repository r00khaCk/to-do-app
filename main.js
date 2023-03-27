const todos = [];
const todoInput = document.getElementById('todo-input').value;

window.addEventListener('load', function () {
    const form = document.querySelector('#todo-form');
    const todoInput = document.querySelector('#todo-input');
    const todoList = document.querySelector('#todo-list');

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const todoText = todoInput.value.trim();
        
        if(todoText){
            todos.push(todoText);
            todoInput.value='';
        }
        console.log(todos)

        const tasks_el = document.createElement("li");
        tasks_el.innerHTML = `
            <div class="todo-item">
                <div class="todo-text">
                    <p>${todoText}</p>
                </div>
            </div>
        `;

        

        todoList.appendChild(tasks_el);
    })

})
