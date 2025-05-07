import { getAll } from './AxiosCRUD.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentDate: new Date(),
            Bookings: [
                { id: 1, room: 'Room A', timeSlots: ['10:00 - 12:00', '12:00 - 14:00'], isAvailable: true },
                { id: 2, room: 'Room B', timeSlots: ['12:00 - 14:00', '14:00 - 16:00'], isAvailable: false },
                { id: 3, room: 'Room C', timeSlots: ['14:00 - 16:00', '16:00 - 18:00'], isAvailable: true },
                { id: 4, room: 'Room D', timeSlots: ['16:00 - 18:00', '18:00 - 20:00'], isAvailable: false },
            ],
            selectedTimeSlot: {}, // Holder styr på valgte tidsintervaller
        };
    },
    computed: {
        formattedDate() {
            return this.currentDate.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
        },
        filteredBookings() {
            return this.Bookings;
        },
    },
    methods: {
        previousDay() {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        },
        nextDay() {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        },
        bookRoom(booking) {
            const selectedTimeSlot = this.selectedTimeSlot[booking.id];
            if (!selectedTimeSlot) return;

            // Diregere til bookingdetials med parameter. 
            const queryParams = new URLSearchParams({
                room: booking.room,
                timeSlot: selectedTimeSlot,
            }).toString();
            window.location.href = `bookingPage.html?${queryParams}`;
        },
    },
});

app.mount('#app');