document.addEventListener("DOMContentLoaded", () => {
    const categoryTable = document.getElementById("category-table");
    const searchInput = document.getElementById("search-input");
    const pagination = document.getElementById("pagination");
    const addsavebutton = document.getElementById("add-save-button");
    const updateSaveButton = document.getElementById("edit-save-button");

    let currentPage = 1;
    const limit = 10;

    const fetchCategories = async (page = 1, search = "") => {
        try {
            const response = await axios.get('/admin/khach-hang/get-data', { params: { page, limit, search } });
            const { data, pagination: pag } = response.data;

            categoryTable.innerHTML = data.map((category, index) => `
                <tr class="text-center">
                    <td>${index + 1 + (page - 1) * limit}</td>
                    <td>${category.ten_khach_hang}</td>
                    <td>${category.so_dien_thoai}</td>
                    <td>${category.email}</td>
                    <td>${category.tong_mua}</td>
                    <td>${category.dia_chi}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id_khach_hang}, '${category.ten_khach_hang}', '${category.dia_chi}', '${category.so_dien_thoai}',  '${category.email || ''}')">Cập Nhật</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id_khach_hang})">Xóa</button>
                    </td>
                </tr>
            `).join('');

            renderPagination(pag.total, pag.page, pag.limit);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const renderPagination = (total, page, limit) => {
        const totalPages = Math.ceil(total / limit);
        pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <button class="btn ${i + 1 === page ? 'btn-primary' : 'btn-secondary'} btn-sm mx-1"
                onclick="fetchCategories(${i + 1}, searchInput.value)">
                ${i + 1}
            </button>
        `).join('');
    };

    // Thêm mới khách hàng
    addsavebutton.addEventListener("click", async () => {
        const ten_khach_hang = document.getElementById("add-name").value.trim();
        const dia_chi = document.getElementById("add-address").value.trim();
        const so_dien_thoai = document.getElementById("add-tel").value.trim();
        const email = document.getElementById("add-email").value.trim();

        if (!ten_khach_hang) {
            toastr.error("Tên khách hàng không được để trống!");
            return;
        }
        console.log({ten_khach_hang, dia_chi, so_dien_thoai, email});
        
        try {
            const response = await axios.post('/admin/khach-hang/create', { ten_khach_hang, dia_chi, so_dien_thoai, email });
            if (response.data.status) {
                toastr.success(response.data.message);
                fetchCategories(currentPage);
            } else {
                toastr.error(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi thêm mới khách hàng", error);
            toastr.error("Có lỗi xảy ra khi thêm khách hàng!");
        }
    });

    // Sửa thông tin khách hàng
    window.editCategory = async (id_khach_hang, ten_khach_hang, dia_chi, so_dien_thoai, email) => {
        document.getElementById("edit-id").value = id_khach_hang;
        document.getElementById("edit-name").value = ten_khach_hang;
        document.getElementById("edit-address").value = dia_chi;
        document.getElementById("edit-tel").value = so_dien_thoai;
        document.getElementById("edit-email").value = email;

        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    };

    updateSaveButton.addEventListener("click", async () => {
        const id = document.getElementById("edit-id").value;
        const newTenKhachHang = document.getElementById("edit-name").value.trim();
        const newDiaChi = document.getElementById("edit-address").value.trim();
        const newSoDienThoai = document.getElementById("edit-tel").value.trim();
        const newEmail = document.getElementById("edit-email").value.trim();
        console.log({
            id,
            ten_khach_hang: newTenKhachHang,
            dia_chi: newDiaChi,
            so_dien_thoai: newSoDienThoai,
            email: newEmail
        });
        
        if (!newTenKhachHang) {
            toastr.error("Tên khách hàng không được để trống!");
            return;
        }

        try {
            const response = await axios.put(`/admin/khach-hang/update/${id}`, {
                ten_khach_hang: newTenKhachHang,
                dia_chi: newDiaChi,
                so_dien_thoai: newSoDienThoai,
                email: newEmail
            });

            if (response.data.status) {
                const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
                editModal.hide();
                fetchCategories(currentPage);
                toastr.success(response.data.message);
            } else {
                toastr.error("Cập nhật thất bại: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            toastr.error("Có lỗi xảy ra khi cập nhật khách hàng!");
        }
    });

    // Xóa khách hàng
    window.deleteCategory = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            try {
                await axios.delete(`/admin/khach-hang/delete/${id}`);
                fetchCategories(currentPage);
                alert("Xóa khách hàng thành công!");
            } catch (error) {
                console.error("Error deleting customer:", error);
                alert("Có lỗi xảy ra khi xóa khách hàng!");
            }
        }
    };

    // Tìm kiếm khách hàng
    searchInput.addEventListener("input", () => {
        fetchCategories(currentPage, searchInput.value);
    });

    fetchCategories();
});
