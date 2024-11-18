
    const app = Vue.createApp({
        data() {
            return {
                message: "Hello Vue from EJS!"
            };
        },
        methods: {
            logout() {
                fetch('/logout', { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/login';
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Logout Failed:', error);
                    alert('Logout process failed.');
                });
            }
        }
    });

    app.mount('#app');
