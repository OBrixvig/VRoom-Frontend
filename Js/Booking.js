import { create } from './AxiosCRUD.js';
import ConfirmModal from './ConfirmModal.js';

// Tjekker om man er logget ind
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
} else {
    const app = Vue.createApp({
        components: {
            'confirm-modal': ConfirmModal,
        },
        data() {
            return {
                booking: {
                    roomid: null,
                    timeSlot: null,
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
                        timeSlot: this.booking.timeSlot,
                        date: this.booking.date,
                        userEmail: this.booking.userEmail,
                    });

                    // Omdiriger til FrontPage.html ved succes, burde være Details.html når den er oprettet
                    window.location.replace('FrontPage.html'); // husk at ændre til Details.html når den er oprettet
                } catch (error) {
                    this.error = error.response?.data || 'Booking mislykkedes. Prøv igen.';
                } finally {
                    this.isLoading = false;
                }
            },
            // viser Modal for at bekræfte booking
            showConfirmModal() {
                Vue.nextTick(() => {
                    const modalElement = document.getElementById('bookingConfirmModal');
                    if (modalElement) {
                        const modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    } else {
                        console.error('Modal element with ID bookingConfirmModal not found');
                    }
                });
            },
            closeConfirmModal() {
                const modalElement = document.getElementById('bookingConfirmModal');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                }
            },
            getLoggedInUser() {
                // Henter email fra JWT-token
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.email || null;
                } catch (e) {
                    console.error('Fejl ved hentning af email i JWT:', e);
                    return null;
                }
            },
        },
        mounted() {
            // Hent query-parametre
            const params = new URLSearchParams(window.location.search);
            const roomParam = params.get('room');
            const timeSlotParam = params.get('timeSlot');

            // Log query-parametre til debugging
            console.log('Query-parametre:', { room: roomParam, timeSlot: timeSlotParam });

            // Sæt booking-værdier
            this.booking.roomid = roomParam || null;
            this.booking.timeSlot = timeSlotParam || null;

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
            if (!timeSlotParam) {
                this.error = 'Ingen tidsslot angivet i URL.';
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