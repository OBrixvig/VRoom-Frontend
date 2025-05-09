import { getAll } from './AxiosCRUD.js';

// Tjekker om man er loggint ind før siden vises
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
            } 
else 
{
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
                warning: null,
                isAuthenticated: true,
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
                localStorage.setItem('selectedDate', this.currentDate.toISOString().split('T')[0]);
                this.fetchBookings();
            },
            nextDay() {
                this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() + 1));
                localStorage.setItem('selectedDate', this.currentDate.toISOString().split('T')[0]);
                this.fetchBookings();
            },
            bookRoom(room) {
                const selectedTimeSlotId = this.selectedTimeSlotForBooking[room.roomId];
                const selectedTimeSlot = room.timeSlots.find(slot => slot.id === selectedTimeSlotId);
                if (!selectedTimeSlot) {
                    this.warning = 'Husk at vælge et tidsrum.';
                    setTimeout(() => {
                        this.warning = null;
                    }, 2000);
                    return;
                }
                if (!room.roomId) {
                    this.error = 'Ingen rum-ID tilgængelig';
                    return;
                }
                
                // Log værdier til debugging
                console.log('bookRoom værdier:', {
                    roomId: room.roomId,
                    timeSlot: selectedTimeSlot.display,
                    selectedTimeSlotId,
                });

                // Gem dato i localStorage
                localStorage.setItem('selectedDate', this.currentDate.toISOString().split('T')[0]);

                const queryParams = new URLSearchParams({
                    room: room.roomId,
                    timeSlot: selectedTimeSlot.display,
                }).toString();
                window.location.href = `Booking.html?${queryParams}`;
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
        },
        mounted() {
            // Sætter dato i localStorage toIsoString da det er den format det ligner API'en vil have. Dunno burde høre Nikolaj men fuck naj
            localStorage.setItem('selectedDate', this.currentDate.toISOString().split('T')[0]);
            this.fetchBookings();
        },
    });

    app.mount('#app');
}