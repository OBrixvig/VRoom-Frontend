import { SharedNavbar } from '/Components/SharedNavbar.js';
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
                userEmail: null,
                isLoading: false,
                error: null,
                myBookings: [
                ]
            }
        },
        methods: {
            redirectToMyPage() {
                console.log('pp')
                window.location.replace('MyPage.html');
            },
            redirectToFrontPage() {
                window.location.replace('FrontPage.html');
            }
        },
        computed: {
            myComputed() {

            },
        },
        beforeMount() {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    this.userEmail = payload.email
                } catch (e) {
                    console.error('Fejl ved hentning af email i JWT:', e);
                }
        },
        async mounted() {
            this.isLoading = true;
            this.error = null;
            try {
                const bookings = await getByEmail('Booking', this.userEmail);
                this.myBookings = bookings;
                console.log(this.myBookings);
            } catch (error) {
                this.error = 'Kunne ikke hente bookinger.';
                if (error.response?.status === 401) {
                    localStorage.removeItem('jwt_token');
                    window.location.replace('index.html');
                }
            } finally {
                this.isLoading = false;
            }
        }
    })
    
    app.component('shared-navbar', SharedNavbar);
    app.mount('#app');
}