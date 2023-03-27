const getList = () => {
    const list = localStorage.getItem('todo-list');
    if (list) {
        return JSON.parse(list);
    }
    return [];
}

//this setList() function is used to set the todos in the array in the local storage
const setList = (list) => {
    localStorage.setItem('todo-list', JSON.stringify(list));
}

// initializing the HTML elements 
const todos = [];
let selected_todo = null;
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const editTodo = document.getElementById('edit-todo');
const searchForm = document.getElementById('search-form');
const search = document.getElementById('search-input');
const searchResultList = document.getElementById('list-of-results')
const resultCount = document.getElementById('result-counter')



// window.addEventListener('load', function () {
//     todos = getList();
//     printList();
//     setTimeout(() => {
//         console.log(selected_date, 'selected_date');
//         dateInput.value = selected_date;    
//     }, 0);
    
//     // if(!isLoggedin()) {
//     //     // setTimeout(() => {
//     //     //     showLoginNotification();
//     //     // }, 1000);
//     // }
// });



//creating a event listener for the search function
search.addEventListener('focus', function () {
    search.select();
});

search.addEventListener('click', function () {
    search.select();
});


let selected_date = new Date().toISOString().substring(0, 10);


//event listener for the adding of To Dos in the todoForm
todoForm.addEventListener('submit', function(event){
    event.preventDefault();

    const todoText = todoInput.value;

    //creating a todo_item object with the key-value pairs of:
    /**
     * id
     * text
     * todo_completed
     * todo_deleted
     * todo_due_date
     * description
     */
    const todo_item = {
        id : Math.random(),
        text : todoText,
        todo_completed : false,
        todo_deleted : false,
        todo_due_date : null,
        description : '',
    }
    //if there is a todoText, the todo_item object will be pushed into the todos array
    if(todoText){
        todos.push(todo_item);
        showTodos();
        todoInput.value='';
    }
    console.log(todos);

});

//this function is used to display the todos which are in the array
function showTodos(){
    todoList.innerHTML='';
    //this if statement will check if there are any data in the array
    if(!todos.length){
      // displays that there are no data  
      todoList.innerHTML=`
        <li class="no-data">
            <i>There are no To Do found!</i>
        </li>
        `;
        return;  
    }

    //the todo represents each element in the todos array
    //forEach() is used to execute a function for each element (todo) in the array
    todos.forEach((todo) => {
        const todoItem = createTodoItem(todo);
        //the created todoItem will be appended in the todoList
        todoList.appendChild(todoItem);
    });
}

//this function will create the todo item which is related to the todo_item object
// will create a new li element and insert in the document
function createTodoItem(todo){
    const todoItem = document.createElement('li');
    todoItem.innerHTML = `
        <div class="todo-item">
            <input type="checkbox" class="input-checkbox" id="todo-check" ${todo.todo_completed?'checked':''}>
            <div class="todo-text">
                <p>${todo.text}</p>
                <div id="todo-due-date"></div>
                ${todo.description && `<div class="todo-description">${todo.description}</div>`}
            </div>  
            ${todo.description && '<button class="expand-todo"><i class="fa-solid fa-chevron-down"></i></button>'}
            <button class="delete-todo"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `;
    // if the todo has a description added to it, the todoItem will be able to be clicked and expand to view the description
    if(todo.description) {
        const expansion = todoItem.querySelector('.expand-todo');
        const description = todoItem.querySelector('.todo-description');
        expansion.addEventListener('click', function (event) {
            console.log('clicked')
            if (description.classList.contains('show')) {
                description.classList.remove('show');
                expansion.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
            } else {
                description.classList.add('show');
                expansion.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
            }

        });
    }
    
    //creates the behaviour of the checkbox by adding an event listener
    const checkbox = todoItem.querySelector('.input-checkbox');
    todoItem.addEventListener('click', function () {
        selected_todo = todo;
        onSelect(todo);
    });

    checkbox.addEventListener('change', function (event) {
        event.stopPropagation();
        todo.is_complete = !todo.is_complete;
        setList(todos);
    });


    //creates the behaviour of the deleteButton by adding an event listener
    const deleteButton = todoItem.querySelector('.delete-todo');
    deleteButton.addEventListener('click', function (event) {
        event.stopPropagation();
        todoList.removeChild(todoItem);
        todos = todos.filter((item) => item.id !== todo.id);
        setList(todos);
    });

    //creates the behaviour of the dueDate by adding an event listener
    const dueDate = todoItem.querySelector('#todo-due-date');
    if (todo.todo_due_date) {
        const date = new Date(todo.todo_due_date);
        const date_str = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dueDate.innerHTML = `
            <span class="due-date">
                <i class="fa-solid fa-calendar-days mr-2"></i>
                <span>${date_str}</span>
            </span>
        `;
    }

    return todoItem;
}

