import { SharedNavbar } from '/Components/SharedNavbar.js';
import ConfirmModal from '/Components/ConfirmModal.js';
import { getByEmail, remove } from './AxiosCRUD.js';

const { createApp } = Vue;

// Tjekker om man er logget ind før siden vises
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.replace('index.html');
} else {
    const app = createApp({
        components: {
            'confirm-modal': ConfirmModal,
            'shared-navbar': SharedNavbar,
        },
        data() {
            return {
                userEmail: null,
                userName: null, // Rettede fra 'username' til 'userName' for konsistens
                userStudentId: null,
                userClassId: null,
                isLoading: false,
                error: null,
                myBookings: [],
                successMessage: null,
                cancelBookingId: null, // Holder ID for booking, der skal annulleres
                timerInterval: null, // Til nedtællingstimer
            };
        },
        methods: {
            redirectToMyPage() {
                window.location.replace('MyPage.html');
            },
            redirectToFrontPage() {
                window.location.replace('FrontPage.html');
            },
            async confirmCancel() {
                if (!this.cancelBookingId) {
                    console.error('Ingen booking ID valgt til annullering');
                    return;
                }
                await this.deleteBooking(this.cancelBookingId);
                this.closeCancelModal();
            },
            async deleteBooking(bookingId) {
                console.log('Forsøger at annullere booking ID:', bookingId);
                this.error = null;
                this.successMessage = null;
                this.isLoading = true;

                try {
                    await remove('Booking', bookingId);
                    this.myBookings = this.myBookings.filter(booking => booking.id !== bookingId);
                    this.successMessage = 'Reservationen blev annulleret.';
                } catch (error) {
                    console.error('Fejl ved annullering af booking:', error);
                    const errorMessage = error.response?.data || 'Kunne ikke annullere reservationen. Prøv igen senere.';
                    this.error = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
                } finally {
                    this.isLoading = false;
                }
            },
            canDeleteBooking(booking) {
                if (!booking?.date || !booking?.startTime) {
                    console.error('Ugyldig booking:', booking);
                    return false;
                }
                const bookingDate = new Date(booking.date);
                if (isNaN(bookingDate.getTime())) {
                    console.error('Ugyldig dato:', booking.date);
                    return false;
                }
                const timeParts = booking.startTime.split(':');
                if (timeParts.length < 2) {
                    console.error('Ugyldigt tidsformat:', booking.startTime);
                    return false;
                }
                const [hours, minutes] = timeParts.map(Number);
                if (isNaN(hours) || isNaN(minutes)) {
                    console.error('Ugyldige tidskomponenter:', booking.startTime);
                    return false;
                }
                bookingDate.setHours(hours, minutes, 0, 0);
                const now = new Date();
                const cancellationDeadline = new Date(bookingDate.getTime() - 5 * 60 * 1000); // 5 minutter før
                console.log('Booking:', booking.id, 'Now:', now, 'Deadline:', cancellationDeadline);
                return now <= cancellationDeadline;
            },
            formatCancellationDeadline(booking) {
                if (!booking?.date || !booking?.startTime) {
                    console.error('Ugyldig booking for frist:', booking);
                    return '';
                }
                const bookingDate = new Date(booking.date);
                if (isNaN(bookingDate.getTime())) {
                    console.error('Ugyldig dato:', booking.date);
                    return '';
                }
                const timeParts = booking.startTime.split(':');
                if (timeParts.length < 2) {
                    console.error('Ugyldigt tidsformat:', booking.startTime);
                    return '';
                }
                const [hours, mins] = timeParts.map(Number);
                if (isNaN(hours) || isNaN(mins)) {
                    console.error('Ugyldige tidskomponenter:', booking.startTime);
                    return '';
                }
                bookingDate.setHours(hours, mins, 0, 0);
                const deadline = new Date(bookingDate.getTime() - 5 * 60 * 1000);
                return deadline.toLocaleString('da-DK', { hour: '2-digit', minute: '2-digit' });
            },
            formatTimeRemaining(booking) {
                if (!booking?.date || !booking?.startTime) {
                    console.error('Ugyldig booking for timer:', booking);
                    return '';
                }
                const bookingDate = new Date(booking.date);
                if (isNaN(bookingDate.getTime())) {
                    console.error('Ugyldig dato:', booking.date);
                    return '';
                }
                const timeParts = booking.startTime.split(':');
                if (timeParts.length < 2) {
                    console.error('Ugyldigt tidsformat:', booking.startTime);
                    return '';
                }
                const [hours, mins] = timeParts.map(Number);
                if (isNaN(hours) || isNaN(mins)) {
                    console.error('Ugyldige tidskomponenter:', booking.startTime);
                    return '';
                }
                bookingDate.setHours(hours, mins, 0, 0);
                const deadline = new Date(bookingDate.getTime() - 5 * 60 * 1000);
                const now = new Date();
                const secondsLeft = Math.floor((deadline - now) / 1000);

                if (secondsLeft <= 0) return '';

                const days = Math.floor(secondsLeft / (24 * 60 * 60));
                const hoursLeft = Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60));
                const minutesLeft = Math.floor((secondsLeft % (60 * 60)) / 60);
                const seconds = secondsLeft % 60;

                const parts = [];
                if (days > 0) parts.push(`${days} ${days === 1 ? 'dag' : 'dage'}`);
                if (hoursLeft > 0) parts.push(`${hoursLeft} ${hoursLeft === 1 ? 'time' : 'timer'}`);
                if (minutesLeft > 0) parts.push(`${minutesLeft} min`);
                if (seconds > 0 || parts.length === 0) parts.push(`${seconds} sek`);

                return parts.join(', ');
            },
            showCancelModal(bookingId) {
                this.cancelBookingId = bookingId;
                Vue.nextTick(() => {
                    const modalElement = document.getElementById('cancelBookingModal');
                    if (modalElement) {
                        const modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    } else {
                        console.error('Modal element with ID cancelBookingModal not found');
                    }
                });
            },
            closeCancelModal() {
                const modalElement = document.getElementById('cancelBookingModal');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                }
                this.cancelBookingId = null;
            },
            getLoggedInUser() {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('JWT payload:', payload); // Debugging
                    return {
                        email: payload.email || null,
                        name: payload.name || null,
                        studentId: payload.studentId || null,
                        classId: payload.classId || null,
                    };
                } catch (e) {
                    console.error('Fejl ved hentning af brugeroplysninger i JWT:', e);
                    return { email: null, name: null, studentId: null, classId: null };
                }
            },
            async fetchUserDetails(email) {
                try {
                    const response = await await getByEmail('Users', this.userEmail, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                        },
                    });
                    console.log('Hentede brugeroplysninger:', response.data);
                    return response.data;
                } catch (error) {
                    console.error('Fejl ved hentning af brugeroplysninger:', error);
                    return null;
                }
            },
            formatDate(date) {
                if (!date) return '';
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) {
                    console.error('Ugyldig dato for formatering:', date);
                    return '';
                }
                return parsedDate.toLocaleDateString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        async beforeMount() {
            const user = this.getLoggedInUser();
            this.userEmail = user.email;
            this.userName = user.name;
            this.userStudentId = user.studentId;
            this.userClassId = user.classId;

            if (this.userEmail && (!this.userName || !this.userStudentId || !this.userClassId)) {
                const userDetails = await this.fetchUserDetails(this.userEmail);
                if (userDetails) {
                    this.userName = this.userName || userDetails.name || 'Ukendt navn';
                    this.userStudentId = this.userStudentId || userDetails.studentId || 'Ukendt studienummer';
                    this.userClassId = this.userClassId || userDetails.classId || 'Ukendt klassenavn';
                }
            }

            if (!this.userEmail) {
                this.error = 'Kunne ikke hente brugeroplysninger.';
            }
        },
        async mounted() {
            if (!this.userEmail) return;
            this.isLoading = true;
            this.error = null;
            try {
                const bookings = await getByEmail('Booking', this.userEmail);
                this.myBookings = Array.isArray(bookings) ? bookings : [];
                console.log('Hentede bookinger:', this.myBookings);
                // Start timer til nedtælling
                this.timerInterval = setInterval(() => {
                    this.$forceUpdate(); // Tvinger genberegning af formatTimeRemaining og canDeleteBooking
                }, 1000); // Hvert sekund
                // Aktiver tooltips
                document.querySelectorAll('[title]').forEach(el => {
                    new bootstrap.Tooltip(el);
                });
            } catch (error) {
                console.error('Fejl ved hentning af bookinger:', error);
                this.error = 'Kunne ikke hente reservationer.';
                if (error.response?.status === 401) {
                    localStorage.removeItem('jwt_token');
                    window.location.replace('index.html');
                }
            } finally {
                this.isLoading = false;
            }
        },
        beforeUnmount() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
        },
    });

    app.mount('#app');
}