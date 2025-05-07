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

        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                const token = parts.pop().split(';').shift();
                return token;
            }
            return null;
        },

        checkAuth() {
            const token = this.getCookie('jwt_token');
            if (!token) {
                window.location.replace('index.html');
                return false;
            }
            return true;
        },
        async fetchBookings() {
            try {
                const bookings = await getAll('Bookings');
                this.Bookings = bookings.map(booking => ({
                    id: booking.id,
                    room: booking.room,
                    timeSlotId: booking.timeSlotId,
                    isActive: booking.isActive,
                    timeSlotDisplay: this.getTimeSlotDisplay(booking.timeSlotId),
                }));
            } catch (error) {
                if (error.response?.status === 401) {
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
        this.isLoading = true;
        this.isAuthenticated = this.checkAuth();
        if (this.isAuthenticated) {
            this.fetchBookings();
        }
        this.isLoading = false;
    },
});

app.mount('#app');