searchForm.addEventListener('submit', function onSearch(event) {
    event.preventDefault();
    const result = todos.filter((todo) => todo.text.includes(search.value));
    search.select();
    if (!result.length) {
        searchResultList.innerHTML = `
            <li class="no-data">
                <i>No results found!</i>
            </li>
        `;
        return
    }
    searchResultList.innerHTML = '';
    resultCount.innerHTML = `Showing: ${result.length} result${result.length > 1 ? 's' : ''}`;
    result.forEach((todo) => {
        const item = document.createElement('li');
        const date = new Date(todo.id);
        const date_str = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        item.innerHTML = `
            <div class="d-flex justify-content-between">
                ${todo.text}
                <span class="search-date-time">${date_str}</span>
            </div>
        `;
        searchResultList.appendChild(item);
    })
});

//function to display the right side interface when a to do is selected
const onSelect = (todo) => {
    editTodo.innerHTML = '';
    const el = document.createElement('div');
    let due_date = null;
    if (todo.due_date) {
        due_date = new Date(todo.due_date).toISOString().substring(0, 10);
    }
    el.innerHTML = `
        <label>Title</label>
        <input type="text" id="input-update-todo" class="input-field w-100" value="${todo.text}">
        <label class="mt-4">Description</label>
        <textarea rows="10" id="update-description" class="input-textarea w-100" value="${todo.description}">${todo.description}</textarea>
        <p class="date-description">Date created: ${new Date(todo.id).toLocaleString()}</p>
        <label class="mt-4">Due Date</label>
        <input type="date" id="update-due-date" class="input-field w-100" value="${due_date}">
        <div class="py-4 d-flex justify-end">
            <button id="btn-delete-todo" class="btn btn-secondary mr-2">Delete</button>
            <button id="btn-update-todo" class="btn btn-primary">Update</button>
        </div>
    `;
    
    // adding event listeners to delete button
    const deleteTodo = el.querySelector('#btn-delete-todo');
    deleteTodo.addEventListener('click', function () {
        todos = todos.filter((item) => item.id !== todo.id);
        setList(todos);
        showTodos();
        editTodo.innerHTML = '';
    });

    // adding event listeners to update button
    const updateTodo = el.querySelector('#btn-update-todo');
    const text = el.querySelector('#input-update-todo');
    const description = el.querySelector('#update-description');
    const dueDate = el.querySelector('#update-due-date');
    
    //once changes are made, update button will update the current to do
    updateTodo.addEventListener('click', function () {
        todo.text = text.value;
        todo.description = description.value;
        todo.todo_due_date = dueDate.value;
        todos.findIndex((item) => {
            if (item.id === todo.id) {
                setList(todos);
                showTodos();
            }
        });
        editTodo.innerHTML = '';
    })
    editTodo.appendChild(el);
}



// this function is to create a push function that will return a specialized value
// function push(array, input) {
//     array.push(input);
//     return "input added";
// }



