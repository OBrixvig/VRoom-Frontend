import { getAll } from './AxiosCRUD.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentDate: new Date(),
            Bookings: [], // Rå bookinger fra API
            rooms: [], // Grupperede rum med tidsslots
            selectedTimeSlotForBooking: {}, // Holder styr på valgte tidsslot pr. rum
        };
    },
    computed: {
        formattedDate() {
            return this.currentDate.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
        },
        filteredRooms() {
            // Grupper bookinger efter RoomId og filtrer efter dato
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
                            isActive: true, // Antag alle rum er aktive
                        };
                    }
                    roomMap[booking.roomId].timeSlots.push({
                        display: booking.timeSlot,
                        // Generer et id baseret på timeSlot for unikt valg
                        id: this.getTimeSlotId(booking.timeSlot),
                    });
                }
            });

            // Konverter roomMap til array og sorter tidsslots
            return Object.values(roomMap).map(room => ({
                ...room,
                timeSlots: room.timeSlots.sort((a, b) => a.display.localeCompare(b.display)),
            }));
        },
    },
    methods: {
        async fetchBookings() {
            try {
                // Hent bookinger fra API
                const bookings = await getAll('Booking');
                this.Bookings = bookings.map(booking => ({
                    roomId: booking.roomId,
                    timeSlot: booking.timeSlot,
                    date: booking.date,
                }));
                console.log('Raw bookings:', this.Bookings); // Debugging
            } catch (error) {
                console.error('Fejl ved hentning af bookinger:', error);
            }
        },
        previousDay() {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.currentDate = new Date(this.currentDate); // Trigger opdatering
        },
        nextDay() {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.currentDate = new Date(this.currentDate); // Trigger opdatering
        },
        bookRoom(room) {
            const selectedTimeSlotId = this.selectedTimeSlotForBooking[room.roomId];
            const selectedTimeSlot = room.timeSlots.find(slot => slot.id === selectedTimeSlotId);
            if (!selectedTimeSlot) {
                alert('Vælg venligst et tidsslot');
                return;
            }

            const queryParams = new URLSearchParams({
                room: room.roomId,
                timeSlot: selectedTimeSlot.display,
            }).toString();
            window.location.href = `bookingPage.html?${queryParams}`;
        },
        // Generer et unikt id for tidsslot baseret på timeSlot-strengen
        getTimeSlotId(timeSlot) {
            const slotMap = {
                '10:00 - 12:00': 1,
                '12:00 - 14:00': 2,
                '14:00 - 16:00': 3,
                '16:00 - 18:00': 4,
                '18:00 - 20:00': 5,
            };
            return slotMap[timeSlot] || 0; // Fallback til 0 hvis ukendt
        },
    },
    mounted() {
        this.fetchBookings(); // Hent bookinger ved komponentens mount
    },
});

app.mount('#app');