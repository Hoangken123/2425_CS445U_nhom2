document.addEventListener("DOMContentLoaded", () => {
    const Btn_Losspassword = document.getElementById("btn-losspassword");

    Btn_Losspassword.addEventListener('click', async (e) => {
        e.preventDefault(); 
        const email = document.getElementById("email").value.trim();
        let link    = 'http://localhost:3000';
        if (email === "") {
            alert("Vui lòng nhập thông tin email!");
            return;
        }
        
        try {
            const response = await axios.post('/lost-password', { email,link });
            console.log(response);
            
            if (response.data.status) {
                alert(response.data.message);
           } else {
                alert(response.data.message || 'Lỗi không mong muốn!');
           }
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi hệ thống!');
        }
    });
});