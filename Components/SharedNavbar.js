app.component('shared-navbar', {
     props: {
          testprop: {
               type: String,
               required: true
          }
     },
     template:
     /*html*/
     `<div>
          <h1>This is a {{ componentData }}</h1>
          <p> {{ this.testprop }} </p>
     </div>`,
     data() {
          return {
              componentData: 'component'
          }
     },
     methods: {
          redirectToMyPage() {
            window.location.replace('MyPage.html');
          }
     },
     computed: {
          componentComputed() {
          }
     }
})