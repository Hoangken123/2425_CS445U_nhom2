document.addEventListener("DOMContentLoaded", () => {
    const BTN_resetpassWord = document.getElementById("btn-resetpassWord");
    
    
    BTN_resetpassWord.addEventListener('click', async () => {
        
        const pathParts = window.location.pathname.split('/');
        const token = pathParts[pathParts.length - 1]; 

        const newPassword = document.getElementById("NewPassword").value.trim();
        const confirmPassword = document.getElementById("Confirmpassword").value.trim();
       
        console.log("token : " + token + " newPassword : " + newPassword + "Comfirm : " + confirmPassword);
        
        if (!token) {
            alert("Mã thông báo không hợp lệ hoặc bị thiếu!");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords không trùng nhau !");
            return;
        }
        
      try {
        const response = await axios.post("/reset-password", {token,newPassword,});

        alert(response.data.message);
        setTimeout(() => window.location.href = "/login", 2000);
      } catch (error) {
        toastr.error(error.response?.data?.error || "Failed to reset password.");
    }
    })
});
