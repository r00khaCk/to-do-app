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
        const checkBoxInput = document.createElement('input');
        checkBoxInput.setAttribute('type', 'checkbox');
        tasks_el.innerHTML = `
            <div class="todo-item">
                <div class="todo-text">
                    <p>${todoText}</p>
                </div>
                <button class="delete-todo"><i class="fa-solid fa-trash-can"></i></button 
            </div>
        `;

        todoList.appendChild(tasks_el); 
        
        //delete button action listener
        const deleteButton = tasks_el.querySelector('.delete-todo');
        deleteButton.addEventListener('click', () => {
            todoList.removeChild(tasks_el);
            deleteItem(todoText);
            console.log(todos);
        });

        //function to delete the corresponding todoText in the array that is corresponding to the to do that is deleted in the web app
        function deleteItem (input){
            const index = todos.indexOf(input);
            if (index > -1 ) {
                todos.splice(index,1);
            }
            return;

        }


    });

    

        



    

});
