import { getAll } from './AxiosCRUD.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentDate: new Date(),
            Bookings: [], // Et tomt array af bookinger
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
            // Filtrer bookinger baseret på dato eller andre kriterier, hvis nødvendigt
            return this.Bookings;
        },
    },
    methods: {
        async fetchBookings() {
            try {
                // Hent bookinger fra API (resource = 'Bookings')
                const bookings = await getAll('Bookings');
                this.Bookings = bookings.map(booking => ({
                    id: booking.id,
                    room: booking.room,
                    timeSlotId: booking.timeSlotId, // Bruger TimeSlotId fra API
                    isActive: booking.isActive,
                    // Konverter TimeSlotId til et læsbart format (se nedenfor)
                    timeSlotDisplay: this.getTimeSlotDisplay(booking.timeSlotId),
                }));
            } catch (error) {
                console.error('Fejl ved hentning af bookinger:', error);
            }
        },
        previousDay() {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.fetchBookings(); // Hent bookinger for ny dato
        },
        nextDay() {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.fetchBookings(); // Hent bookinger for ny dato
        },
        bookRoom(booking) {
            const selectedTimeSlot = this.selectedTimeSlot[booking.id];
            if (!selectedTimeSlot) return;

            const queryParams = new URLSearchParams({
                room: booking.room,
                timeSlot: selectedTimeSlot,
            }).toString();
            window.location.href = `bookingPage.html?${queryParams}`;
        },
        // Hjælpefunktion til at konvertere TimeSlotId til læsbart format.
        getTimeSlotDisplay(timeSlotId) {
            const slot = this.timeSlots.find(slot => slot.id === timeSlotId);
            return slot ? slot.display : 'Ukendt tid';
        },
    },
    mounted() {
        this.fetchBookings(); // Hent bookinger ved komponentens mount
    },
});

app.mount('#app');