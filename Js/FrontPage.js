import { SharedNavbar } from '/Components/SharedNavbar.js';
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
                                startTime: booking.startTime,
                                endTime: booking.endTime,
                                isActive: true,
                            };
                        }
                        roomMap[booking.roomId].timeSlots.push({
                            startTime: booking.startTime,
                            endTime: booking.endTime
                        });
                    }
                });
                
                return roomMap;
            },
            roomsWithPictures() {
                return this.rooms
            }
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
                        startTime: booking.startTime,
                        endTime: booking.endTime
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
            async fetchRooms() {
                try {
                    this.isLoading = true;
                    this.error = null;
                    const roomsFromDB = await getAll('Rooms');
                    this.rooms = roomsFromDB.map(room => ({
                        roomId: room.roomId,
                        pictureLink: room.pictureLink
                    }));
                }
                catch (error) {
                    this.error = 'Kunne ikke hente rummene.';
                    if (error.response?.status === 401) {
                        localStorage.removeItem('jwt_token');
                        window.location.replace('index.html');
                    }
                }
                finally {
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
                const selectedTimeSlot = this.selectedTimeSlotForBooking[room.roomId];
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
                    startTime: selectedTimeSlot.startTime,
                    endTime: selectedTimeSlot.endTime,
                });

                // Gem dato i localStorage
                localStorage.setItem('selectedDate', this.currentDate.toISOString().split('T')[0]);

                const queryParams = new URLSearchParams({
                    room: room.roomId,
                    startTime: selectedTimeSlot.startTime,
                    endTime: selectedTimeSlot.endTime
                }).toString();
                window.location.href = `Booking.html?${queryParams}`;
            }
        },
        mounted() {
            // Sætter dato i localStorage toIsoString da det er den format det ligner API'en vil have. Dunno burde høre Nikolaj men fuck naj
            localStorage.setItem('selectedDate', this.currentDate.toISOString().split('T')[0]);
            this.fetchBookings();
            this.fetchRooms();
        },
    });

    app.component('shared-navbar', SharedNavbar);
    app.mount('#app');
}