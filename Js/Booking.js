import { create } from './AxiosCRUD.js';

const { createApp } = Vue;

// Tjekker om man er loggint ind
const token = localStorage.getItem('jwt_token');
if (!token) 
    {
    window.location.replace('index.html');
    } 
else 
{
    const app = createApp({
        data() {
            return {
                booking: {
                    roomid: null,
                    timeSlot: null,
                    startTime: null,
                    endTime: null,
                    date: null,
                    userEmail: null,
                },
                isLoading: false,
                error: null,
            };
        },
        computed: {
            formattedDate() {
                if (!this.booking.date) return '';
                return new Date(this.booking.date).toLocaleDateString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        methods: {
            async confirmBooking() {
                try {
                    this.isLoading = true;
                    this.error = null;

                    await create('Booking', {
                        roomid: this.booking.roomid,
                        startTime: this.booking.startTime,
                        endTime: this.booking.endTime,
                        date: this.booking.date,
                        userEmail: this.booking.userEmail,
                    });

                    // Omdiriger til FrontPage.html ved succes, burde være details, men den er ikke oprettet endnu
                    window.location.replace('FrontPage.html');// husk at ændre til Details.html når den er oprettet
                } catch (error) {
                    this.error = error.response?.data || 'Booking mislykkedes. Prøv igen.';
                } finally {
                    this.isLoading = false;
                }
            },
            getLoggedInUser() {
                // henter email fra JWT-token
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.email || null;
                } catch (e) {
                    // debug prøver at finde ud af hvorfor den ikke kan finde email.
                    console.error('Fejl ved hentning af email i JWT:', e);
                    return null;
                }
            },
        },
        mounted() {
            // Hent query-parametre
            const params = new URLSearchParams(window.location.search);
            const roomParam = params.get('room');
            const startTimeParam = params.get('startTime');
            const endTimeParam = params.get('endTime');


            // Log query-parametre til debugging
            console.log('Query-parametre:', { room: roomParam, startTime: startTimeParam, endTime: endTimeParam });

            // Sæt booking-værdier
            this.booking.roomid = roomParam || null;
            this.booking.startTime = startTimeParam || null;
            this.booking.endTime = endTimeParam || null;

            // Hent dato fra localStorage eller brug dagens dato
            const selectedDate = localStorage.getItem('selectedDate') || new Date().toISOString().split('T')[0];
            this.booking.date = selectedDate;

            // Valider query-parametre
            if (!roomParam) {
                this.error = 'Ingen rum-ID angivet i URL.';
                return;
            }
            if (!roomParam.trim()) {
                this.error = 'Ugyldigt rum-ID (tom streng).';
                return;
            }
            if (!startTimeParam) {
                this.error = 'Ingen starttid angivet i URL.';
                return;
            }
            if (!endTimeParam) {
                this.error = 'Ingen sluttid angivet i URL.';
                return;
            }

            // Tilføj logget ind bruger
            const loggedInUser = this.getLoggedInUser();
            if (loggedInUser) {
                this.booking.userEmail = loggedInUser;
            } else {
                this.error = 'Kunne ikke hente brugeroplysninger.';
            }
        },
    });

    app.mount('#app');
}