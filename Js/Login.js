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
                    // Hvis API'et returnerer en token i response.data
                    if (response.data.token) {
                        document.cookie = `auth_token=${response.data.token}; path=/; SameSite=Strict`;
                        console.log('Cookie sat manuelt:', document.cookie);
                    }
                    window.location.href = 'FrontEnd.html';
                } else {
                    this.error = 'Login mislykkedes. Tjek dine oplysninger.';
                }
            } catch (error) {
                // Simuler succesfuldt login til test, da API ikke er tilgængeligt
                document.cookie = `auth_token=dummy_token; path=/; SameSite=Strict`;
                console.log('Simuleret cookie sat:', document.cookie);
                window.location.href = 'FrontEnd.html';
                // Kommenter ovenstående ud, når du har API'et
                // this.error = error.response?.data?.message || 'Fejl ved login. Prøv igen senere.';
            }
        },
    },
});

app.mount('#app');