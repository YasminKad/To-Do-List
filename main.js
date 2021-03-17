const data = {
    todoList: [{
        id: 0,
        title: "task",
        color: "colorName",
        priority: "low",
        state: "done",
        isPinned: false
    }]
}
const priorityValues = {high: 2, medium: 1, low: 1}
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
    // console.log(data.todoList)
    return data.todoList
}

observe(dep);

function getArrayCopy() {
    data.todoList = [...todoListCopy]
}

function addTodo(cardName, cardColor, cardPriority) {
    const todo = {id: Date.now(), title: cardName, color: cardColor, priority: cardPriority, state: "undone"}
    data.todoList = [...todoListCopy, todo]
}

console.log("add to do test;")
addTodo("yasmin", "white", "high")
addTodo("ahmadReza", "black", "medium")
addTodo("ehsan", "yellow", "medium")
console.log(data.todoList)

function removeTodo(id) {
    for (let i = 0; i < data.todoList.length; i++) {
        if (data.todoList[i].id === id) {
            todoListCopy.splice(i, 1)
            getArrayCopy()
            break
        }
    }
}

console.log("remove test")
removeTodo(data.todoList[1])

function changeState(id) {
    for (let todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            if (todoListElement.state === "done") {
                todoListElement.state = "undone"
                getArrayCopy()
            }
            if (todoListElement.state === "undone") {
                todoListElement.state = "done"
                getArrayCopy()
                console.log("state changed")
                let temp
                temp = todoListElement
                removeTodo(id)
                data.todoList = [...todoListCopy, temp]
            }
            break;
        }
    }
}

console.log("change state test")
changeState(data.todoList[2].id)

function pin(id) {
    for (let todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            let temp
            temp = todoListElement
            temp.isPinned = true
            removeTodo(id)
            data.todoList = [temp, ...todoListCopy]
            console.log(data.todoList)
            console.log("pinned successfully")
            break
        }
    }
}

console.log("pin test")
pin(data.todoList[1].id)

function sort() {
    const {pinned, notPinned, done} = data.todoList.reduce((prev, curr) => {
        if (curr.isPinned) {
            return {...prev, pinned: [...prev.pinned, curr]}
        } else if(curr.state === "done"){
            return {...prev, done: [...prev.done, curr]}
        }
        else {
            return {...prev, notPinned: [...prev.notPinned, curr]}
        }
    }, {pinned: [], notPinned: [], done: []})
    const sortedList = notPinned.sort((first, second) => {
            if (priorityValues[first.priority] > priorityValues[second.priority]) {
                console.log("return 1");
                return -1
            }
            if (priorityValues[first.priority] < priorityValues[second.priority]) {
                console.log("return -1");
                return 1
            } else {
                console.log("return 0");
                return 0
            }
        }
    )
        data.todoList = [...pinned, ...sortedList, ...done]
    console.log(data.todoList)
}

sort();

function costumeFilter() {

}

costumeFilter()
