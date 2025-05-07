import { getAll, create, getById, remove, update} from './AxiosCRUD.js';

const { createApp } = Vue;

const app = Vue.createApp({
    data() {
        return {
            Bookings: [],
            newBooking: {
                room: '',
                date: '',
                timeSlot: '',
                userEmail: '',
                isActive: true,
                // Tænker at teamMebers er et Array af objekter, som har et StudenderId og en Email?
                teamMembers: [],
            },
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