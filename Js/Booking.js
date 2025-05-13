import { create } from './AxiosCRUD.js';

const { createApp } = Vue;

// Tjekker om man er logget ind
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
} else {
    const app = createApp({
        data() {
            return {
                booking: {
                    roomid: null,
                    timeSlot: null,
                    startTime: null,
                    endTime: null,
                    date: null,
                    userEmail: null,
                    member1: null,
                    member2: null,
                    member3: null,
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
            addNewMemberInput() {
                const newMemberInput = document.createElement('input');
                newMemberInput.type = 'email';
                newMemberInput.placeholder = 'email på gruppemedlem';
                newMemberInput.className = 'member-input';
                document.getElementById('memberInputs').appendChild(newMemberInput);
            },
            removeMemberInput() {
                const memberInputs = document.querySelectorAll('.member-input');
                if (memberInputs.length > 0) {
                    memberInputs[memberInputs.length - 1].remove();
                }
            },
            validateEmail(email) {
                if (!email || email.trim() === '') return true;
                const regex = /^[^@\s]+@edu\.zealand\.dk$/;
                return regex.test(email);
            },
            async confirmBooking() {
                try {
                    this.isLoading = true;
                    this.error = null;

                    // Valider medlemsemails
                    const members = [
                        this.booking.member1,
                        this.booking.member2,
                        this.booking.member3,
                    ];
                    for (const [index, email] of members.entries()) {
                        if (!this.validateEmail(email)) {
                            this.error = `Medlemsemail ${index + 1} skal ende på @edu.zealand.dk eller være tom`;
                            this.isLoading = false;
                            return;
                        }
                    }

                    await create('Booking', {
                        roomid: this.booking.roomid,
                        startTime: this.booking.startTime,
                        endTime: this.booking.endTime,
                        date: this.booking.date,
                        userEmail: this.booking.userEmail,
                        member1: this.booking.member1 || null,
                        member2: this.booking.member2 || null,
                        member3: this.booking.member3 || null,
                    });

                    // Omdiriger til FrontPage.html ved succes
                    window.location.replace('FrontPage.html'); // Skift til Details.html når oprettet
                } catch (error) {
                    this.error = error.response?.data || 'Booking mislykkedes. Prøv igen.';
                } finally {
                    this.isLoading = false;
                }
            },
            getLoggedInUser() {
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
            const startTimeParam = params.get('startTime');
            const endTimeParam = params.get('endTime');


            // Log query-parametre til debugging
            console.log('Query-parametre:', { room: roomParam, startTime: startTimeParam, endTime: endTimeParam });

            // Sæt booking-værdier
            this.booking.roomid = roomParam || null;
            this.booking.startTime = startTimeParam || null;
            this.booking.endTime = endTimeParam || null;

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
            if (!startTimeParam) {
                this.error = 'Ingen starttid angivet i URL.';
                return;
            }
            if (!endTimeParam) {
                this.error = 'Ingen sluttid angivet i URL.';
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