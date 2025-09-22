document.addEventListener('DOMContentLoaded', () => {
    const taskTextarea = document.getElementById('task-text');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    // Obtenha os elementos das listas e das colunas
    const lists = {
        toDo: document.getElementById('list-to-do'),
        inProgress: document.getElementById('list-in-progress'),
        completed: document.getElementById('list-completed')
    };
    const columns = {
        toDo: document.getElementById('to-do'),
        inProgress: document.getElementById('in-progress'),
        completed: document.getElementById('completed')
    };

    const counters = {
        newTask: document.getElementById('counter-new-tasks'),
        toDo: document.getElementById('counter-to-do'),
        inProgress: document.getElementById('counter-in-progress'),
        completed: document.getElementById('counter-completed')
    };

    function updateCounter(listId) {
        let count = 0;
        switch(listId) {
            case 'list-to-do':
                count = lists.toDo.children.length;
                counters.toDo.textContent = count;
                break;
            case 'list-in-progress':
                count = lists.inProgress.children.length;
                counters.inProgress.textContent = count;
                break;
            case 'list-completed':
                count = lists.completed.children.length;
                counters.completed.textContent = count;
                break;
        }
        counters.newTask.textContent = 0;
    }

    // Adiciona uma nova tarefa e a torna arrastável
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskTextarea.value.trim();
        if (taskText) {
            const taskDiv = document.createElement('div');
            const taskId = 'task-' + Date.now();
            
            taskDiv.id = taskId;
            taskDiv.className = 'task to-do';
            taskDiv.textContent = taskText;
            taskDiv.setAttribute('draggable', 'true');
            
            // Adiciona o listener para o início do arrasto
            taskDiv.addEventListener('dragstart', event => {
                event.dataTransfer.setData("text/plain", event.target.id);
            });

            lists.toDo.appendChild(taskDiv);
            taskTextarea.value = '';
            updateCounter('list-to-do');
        }
    });

    // Adiciona os event listeners de drag para cada coluna
    Object.values(columns).forEach(column => {
        // Previne o comportamento padrão para permitir o drop
        column.addEventListener('dragover', event => {
            event.preventDefault();
        });

        // Lida com o drop do item
        column.addEventListener('drop', event => {
            event.preventDefault();
            const data = event.dataTransfer.getData("text/plain");
            const draggedElement = document.getElementById(data);
            
            // Se o elemento arrastado existir
            if (draggedElement) {
                const oldListId = draggedElement.parentElement.id;
                
                // Encontra a lista de destino
                const targetList = event.target.closest('.task-list');
                if (targetList) {
                    targetList.appendChild(draggedElement);
                } else {
                    // Se o drop ocorrer na coluna e não na lista, adicione-o na lista da coluna
                    const targetColumnList = event.target.querySelector('.task-list');
                    if (targetColumnList) {
                        targetColumnList.appendChild(draggedElement);
                    }
                }
                
                // Atualiza a cor e os contadores
                draggedElement.classList.remove('to-do', 'in-progress', 'completed');
                
                if (event.currentTarget.id === 'to-do') {
                    draggedElement.classList.add('to-do');
                } else if (event.currentTarget.id === 'in-progress') {
                    draggedElement.classList.add('in-progress');
                } else if (event.currentTarget.id === 'completed') {
                    draggedElement.classList.add('completed');
                }
                
                updateCounter(oldListId);
                updateCounter(event.currentTarget.querySelector('.task-list').id);
            }
        });
    });

    // Inicializa todos os contadores
    updateCounter('list-to-do');
    updateCounter('list-in-progress');
    updateCounter('list-completed');
});