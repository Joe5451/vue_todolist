const STORAGE_KEY = "vue-todolist";
const todoStorage = {
    getTodos() {
        let todos = JSON.parse(localStorage.getItem(STORAGE_KEY))||[];
        todos.forEach((todo, index) => {
            todo.id = index;
        });

        todoStorage.id_length = todos.length;

        return todos;
    },
    saveTodos(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
}

const app = new Vue({
    data() {
        return {
            todos: todoStorage.getTodos(),
            id_length: todoStorage.id_length,
            edit_mode: '',
            edit_todo: {
                title: '',
                content: '',
                completed: false,
                id: ''
            },
            todo: {},
            visibility: 'all'
        }
    },
    computed: {
        filterTodos() {
            if (this.visibility == 'all') return this.todos;
            else if (this.visibility == 'tobedone') {
                return this.todos.filter(todo => {
                    return !todo.completed;
                });
            } else if (this.visibility == 'completed') {
                return this.todos.filter(todo => {
                    return todo.completed;
                });
            }
        }
    },
    watch: {
        todos: {
            handler: function(todos) {
                todoStorage.saveTodos(todos);
            },
            deep: true
        }
    },
    methods: {
        addTodo() {
            const todoapp_body = document.querySelector('.todoapp-body');
            this.edit_todo.id = this.id_length;
            this.todos.push(Object.assign({}, this.edit_todo));
            this.id_length++;
            this.resetEditTodo();

            todoapp_body.scrollTop = 0;
        },
        editTodo(todo) {
            this.edit_mode = 'save';
            this.todo = todo; // 用於 updateTodo() 時，使用 indexOf() 找到要更新的索引
            this.edit_todo = { ...todo };
        },
        updateTodo() {
            const index = this.todos.indexOf(this.todo);
            this.todos.splice(index, 1, { ...this.edit_todo });
            this.resetEditTodo();
        },
        deleteTodo(todo) {
            const index = this.todos.indexOf(todo);
            this.todos.splice(index, 1);
        },
        resetEditTodo() {
            this.edit_mode = '';
            this.edit_todo = {
                title: '',
                content: '',
                completed: false,
                id: ''
            }
        }
    }
});

app.$mount('#app');