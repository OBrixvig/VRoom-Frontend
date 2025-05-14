import { getByEmail } from './AxiosCRUD.js';

// Tjekker om man er loggint ind før siden vises
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
            }
else {
    const app = Vue.createApp({
        data() {
            return {
                isLoading: false,
                error: null,
                myBookings: [
                    {id: 1069, roomId: 'D2-13', date: '2025-05-13', startTime: '14:00:00', endTime: '15:55:00', pinCode: '1234', isActive: true, members: []}
                ]
            }
        },
        methods: {
            redirectToMyPage(){
                window.location.replace('index.html');
            },
        },
        computed: {
            myComputed() {
                return ''
            },

        }
    })

    app.mount('#app');
}