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
        async handleLogin() {
            try {
                this.error = null;
                const response = await login(this.email, this.password);
                
                if (response.status === 201) {
                    // Cookie håndteres typisk automatisk af browseren via Set-Cookie header
                    // Hvis API'et returnerer en token i response.data, kan vi gemme den manuelt
                    if (response.data.token) {
                        document.cookie = `auth_token=${response.data.token}; path=/; Secure; SameSite=Strict`;
                    }
                    // Omdiriger til booking-siden
                    window.location.href = 'FrontEnd.html';
                } else {
                    this.error = 'Login mislykkedes. Tjek dine oplysninger.';
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Fejl ved login. Prøv igen senere.';
            }
        },
    },
});

app.mount('#app');