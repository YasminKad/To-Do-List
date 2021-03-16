const data = {todoList: [{id: 0, title: "task", color: "colorName", priority: "cardPriority", state: "undone", isPinned: false}]}
let todoListCopy = data.todoList;
let dependencies = [];

Object.defineProperty(data, 'todoList', {
    get() {
        trackItem();
        return todoListCopy;
    },
    set(value) {
        todoListCopy = value;
        triggerItem();
    }
})

function trackItem() {
    if (currDependency) {
        dependencies.push(currDependency);
    }
}

function triggerItem() {
    dependencies.forEach(fn => fn());
}

let currDependency = null;

function observe(fn) {
    currDependency = fn;
    fn();
    currDependency = null;
}

function dep() {
    console.log(data.todoList)
}
observe(dep);

 function getArrayCopy(){
     data.todoList = [...todoListCopy]
 }

function addTodo(cardName, cardColor, cardPriority) {
    const todo = {id: Date.now(), title: cardName, color: cardColor, priority: cardPriority, state: "undone"};
    data.todoList = [...todoListCopy, todo]
}
//test
addTodo("wtf", "blue", "high");

function removeTodo(id) {
    data.todoList.forEach(e => {
        if (e.id === id) {
            todoListCopy.splice(id, 1);
            getArrayCopy()
        }
    })
}
//test
// removeTodo(0);

function changeState(id) {
    for (let todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            if (todoListElement.state === "done") {
                todoListElement.state = "undone"
                getArrayCopy()
            }
            if (todoListElement.state === "undone" ){
                todoListElement.state = "done";
                getArrayCopy();
                console.log(" state changed")
            }
            // break;
        }
    }
}
//test
changeState(Date.now());
changeState(0)

function pin(id){
    for (let todoListElement of data.todoList) {
        if (todoListElement.id === id) {
            let temp;
            temp = todoListElement;
            temp.isPinned = true;
            removeTodo(id);
            data.todoList = [temp, ...todoListCopy]
            console.log(data.todoList)
        }
    }
}

console.log("pin test")
pin(Date.now());