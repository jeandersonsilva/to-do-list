//var para pegar o input do HTML
const inputElement = document.querySelector(".new-task-input");
//var para pegar o button do HTML
const addTaskButton = document.querySelector(".add-new-task");
// var para pegar a div das tarefas do html
const tasksAdded = document.querySelector(".tasks-added")

// evento para adicionar tarefas com o ENTER
document.addEventListener("keypress", function(send) {
    if (send.key === "Enter") {
        const addTaskButton = document.querySelector(".add-new-task");        
        addTaskButton.click();
    }
});

// validação do input de adição de tarefas
// validação e adição da classe error se o input não possuir valor inserido.
const validateInput = () => inputElement.value.trim().length > 0;
const handleAddTask = () => {
    const inputValid = validateInput();
    
    if (!inputValid) {
        return inputElement.classList.add("error");
    }   

    // funções de criação da seção das novas tarefas adicionadas.
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");
    const newTaskAdded = document.createElement("p");
    newTaskAdded.innerText = inputElement.value;    
    const deleteItem = document.createElement("i");
    deleteItem.classList.add("fa-solid");
    deleteItem.classList.add("fa-trash-can");

    // funções para inserir a seção de novas tarefas no html.
    tasksAdded.appendChild(taskItemContainer);
    taskItemContainer.appendChild(newTaskAdded);
    taskItemContainer.appendChild(deleteItem); 

    // campo input fica vazio após adição de nova tarefa a lista 
    inputElement.value = "";

    // funções para concluir e deletar tarefas.
    newTaskAdded.addEventListener("click", () => handleFinishedTask(newTaskAdded));
    deleteItem.addEventListener("click", () => handleDeleteItem(taskItemContainer, newTaskAdded));

    updateLocalStorage();
}

// remoção da class error quando o input possuir valor inserido.
const handleInputChange = () => {
    const inputValid = validateInput()
    if(inputValid) {
        return inputElement.classList.remove("error");
    }
}

// função para definir tarefa como concluída
const handleFinishedTask = (newTaskAdded) => {
    const tasks = tasksAdded.childNodes;
    for(const task of tasks) {
        const currentTaskCLicked = task.firstChild.isSameNode(newTaskAdded);
        if (currentTaskCLicked) {
            task.firstChild.classList.toggle("completed");
        }
    }
    updateLocalStorage();
};

const handleDeleteItem = (taskItemContainer, newTaskAdded) => {
    const tasks = tasksAdded.childNodes;
    for(const task of tasks) {
       const currentTaskCLicked = task.firstChild.isSameNode(newTaskAdded);
        if (currentTaskCLicked){
            taskItemContainer.remove();
        }
    }
    updateLocalStorage();
};

// função para guardar as tarefas no localStorage.
const updateLocalStorage = () => {
    const tasks = tasksAdded.childNodes;

    const localStorageTasks = [ ... tasks].map((task) => {
        const content = task.firstChild;
        const isCompleted = content.classList.contains("completed");

        return { description: content.innerText, isCompleted}
    });
    
    localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

// função para recarregar as tarefas salvas no localStorage
const refreshTasksUsingLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
    
    // loop de exibição das tarefas salvas no localStorage
    for(const task of tasksFromLocalStorage) {
        const taskItemContainer = document.createElement("div");
        taskItemContainer.classList.add("task-item");

        const newTaskAdded = document.createElement("p");
        newTaskAdded.innerText = task.description;
        
        if (task.isCompleted) {
            newTaskAdded.classList.add("completed");
        }

        const deleteItem = document.createElement("i");
        deleteItem.classList.add("fa-solid");
        deleteItem.classList.add("fa-trash-can");

        tasksAdded.appendChild(taskItemContainer);
        taskItemContainer.appendChild(newTaskAdded);
        taskItemContainer.appendChild(deleteItem); 

        newTaskAdded.addEventListener("click", () => handleFinishedTask(newTaskAdded));
        deleteItem.addEventListener("click", () => handleDeleteItem(taskItemContainer, newTaskAdded));
    }
} 

refreshTasksUsingLocalStorage();
// chamada das funções criadas para verificar o input
addTaskButton.addEventListener("click", () => handleAddTask());
inputElement.addEventListener("change", () => handleInputChange());

