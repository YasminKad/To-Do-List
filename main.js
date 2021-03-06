const data = {
    todoList: []
}
const priorityValues = {high: 2, medium: 1, low: 0}
let todoListCopy = data.todoList
let dependencies = []

Object.defineProperty(data, 'todoList', {
    get() {
        trackItem()
        return todoListCopy
    },
    set(value) {
        todoListCopy = value
        triggerItem()
    }
})

function trackItem() {
    if (currDependency) {
        dependencies.push(currDependency)
    }
}

function triggerItem() {
    dependencies.forEach(fn => fn())
}

let currDependency = null

function observe(fn) {
    currDependency = fn
    fn()
    currDependency = null
}

function dep() {
    return data.todoList
}

observe(dep);

function getArrayCopy() {
    data.todoList = [...todoListCopy]
}

function createRandomId(num) {
    let rand = ''
    for (let i = 0; i < num; i++) {
        rand += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))
    }
    return rand
}


function addTodo(cardName, cardColor, cardPriority) {
    const todo = {
        id: createRandomId(10),
        title: cardName,
        color: cardColor,
        priority: cardPriority,
        state: "undone",
        isPinned: false
    }
    data.todoList = [...todoListCopy, todo]
    observe(sort)

}

addTodo("yasmin", "green", "high")
addTodo("rosa", "yellow", "medium")
addTodo("goli", "red", "low")
addTodo("sahar", "red", "low")
addTodo("farid", "green", "high")
addTodo("task3", "yellow", "medium")
addTodo("ahmadReza", "red", "low")
addTodo("task2", "yellow", "medium")
addTodo("ehsan", "green", "high")
addTodo("task1", "yellow", "medium")

function removeTodo(id) {
    let temp
    for (let i = 0; i < data.todoList.length; i++) {
        if (data.todoList[i].id === id) {
            temp = data.todoList[i]
            todoListCopy.splice(i, 1)
            getArrayCopy()
            return {...temp}
        }
    }
}

removeTodo(data.todoList[1])

function changeState(id) {
    for (let todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            if (todoListElement.state === "done") {
                todoListElement.state = "undone"
                getArrayCopy()
                let temp
                temp = todoListElement
                removeTodo(id)
                data.todoList = [temp, ...todoListCopy]
                break
            }
            if (todoListElement.state === "undone") {
                todoListElement.state = "done"
                getArrayCopy()
                let temp
                temp = todoListElement
                removeTodo(id)
                data.todoList = [...todoListCopy, temp]
                break
            }
            break
        }
    }
}

function pin(id) {
    for (const todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            if (todoListElement.state === "undone") {
                if (todoListElement.isPinned === false) {
                    todoListElement.isPinned = true
                    removeTodo(id)
                    data.todoList = [todoListElement, ...todoListCopy]
                    break
                }
                if (todoListElement.isPinned === true) {
                    todoListElement.isPinned = false
                    removeTodo(id)
                    data.todoList = [...todoListCopy, todoListElement]
                    break
                }
            }
            if (todoListElement.state === "done") {
                if (todoListElement.isPinned === false) {
                    todoListElement.isPinned = true
                    removeTodo(id)
                    data.todoList = [todoListElement, ...todoListCopy]
                    break
                }
                if (todoListElement.isPinned === true) {
                    todoListElement.isPinned = false
                    removeTodo(id)
                    data.todoList = [...todoListCopy, todoListElement]
                    break
                }
            }
        }
    }
}

function sort() {
    const {pinned, notPinned, done} = data.todoList.reduce((prev, curr) => {
        if (curr.isPinned) {
            if (curr.state === "undone") {
                return {...prev, pinned: [...prev.pinned, curr]}
            }
            if (curr.state === "done") {
                return {...prev, pinned: [...prev.pinned], done: [...prev.done, curr]}
            }
        } else if (curr.state === "done") {
            return {...prev, done: [...prev.done, curr]}
        } else {
            return {...prev, notPinned: [...prev.notPinned, curr]}
        }
    }, {pinned: [], notPinned: [], done: []})
    const sortedList = notPinned.sort((first, second) => {
            if (priorityValues[first.priority] > priorityValues[second.priority]) {
                return -1
            }
            if (priorityValues[first.priority] < priorityValues[second.priority]) {
                return 1
            } else {
                return 0
            }
        }
    )
    done.sort((first, second) => {
        if (priorityValues[first.priority] > priorityValues[second.priority]) {
            return -1
        }
        if (priorityValues[first.priority] < priorityValues[second.priority]) {
            return 1
        } else {
            return 0
        }
    })
    todoListCopy = [...pinned, ...sortedList, ...done]
}

