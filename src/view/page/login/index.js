document.addEventListener("DOMContentLoaded", () => {
    const Btn_Login = document.getElementById("btn-login");
    
    Btn_Login.addEventListener('click', async (e) => {
        e.preventDefault(); 
        
        const email = document.getElementById("Email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        if (email === "" || password === "") {
            toastr.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        
        try {
            const response = await axios.post('/login', { email, password });
            
            if (response.data.status) {
                localStorage.setItem('userId', response.data.userId); 
                
                window.location.href = response.data.redirectUrl;
            } else {
                toastr.error(response.data.message || 'Đăng nhập thất bại!');
            }
        } catch (error) {
            toastr.error(error.response?.data?.message || 'Đăng nhập thất bại!');
        }
    });
});
