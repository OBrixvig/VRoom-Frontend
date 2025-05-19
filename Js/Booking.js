import { SharedNavbar } from '/Components/SharedNavbar.js';
import ConfirmModal from '/Components/ConfirmModal.js';
import { create, searchUsers } from './AxiosCRUD.js';

const { createApp } = Vue;

// Tjekker om man er logget ind
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
} else {
    const app = createApp({
        components: {
            'confirm-modal': ConfirmModal,
        },
        data() {
            return {
                booking: {
                    roomid: null,
                    timeSlot: null,
                    startTime: null,
                    endTime: null,
                    date: null,
                    userEmail: null,
                    members: [],
                },
                memberSearch: '',
                memberResults: [],
                isLoading: false,
                error: null,
                debounce: null,
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
            async searchMembers() {
                if (!this.memberSearch.trim()) {
                    this.memberResults = [];
                    return;
                }

                this.isLoading = true;
                this.error = null;

                try {
                    this.memberResults = await searchUsers(this.memberSearch);
                } catch (error) {
                    console.error('Fejl ved søgning af brugere:', error);
                    this.error = 'Kunne ikke søge efter brugere. Prøv igen senere.';
                    this.memberResults = [];
                } finally {
                    this.isLoading = false;
                }
            },
            addMember(member) {
                if (this.booking.members.length >= 3) {
                    this.error = 'Maksimalt 3 gruppemedlemmer kan tilføjes.';
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                    return;
                }
                if (this.booking.members.includes(member.email)) {
                    this.error = 'Denne bruger er allerede tilføjet.';
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                    return;
                }
                if (member.email === this.booking.userEmail) {
                    this.error = 'Du kan ikke tilføje dig selv som gruppemedlem.';
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                    return;
                }
                this.booking.members.push(member.email);
                this.memberSearch = '';
                this.memberResults = [];
            },
            removeMember(index) {
                this.booking.members.splice(index, 1);
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

                    for (const [index, email] of this.booking.members.entries()) {
                        if (!this.validateEmail(email)) {
                            this.error = `Medlemsemail ${index + 1} skal ende på @edu.zealand.dk eller være tom`;
                            this.isLoading = false;
                            return;
                        }
                    }

                    const member1 = this.booking.members[0] || null;
                    const member2 = this.booking.members[1] || null;
                    const member3 = this.booking.members[2] || null;

                    await create('Booking', {
                        roomid: this.booking.roomid,
                        startTime: this.booking.startTime,
                        endTime: this.booking.endTime,
                        date: this.booking.date,
                        userEmail: this.booking.userEmail,
                        member1: member1,
                        member2: member2,
                        member3: member3,
                    });

                    // Omdiriger til MyPage.html ved succes
                    window.location.replace('MyPage.html');
                } catch (error) {
                    this.error = error.response?.data || 'Booking mislykkedes. Prøv igen.';
                } finally {
                    this.isLoading = false;
                }
            },
            showConfirmModal() {
                Vue.nextTick(() => {
                    const modalElement = document.getElementById('bookingConfirmModal');
                    if (modalElement) {
                        const modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    } else {
                        console.error('Modal element with ID bookingConfirmModal not found');
                    }
                });
            },
            closeConfirmModal() {
                const modalElement = document.getElementById('bookingConfirmModal');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
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
            pairEmail(email) {
                if (!this.memberResults) return email;
                let pairedMember = this.memberResults.find(m => m.email === email);
                return pairedMember ? `${pairedMember.name} (${email})` : email;
            },
        },
        watch: {
            memberSearch: {
                handler() {
                    clearTimeout(this.debounce);
                    this.debounce = setTimeout(() => {
                        this.searchMembers();
                    }, 300);
                }
            }
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

    app.component('shared-navbar', SharedNavbar);
    app.mount('#app');
}