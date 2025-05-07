const app = Vue.createApp({
    data() {
        return {
            intro: 'Du begynder bare at lave lågsus ting her Oliver',
        }
    },
    methods: {
        myMethod(){
            
        },
    },
    computed: {
        myComputed() {
            return ''
        },
        
    }
})

app.mount('#app');