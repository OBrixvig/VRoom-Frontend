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
            // Regex fra backend: ^[^@\s]+@edu\.zealand\.dk$ fordi det sagde stackoverflow XD
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

                const response = await login(this.email, this.password);
                
                console.log('Login respons:', response);
                if (response.Token) {
                    localStorage.setItem('jwt_token', response.Token);
                    window.location.href = 'FrontEnd.html';
                } else {
                    this.error = 'Login mislykkedes. Ingen token modtaget.';
                }
            } catch (error) {
                this.error = error.response?.data || 'Fejl ved login. Tjek email og password.';
            }
        },
    },
});


app.mount('#app');