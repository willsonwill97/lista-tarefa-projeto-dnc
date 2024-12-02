const renderTasksProgressData = (tasks) => {
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');

    if (tasksProgressDOM) tasksProgress = tasksProgressDOM

    else{
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementById('todo-footer') .appendChild(newTasksProgressDOM); 
        tasksProgress = newTasksProgressDOM;

    }
    const doneTasks = tasks.filter (({checked}) => checked ).length 
    const totalTasks = tasks.length;
    tasksProgress.textContent = `${doneTasks}/${totalTasks} concluidas`
}


const getTasksformLocalStorage = () => {
    const localtasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localtasks ? localtasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));

}

const removetask = (taskId) => {
    const tasks = getTasksformLocalStorage();
    const updatedTasks = tasks.filter(({ Id }) => parseInt(Id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)

    document
        .getElementById("todo-list")
        .removeChild(document.getElementById(taskId));
}

const removeDoneTasks = () => {
    const tasks = getTasksformLocalStorage()
    const tasksToRemove = tasks
    .filter (({checked}) => checked)
    .map (({id}) => id )

    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)

    tasksToRemove.forEach((taskToRemove) => {
        document
            .getElementById("todo-list")
            .removeChild(document.getElementById(taskToRemove))
    })
}

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const todo = document.createElement('li');

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'x';
    removeTaskButton.ariaLabel = 'remover tarefa';

    removeTaskButton.onclick = () => removetask(task.id);


    todo.id = task.id;
    todo.appendChild(checkbox);
    todo.appendChild(removeTaskButton);

    list.appendChild(todo);

    return todo;
}

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-');
    const tasks = getTasksformLocalStorage();

    
    const updatedTasks = tasks.map( (task) => {
        return parseInt (task.id) ===  parseInt(id)
           ? { ...task, checked: event.target.checked}
           : task
    })
    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)
}

const getcheckboxinput = ({id,description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement ('label');
    const wrapper = document.createElement('div');
    const checkboxid = `${id}-checkbox`;


    checkbox.type = 'checkbox';
    checkbox.id = checkboxid;
    checkbox.checked = checked || false;
    checkbox.addEventListener ('change', onCheckboxClick);

    label.textContent = description;
    label.htmlFor = checkboxid;

    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild (checkbox);
    wrapper.appendChild (label);

    return wrapper;
}

const getNewtaskId = () => {
    const tasks = getTasksformLocalStorage()
    const lastId = tasks [tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewtaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewtaskId();

    return{description,id }
}


const createtask = (event) => {
    event.preventDefault();
    const NewtaskData = getNewtaskData(event);

    const checkbox = getcheckboxinput (NewtaskData)
    createTaskListItem (NewtaskData,checkbox);

    const tasks = getTasksformLocalStorage();
    const updatedTasks = [
        ...tasks,
         {id:NewtaskData.id, description:NewtaskData.description, checked: false}
        ]
   setTasksInLocalStorage(updatedTasks)
   renderTasksProgressData(updatedTasks)

   document.getElementById('description').value = ''
}

window.onload = function(){

    const form = document.getElementById ('create-todo-form');
    form.addEventListener('submit', createtask)

    const tasks = getTasksformLocalStorage();
    tasks.forEach ((task) => {
        const checkbox = getcheckboxinput(task);
       createTaskListItem(task, checkbox)

    })

    renderTasksProgressData(tasks)
}