document.addEventListener("DOMContentLoaded", () => {
    const BtnUpdate = document.getElementById("btn-update-profile");
    
    // Get initial values
    const initialTenHienThi = document.getElementById("ten_hien_thi").value.trim();
    const initialSoDienThoai = document.getElementById("so_dien_thoai").value.trim();

    BtnUpdate.addEventListener('click', async (e) => {
        e.preventDefault(); 
        
        const ten_hien_thi = document.getElementById("ten_hien_thi").value.trim();
        const so_dien_thoai = document.getElementById("so_dien_thoai").value.trim();
        const userId = localStorage.getItem('userId');

        if (ten_hien_thi === "" || so_dien_thoai === "") {
            alert("Vui lòng không được để trống các trường");
            return;
        }

        if (ten_hien_thi === initialTenHienThi && so_dien_thoai === initialSoDienThoai) {
            alert("Vui lòng nhập thông tin để thay đổi");
            return;
        }
        
        try {
            const response = await axios.post('/admin/users/profile/update', { ten_hien_thi, so_dien_thoai, id: userId });
            
            if (response.data.status) {
                alert(response.data.message);
                location.reload(); 

            } else {
                alert(response.data.message || 'Lỗi không mong muốn!');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi hệ thống!');
        }
    });
});