function renderDom() {
    const container = document.querySelector(".to-do-container")
    container.innerHTML = " "
    data.todoList.forEach(e => {
        const todoCard = document.createElement("div")
        todoCard.id = e.id

        const todoPriority = document.createElement("div")
        todoPriority.classList.add("priority-stars")
        if (e.priority === "high") {
            todoPriority.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'
        }
        if (e.priority === "medium") {
            todoPriority.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i>'
        }
        if (e.priority === "low") {
            todoPriority.innerHTML = '<i class="fas fa-star"></i>'
        }
        todoPriority.style.display = "inline-block"
        todoCard.appendChild(todoPriority)

        const todoTitle = document.createElement("div")
        todoTitle.innerText = `${e.title}`
        todoTitle.style.display = "inline-block"
        todoTitle.style.fontWeight = "bold";
        todoCard.appendChild(todoTitle)

        const pinButton = document.createElement("button")
        pinButton.innerHTML = '<i class="fas fa-thumbtack"></i>'
        pinButton.classList.add("pin-button")
        todoCard.appendChild(pinButton)
        pinButton.onclick = () => pin(e.id)

        if (e.state === "done") {
            pinButton.style.display = 'none'
        }

        if (e.state === "undone") {
            pinButton.style.display = 'inline-block'
        }

        const checkButton = document.createElement("button")
        checkButton.innerHTML = '<i class="fas fa-check"></i>'
        checkButton.classList.add("check-button")
        todoCard.appendChild(checkButton)
        checkButton.onclick = () => changeState(e.id)

        const deleteButton = document.createElement("button")
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'
        deleteButton.classList.add("delete-button")
        todoCard.appendChild(deleteButton)
        deleteButton.onclick = () => removeTodo(e.id)

        if (e.color === "yellow") {
            todoCard.style.backgroundColor = "orange";
            todoCard.classList.add("bg-is-yellow")
        }

        if (e.color === "red") {
            todoCard.style.backgroundColor = "#ED553B";
            todoCard.classList.add("bg-is-red")
        }

        if (e.color === "green") {
            todoCard.style.backgroundColor = "forestgreen";
            todoCard.classList.add("bg-is-green")
        }

        if (e.state === "done") {
            checkButton.innerHTML = '<i class="fas fa-times"></i>'
            checkButton.style.color = 'black'
        }

        if (e.state === "undone") {
            checkButton.innerHTML = '<i class="fas fa-check"></i>'
        }

        if (e.isPinned === true) {
            pinButton.style.color = "black"
        }

        if (e.isPinned === false) {
            pinButton.style.color = "white"
        }

        container.appendChild(todoCard)
        todoCard.classList.add("todo-card-style")
    })
}

const sortGreenButton = document.querySelector(".green-button")
sortGreenButton.addEventListener('click', showGreenCards)

function showGreenCards() {
    sortGreenButton.style.borderColor = 'forestgreen'
    sortRedButton.style.borderColor = 'white'
    sortYellowButton.style.borderColor = 'white'

    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'none'));
    document.querySelectorAll(".bg-is-green").forEach(e => (e.style.display = 'block'))
}

const sortRedButton = document.querySelector(".red-button")
sortRedButton.addEventListener('click', showRedCards)

function showRedCards() {
    sortRedButton.style.borderColor = '#ED553B'
    sortGreenButton.style.borderColor = 'white'
    sortYellowButton.style.borderColor = 'white'

    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'none'));
    document.querySelectorAll(".bg-is-red").forEach(e => (e.style.display = 'block'))
}

const sortYellowButton = document.querySelector(".yellow-button")
sortYellowButton.addEventListener('click', showYellowCards)

function showYellowCards() {
    sortYellowButton.style.borderColor = 'orange'
    sortRedButton.style.borderColor = 'white'
    sortGreenButton.style.borderColor = 'white'
    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'none'));
    document.querySelectorAll(".bg-is-yellow").forEach(e => (e.style.display = 'block'))
}

const cancelFilterButton = document.querySelector(".cancel-filter")
cancelFilterButton.addEventListener('click', cancelFilterByColor)

function cancelFilterByColor() {
    document.querySelectorAll(".todo-card-style").forEach(e => (e.style.display = 'block'));
    sortRedButton.style.borderColor = 'white'
    sortGreenButton.style.borderColor = 'white'
    sortYellowButton.style.borderColor = 'white'
}

const addButton = document.querySelector(".add-button");
addButton.addEventListener('click', checkValidationAndMakeACard);
const taskName = document.querySelector("input");
const selectors = document.querySelectorAll("select");

function checkValidationAndMakeACard() {
    let finalBoolean = true;
    if (taskName.value === "") {
        taskName.classList.remove("input-is-okay", "input-is-empty");
        taskName.classList.add("input-is-empty");
        finalBoolean = false
    } else {
        taskName.classList.remove("input-is-empty", "input-is-okay");
        taskName.classList.add("input-is-okay")
        finalBoolean = true
    }
    selectors.forEach(e => {
        if (e.value === "") {
            e.classList.remove("input-is-okay", "input-is-empty");
            e.classList.add("input-is-empty");
            finalBoolean = false
        } else {
            e.classList.remove("input-is-empty", "input-is-okay");
            e.classList.add("input-is-okay")
            finalBoolean = true
        }
    })
    if (finalBoolean) {
        makeTodoCard()
    }
}

function makeTodoCard() {
    if (data.todoList.length >= 0) {
        addTodo(taskName.value, selectors[1].value, selectors[0].value)
    }
    taskName.classList.remove("input-is-empty", "input-is-okay");
    selectors.forEach(e => {
        e.classList.remove("input-is-empty", "input-is-okay");
    })
    taskName.value = "";
    selectors.forEach(e => {
        e.value = ""
    })
}

observe(sort)
observe(renderDom)