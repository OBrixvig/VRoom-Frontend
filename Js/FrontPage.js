import { getAll } from './AxiosCRUD.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentDate: new Date(),
            Bookings: [], // Et tomt array af bookinger
            isLoading: true,
            isAuthenticated: false,
            selectedTimeSlot: [
                { id: 1, display: '10:00 - 12:00' },
                { id: 2, display: '12:00 - 14:00' },    // skal holder styr på valgte tidsintervaller
                { id: 3, display: '14:00 - 16:00' },
                { id: 4, display: '16:00 - 18:00' },
                { id: 5, display: '18:00 - 20:00' },
            ], 
        };
    },
    computed: {
        formattedDate() {
            return this.currentDate.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
        },
        filteredBookings() {
            // Filtrerer bookinger baseret på den valgte dato
            return this.Bookings;
        },
    },
    methods: {
        checkAuth() {
            console.log('Tjekker autentificering');
            const token = localStorage.getItem('jwt_token');
            console.log('JWT-token i localStorage:', token);
            if (!token) {
                console.log('Ingen token fundet, omdirigerer til index.html');
                window.location.replace('index.html');
                return false;
            }
            console.log('Token fundet, fortsætter');
            return true;
        },
        async fetchBookings() {
            try {
                console.log('Henter bookinger fra API');
                const bookings = await getAll('Bookings');
                this.Bookings = bookings.map(booking => ({
                    id: booking.id,
                    room: booking.room,
                    timeSlotId: booking.timeSlotId,
                    isActive: booking.isActive,
                    timeSlotDisplay: this.getTimeSlotDisplay(booking.timeSlotId),
                }));
                console.log('Bookinger hentet:', this.Bookings);
            } catch (error) {
                console.error('Fejl ved hentning af bookinger:', error);
                if (error.response?.status === 401) {
                    console.log('401 Unauthorized, omdirigerer til index.html');
                    window.location.replace('index.html');
                }
            }
        },
        previousDay() {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.fetchBookings();
        },
        nextDay() {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.fetchBookings();
        },
        bookRoom(booking) {
            const selectedTimeSlot = this.selectedTimeSlot[booking.id];
            if (!selectedTimeSlot) return;

            const queryParams = new URLSearchParams({
                room: booking.room,
                timeSlot: this.getTimeSlotDisplay(selectedTimeSlot),
            }).toString();
            window.location.href = `bookingPage.html?${queryParams}`;
        },
        getTimeSlotDisplay(timeSlotId) {
            const slot = this.timeSlots.find(slot => slot.id === timeSlotId);
            return slot ? slot.display : 'Ukendt tid';
        },
    },
    mounted() {
        console.log('Komponent mounted, starter autentificeringstjek');
        this.isLoading = true;
        this.isAuthenticated = this.checkAuth();
        if (this.isAuthenticated) {
            console.log('Bruger autentificeret, henter bookinger');
            this.fetchBookings();
        }
        this.isLoading = false;
        console.log('Loading færdig, isAuthenticated:', this.isAuthenticated);
    },
});

app.mount('#app');