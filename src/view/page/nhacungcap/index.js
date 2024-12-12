    
document.addEventListener("DOMContentLoaded", () => {
    const NhaCungCapTable = document.getElementById("nhaCupCap-table");
    const searchInput = document.getElementById("search-input");
    const pagination = document.getElementById("pagination");
    const addButton = document.getElementById("add-save-button");
    const editButton = document.getElementById("edit-save-button");

    let currentPage = 1;
    const limit = 10;   

    const fetchNhaCC = async (page = 1, search = "") => {
        try {
            const response = await axios.get('/admin/nha-cung-cap/get-data', { params: { page, limit, search } });
            const { data, pagination: pag } = response.data;
            console.log("data: ", data);
            
            NhaCungCapTable.innerHTML = data.map((nhaCungCap, index) => `
                <tr class="text-center" data-id="${nhaCungCap.id}">
                    <td>${index + 1 + (page - 1) * limit}</td>
                    <td>${nhaCungCap.ten_nha_cung_cap}</td>
                    <td>${nhaCungCap.dia_chi || ''}</td>
                    <td>${nhaCungCap.so_dien_thoai || ''}</td>
                    <td>${nhaCungCap.email || ''}</td>
                    <td>${nhaCungCap.id_cua_hang || ''}</td>
                    <td>
                        <button 
                        class="btn btn-primary btn-sm "
                        onclick="editNhaCC(${nhaCungCap.id}, '${nhaCungCap.ten_nha_cung_cap}', '${nhaCungCap.dia_chi || ''}', '${nhaCungCap.so_dien_thoai || ''}', '${nhaCungCap.email || ''}', '${nhaCungCap.id_cua_hang || ''}')"
                        >Cập Nhật</button>
                        <button class="btn btn-danger btn-sm " onclick="deleteNhaCC(${nhaCungCap.id})">Xóa</button>
                    </td>
                </tr>
            `).join('');

            // Gắn sự kiện cho các nút
            const editButtons = NhaCungCapTable.querySelectorAll(".edit-btn");
            const deleteButtons = NhaCungCapTable.querySelectorAll(".delete-btn");

            editButtons.forEach((btn, index) => {
                const category = data[index];
                btn.addEventListener("click", () => {
                    editNhaCC(category.id, category.ten, category.mo_ta || '');
                });
            });

            deleteButtons.forEach((btn, index) => {
                const category = data[index];
                btn.addEventListener("click", () => {
                    deleteNhaCC(category.id);
                });
            });

            renderPagination(pag.total, pag.page, pag.limit);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    //add-DanhMuc 
    addButton.addEventListener('click', async () => {
        const ten = document.getElementById("add-name").value.trim();
        const address = document.getElementById("add-address").value.trim();
        const phone = document.getElementById("add-phone").value.trim();
        const email = document.getElementById("add-email").value.trim();
        const shop = document.getElementById("add-shop").value.trim();
    
        if (ten === "" || address === "" || phone === "" || email === "" || shop === "") {
            toastr.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        
        try {
            const response = await axios.post('/admin/nha-cung-cap/create', {ten, address, phone, email, shop});
            
            if (response.data.status) {
                fetchNhaCC();  // Cập nhật danh sách nhà cung cấp nếu thêm thành công
                toastr.success(response.data.message);
            } else {
                toastr.error(response.data.message || 'Thêm mới thất bại!');
            }
        } catch (error) {
            toastr.error('Lỗi Thêm mới:', error);
        }
    });
    //xoa danh muc
    window.deleteNhaCC = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await axios.delete(`/admin/nha-cung-cap/delete?id=${id}`);
                fetchNhaCC(currentPage); // Load lại danh sách
                alert("Xóa nhà cung cấp thành công!");
            } catch (error) {
                console.error("Error deleting nha cung cap:", error);
            }
        }
    };
    // Update danh muc
    window.editNhaCC = async (id, ten_nha_cung_cap, dia_chi,so_dien_thoai,email, id_cua_hang) => {
        document.getElementById("edit-id").value = id;
        document.getElementById("edit-name").value = ten_nha_cung_cap;
        document.getElementById("edit-address").value = dia_chi;
        document.getElementById("edit-phone").value = so_dien_thoai;
        document.getElementById("edit-email").value = email;
        console.log(id_cua_hang);
        
        document.getElementById("edit-shop").value = id_cua_hang;

        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    };

    editButton.addEventListener("click", async () => {
        const id = document.getElementById("edit-id").value;
        const newTen = document.getElementById("edit-name").value.trim();
        const newDiachi = document.getElementById("edit-address").value.trim();
        const newphone = document.getElementById("edit-phone").value.trim();
        const newEmail = document.getElementById("edit-email").value.trim();
        const newCuaHang = document.getElementById("edit-shop").value.trim();
        if (!newTen) {
            toastr.error("Tên nhà cung cấp không được để trống!");
            return;s
        }
        try {
            const response = await axios.post('/admin/nha-cung-cap/update', { 
                id, 
                ten_nha_cung_cap: newTen, 
                dia_chi: newDiachi,
                so_dien_thoai: newphone,
                email: newEmail,
                id_cua_hang: newCuaHang
            });

            if (response.data.status) {
                const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
                editModal.hide();
                fetchNhaCC(currentPage);
                toastr.success(response.data.message);
            } else {
                toastr.error("Cập nhật thất bại: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating nhacungcap:", error);
            toastr.error("Có lỗi xảy ra khi cập nhật danh mục!");
        }

    })
      //----SHOW UNIT----//

    searchInput.addEventListener("input", () => {
        fetchNhaCC(1, searchInput.value);
    });

    fetchNhaCC();
});
