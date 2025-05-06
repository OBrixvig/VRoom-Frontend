# Vue.js Cheatsheet
----------------------------------------------------------------------------------------------------------
## Template Syntax
- **Interpolation**: `{{ message }}`
- **Directives**:
  - `v-bind`: Bind attributes (e.g., `<img v-bind:src="imageUrl">`)
  - `v-if / v-else`: Conditional rendering
  - `v-for`: Loop through arrays or objects
  - `v-model`: Two-way data binding (e.g., `<input v-model="message">`)
----------------------------------------------------------------------------------------------------------
## Event Handling
- Example: `<button @click="greet">Click Me</button>`
----------------------------------------------------------------------------------------------------------
## Lifecycle Hooks
- `created()`: Called after the instance is created.
- `mounted()`: Called after the instance is mounted to the DOM.
- `updated()`: Called after data changes are applied to the DOM.
- `destroyed()`: Called before the instance is destroyed.
----------------------------------------------------------------------------------------------------------
## Components
- Example:
```javascript
app.component('my-component', {
    template: `<div>A custom component!</div>`
});
----------------------------------------------------------------------------------------------------------
Props
Example:
app.component('child', {
    props: ['title'],
    template: `<h1>{{ title }}</h1>`
});
----------------------------------------------------------------------------------------------------------
Emit Events
Example:
app.component('child', {
    template: `<button @click="$emit('custom-event')">Click Me</button>`
});
----------------------------------------------------------------------------------------------------------
Watchers
Example:
watch: {
    message(newValue, oldValue) {
        console.log(`Message changed from ${oldValue} to ${newValue}`);
    }
}
----------------------------------------------------------------------------------------------------------
Styling
Scoped styles: Use <style scoped> in single-file components.
Dynamic classes:
<div :class="{ active: isActive }"></div>
----------------------------------------------------------------------------------------------------------
Vue Router (Basic Example)
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});

const app = Vue.createApp({});
app.use(router);
app.mount('#app');
----------------------------------------------------------------------------------------------------------
Vuex (State Management)
const store = Vuex.createStore({
    state() {
        return {
            count: 0
        };
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    }
});
----------------------------------------------------------------------------------------------------------
const app = Vue.createApp({});
app.use(store);
app.mount('#app');
----------------------------------------------------------------------------------------------------------
Fetching Data (Example with Axios)
methods: {
    async fetchData() {
        const response = await axios.get('https://api.example.com/data');
        this.data = response.data;
    }
}
----------------------------------------------------------------------------------------------------------
Useful Links
Vue.js Docs: https://vuejs.org
Vue Router: https://router.vuejs.org
Vuex: https://vuex.vuejs.org