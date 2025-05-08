import { login } from './AxiosCRUD.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            email: '',
            password: '',
            error: null,
        };
    },
    methods: {
        validateEmail(email) {
            const regex = /^[^@\s]+@edu\.zealand\.dk$/;
            return regex.test(email);
        },
        async handleLogin() {
            try {
                this.error = null;

                // Valider e-mail
                if (!this.validateEmail(this.email)) {
                    this.error = 'E-mail skal ende på @edu.zealand.dk';
                    return;
                }

                // Slet gamle tokens
                localStorage.removeItem('jwt_token');

                const response = await login(this.email, this.password);

                if (response && response.token) {
                    // Gemmer token i localStorage
                    localStorage.setItem('jwt_token', response.token);
                    // Omdiriger til forsiden
                    window.location.replace('FrontPage.html');
                } else {
                    this.error = 'Login mislykkedes. Ingen token modtaget.';
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    this.error = 'Ugyldig email eller adgangskode.';
                } else if (error.response?.data) {
                    this.error = error.response.data || 'Fejl ved login. Tjek email og adgangskode.';
                } else {
                    this.error = 'Kunne ikke oprette forbindelse til serveren.';
                }
            }
        },
    },
});

app.mount('#app');