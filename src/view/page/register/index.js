document.addEventListener("DOMContentLoaded", () => {
    const Btn_register = document.getElementById("submit-register");
    
    
    Btn_register.addEventListener('click', async () => {
        
        const ten_dang_nhap = document.getElementById("ten_dang_nhap").value.trim();
        const ten_hien_thi  = document.getElementById("ten_hien_thi").value.trim();
        const so_dien_thoai = document.getElementById("so_dien_thoai").value.trim();
        const email         = document.getElementById("email").value.trim();
        const password      = document.getElementById("password").value.trim();

        if (ten_dang_nhap === "" || ten_hien_thi === "" || so_dien_thoai === "" || email === "" || password === "") {
            alert("Vui lòng nhập đầy đủ thông tin!");
        }
        
      try {
          const response = await axios.post('/handle-register', {ten_dang_nhap,ten_hien_thi,so_dien_thoai,email,password});
          if (response.data.status) {
              alert(response.data.message);
          } else {
            alert(response.data.message || 'Đăng kí thất bại!');
          }
      } catch (error) {
          alert('Lỗi đăng kí:', error);
      }
    })
});
