import { getAll } from './AxiosCRUD.js';

// Tjek autentificering før Vue initialiseres
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
} else {
    const { createApp } = Vue;

    const app = createApp({
        data() {
            return {
                currentDate: new Date(),
                Bookings: [],
                rooms: [],
                selectedTimeSlotForBooking: {},
                isLoading: false,
                error: null,
                isAuthenticated: true, // Sæt til true, da vi har tjekket token
            };
        },
        computed: {
            formattedDate() {
                return this.currentDate.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
            },
            filteredRooms() {
                const roomMap = {};
                this.Bookings.forEach(booking => {
                    const bookingDate = new Date(booking.date);
                    const isSameDate =
                        bookingDate.getFullYear() === this.currentDate.getFullYear() &&
                        bookingDate.getMonth() === this.currentDate.getMonth() &&
                        bookingDate.getDate() === this.currentDate.getDate();

                    if (isSameDate) {
                        if (!roomMap[booking.roomId]) {
                            roomMap[booking.roomId] = {
                                roomId: booking.roomId,
                                timeSlots: [],
                                isActive: true,
                            };
                        }
                        roomMap[booking.roomId].timeSlots.push({
                            display: booking.timeSlot,
                            id: this.getTimeSlotId(booking.timeSlot),
                        });
                    }
                });

                return Object.values(roomMap).map(room => ({
                    ...room,
                    timeSlots: room.timeSlots.sort((a, b) => a.display.localeCompare(b.display)),
                }));
            },
        },
        methods: {
            async fetchBookings() {
                try {
                    this.isLoading = true;
                    this.error = null;
                    const bookings = await getAll('Booking');
                    this.Bookings = bookings.map(booking => ({
                        roomId: booking.roomId,
                        timeSlot: booking.timeSlot,
                        date: booking.date,
                    }));
                    console.log('Raw bookings:', this.Bookings);
                } catch (error) {
                    this.error = 'Kunne ikke hente bookinger.';
                    if (error.response?.status === 401) {
                        localStorage.removeItem('jwt_token');
                        window.location.replace('index.html');
                    }
                } finally {
                    this.isLoading = false;
                }
            },
            previousDay() {
                this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1));
                this.fetchBookings();
            },
            nextDay() {
                this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() + 1));
                this.fetchBookings();
            },
            bookRoom(room) {
                const selectedTimeSlotId = this.selectedTimeSlotForBooking[room.roomId];
                const selectedTimeSlot = room.timeSlots.find(slot => slot.id === selectedTimeSlotId);
                if (!selectedTimeSlot) {
                    this.error = 'Vælg venligst et tidsslot';
                    return;
                }

                const queryParams = new URLSearchParams({
                    room: room.roomId,
                    timeSlot: selectedTimeSlot.display,
                }).toString();
                window.location.href = `bookingPage.html?${queryParams}`;
            },
            getTimeSlotId(timeSlot) {
                const slotMap = {
                    '10:00 - 12:00': 1,
                    '12:00 - 14:00': 2,
                    '14:00 - 16:00': 3,
                    '16:00 - 18:00': 4,
                    '18:00 - 20:00': 5,
                };
                return slotMap[timeSlot] || 0;
            },
            logout() {
                localStorage.removeItem('jwt_token');
                window.location.replace('index.html');
            },
        },
        mounted() {
            this.fetchBookings();
        },
    });

    app.mount('#app');
}