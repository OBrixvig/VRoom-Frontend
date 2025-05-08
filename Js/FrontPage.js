import { getAll } from './AxiosCRUD.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentDate: new Date(),
<<<<<<< HEAD
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
=======
            Bookings: [], // Rå bookinger fra API
            rooms: [], // Grupperede rum med tidsslots
            selectedTimeSlotForBooking: {}, // Holder styr på valgte tidsslot pr. rum
>>>>>>> 50708f2594dffaf01691a1950f430121c4f92913
        };
    },
    computed: {
        formattedDate() {
            return this.currentDate.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
        },
<<<<<<< HEAD
        filteredBookings() {
            // Filtrerer bookinger baseret på den valgte dato
            return this.Bookings;
=======
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
>>>>>>> 50708f2594dffaf01691a1950f430121c4f92913
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
<<<<<<< HEAD
                const bookings = await getAll('Bookings');
                this.Bookings = bookings.map(booking => ({
                    id: booking.id,
                    room: booking.room,
                    timeSlotId: booking.timeSlotId,
                    isActive: booking.isActive,
                    timeSlotDisplay: this.getTimeSlotDisplay(booking.timeSlotId),
=======
                // Hent bookinger fra API
                const bookings = await getAll('Booking');
                this.Bookings = bookings.map(booking => ({
                    roomId: booking.roomId,
                    timeSlot: booking.timeSlot,
                    date: booking.date,
>>>>>>> 50708f2594dffaf01691a1950f430121c4f92913
                }));
                console.log('Raw bookings:', this.Bookings); // Debugging
            } catch (error) {
                if (error.response?.status === 401) {
                    window.location.replace('index.html');
                }
            }
        },
        previousDay() {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
<<<<<<< HEAD
            this.fetchBookings();
        },
        nextDay() {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.fetchBookings();
=======
            this.currentDate = new Date(this.currentDate); // Trigger opdatering
        },
        nextDay() {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.currentDate = new Date(this.currentDate); // Trigger opdatering
>>>>>>> 50708f2594dffaf01691a1950f430121c4f92913
        },
        bookRoom(room) {
            const selectedTimeSlotId = this.selectedTimeSlotForBooking[room.roomId];
            const selectedTimeSlot = room.timeSlots.find(slot => slot.id === selectedTimeSlotId);
            if (!selectedTimeSlot) {
                alert('Vælg venligst et tidsslot');
                return;
            }

            const queryParams = new URLSearchParams({
<<<<<<< HEAD
                room: booking.room,
                timeSlot: this.getTimeSlotDisplay(selectedTimeSlot),
            }).toString();
            window.location.href = `bookingPage.html?${queryParams}`;
        },
        getTimeSlotDisplay(timeSlotId) {
            const slot = this.timeSlots.find(slot => slot.id === timeSlotId);
            return slot ? slot.display : 'Ukendt tid';
=======
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
>>>>>>> 50708f2594dffaf01691a1950f430121c4f92913
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