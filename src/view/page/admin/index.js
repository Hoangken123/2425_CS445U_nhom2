document.addEventListener("DOMContentLoaded", () => {
    const UsersTable = document.getElementById("loadTK");
    const DeleteAccount  = document.getElementById("btn-xoaTK");
    const CreateAccont = document.getElementById("btn-themMoiTaiKhoan");
    const UpdateAccount = document.getElementById("btn-updateTK");
    const changePassword = document.getElementById("btn-changePW");
    const loadUser = async () => {
        try {
            const response = await axios.get('/admin/users/get-data');
            const { data } = response.data;

            if (!data || data.length === 0) {
                UsersTable.innerHTML = "<tr><td colspan='7' class='text-center'>No users found</td></tr>";
                return;
            }

            UsersTable.innerHTML = data.map((users, index) => `
                <tr class="text-center">
                    <td>${index + 1}</td>
                    <td>${users.ten_dang_nhap}</td>
                    <td>${users.ten_hien_thi}</td>
                    <td>${users.email}</td>
                    <td>${users.so_dien_thoai}</td>
                    <td>${users.level === 1 ? 'Admin' : 'Chưa Xác Định'}</td>
                    <td> <button class="btn btn-success btn-sm" onclick="changePassword(${users.id},'${users.email}')">Đổi mật khẩu</button></td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editusers(${users.id}, '${users.ten_dang_nhap}', '${users.ten_hien_thi}', '${users.so_dien_thoai}', '${users.email}', '${users.level}', '${users.id_cua_hang}', '${users.id_quyen}')">Cập Nhật</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteusers(${users.id})">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };
    // SHOW MODAL DELETE USERS
    window.deleteusers = async(id) => {
        document.getElementById("delete-id").value = id;
        const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
        deleteModal.show();
    }
    // DELETE USERS
    DeleteAccount.addEventListener("click", async () => {
        const id = document.getElementById("delete-id").value;
        try {
            const response = await axios.post("/admin/users/delete", {id});
      
            if (response.data.status) {
              const editModal = bootstrap.Modal.getInstance(
                document.getElementById("deleteModal")
              );
              editModal.hide();
      
              loadUser();
              toastr.success(response.data.message);
            } else {
              toastr.error("Cập nhật thất bại: " + response.data.message);
            }
          } catch (error) {
            if (error.response && error.response.data.errors) {
              const errorMessages = error.response.data.errors
                .map((err) => err.msg)
                .join("<br>");
              toastr.error(errorMessages);
            } else {
              console.error("Lỗi xoá mới Tài khoản:", error);
              toastr.error("Có lỗi xảy ra khi xoá Tài khoản!");
            }
          }
    })
    // ADD USERS
    CreateAccont.addEventListener('click', async () => {
        const ten_dang_nhap = document.getElementById("ten_dang_nhap").value.trim();
        const ten_hien_thi  = document.getElementById("ten_hien_thi").value.trim();
        const so_dien_thoai = document.getElementById("so_dien_thoai").value.trim();
        const email         = document.getElementById("email").value.trim();
        const password      = document.getElementById("password").value.trim();

        if (ten_dang_nhap === "" || ten_hien_thi === "" || so_dien_thoai === "" || email === "" || password === "") {
            toastr.error("Vui lòng nhập đầy đủ thông tin!");
        }
        
      try {
          const response = await axios.post('/admin/users/create', {ten_dang_nhap,ten_hien_thi,so_dien_thoai,email,password});
          if (response.data.status) {
            loadUser(); 
              toastr.success(response.data.message);
          } else {
            toastr.error(response.data.message || 'Thêm mới thất bại!');
          }
      } catch (error) {
          toastr.error('Lỗi Thêm mới:', error);
      }
    })
    //EDIT USERS
    window.editusers = async (id,ten_dang_nhap,ten_hien_thi,so_dien_thoai,email,level,id_cua_hang,id_quyen)=>{
        document.getElementById("edit-id").value            = id;
        document.getElementById("edit_ten_dang_nhap").value = ten_dang_nhap;
        document.getElementById("edit_ten_hien_thi").value  = ten_hien_thi
        document.getElementById("edit_so_dien_thoai").value = so_dien_thoai
        document.getElementById("edit_email").value         = email
        document.getElementById("edit_level").value         = level
        document.getElementById("edit_id_cua_hang").value   = id_cua_hang
        document.getElementById("edit_id_quyen").value      = id_quyen
        const capNhatModal = new bootstrap.Modal(document.getElementById("capNhatModal"));
        capNhatModal.show();
    }
    // UODATE USERS
    UpdateAccount.addEventListener('click' , async () =>{
        const id            = document.getElementById("edit-id").value;
        const ten_dang_nhap = document.getElementById("edit_ten_dang_nhap").value.trim();
        const ten_hien_thi  = document.getElementById("edit_ten_hien_thi").value.trim();
        const so_dien_thoai = document.getElementById("edit_so_dien_thoai").value.trim();
        const email         = document.getElementById("edit_email").value.trim();
        const  level         = document.getElementById("edit_level").value.trim();
        const  id_cua_hang   = document.getElementById("edit_id_cua_hang").value.trim();
        const  id_quyen      = document.getElementById("edit_id_quyen").value.trim();
        try {
            const response = await axios.post("/admin/users/update", {id,ten_dang_nhap: ten_dang_nhap,ten_hien_thi: ten_hien_thi,so_dien_thoai,email,level,id_cua_hang,id_quyen});
      
            if (response.data.status) {
              const capNhatModal = bootstrap.Modal.getInstance(
                document.getElementById("capNhatModal")
              );
              capNhatModal.hide();
      
              loadUser();
              toastr.success(response.data.message);
            } else {
              toastr.error("Cập nhật thất bại: " + response.data.message);
            }
          } catch (error) {
            if (error.response && error.response.data.errors) {
              const errorMessages = error.response.data.errors
                .map((err) => err.msg)
                .join("<br>");
              toastr.error(errorMessages);
            } else {
              console.error("Lỗi thêm mới Người Dùng:", error);
              toastr.error("Có lỗi xảy ra khi thêm Người Dùng!");
            }
          }
    })
    //SHOW ĐỔI MẬT KHẨU
    window.changePassword = async (id,email) =>{
      document.getElementById("dmk_id").value            = id;
      document.getElementById("dmk_email").value         = email;
      const ModaldmkTK = new bootstrap.Modal(document.getElementById("ModaldmkTK"));
      ModaldmkTK.show();
    }
    // CHANGE PASSWORD BTN
    changePassword.addEventListener("click", async ()=>{
      const id           = document.getElementById("dmk_id").value;
      const newPassWord  = document.getElementById("dmk_password").value.trim();
      const re_Password  = document.getElementById("dmk_re_password").value.trim();
      try {
        const response = await axios.post("/admin/users/change-password", {id,newPassWord,re_Password});
  
        if (response.data.status) {
          const ModaldmkTK = bootstrap.Modal.getInstance(
            document.getElementById("ModaldmkTK")
          );
          ModaldmkTK.hide();
          //Load lại users
          loadUser();
          toastr.success(response.data.message);
        } else {
          toastr.error("Đổi mật khẩu thất bại: " + response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const errorMessages = error.response.data.errors
            .map((err) => err.msg)
            .join("<br>");
          toastr.error(errorMessages);
        } else {
          console.error("Lỗi đổi mật khẩu Người Dùng:", error);
          toastr.error("Có lỗi xảy ra khi đổi mật khẩu Người Dùng!");
        }
      } 
    })

    loadUser();
});
