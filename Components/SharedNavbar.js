export const SharedNavbar = {
    template: `
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#" @click="redirectToFrontPage">ZRoom Booking</a>
                <button @click="redirectToMyPage" class="btn btn-outline-success" type="submit">Min Side</button>
            </div>
        </nav>
    </header>`,
    data() {
        return {
            componentData: 'component'
        }
    },
    methods: {
        redirectToMyPage() {
            window.location.replace('MyPage.html');
        },
        redirectToFrontPage() {
            window.location.replace('FrontPage.html');
        }
    }
};
