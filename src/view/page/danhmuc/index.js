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
            const response = await axios.get('/admin/danh-muc/get-data', { params: { page, limit, search } });
            const { data, pagination: pag } = response.data;

            categoryTable.innerHTML = data.map((category, index) => `
                <tr class="text-center">
                    <td>${index + 1 + (page - 1) * limit}</td>
                    <td>${category.ten}</td>
                    <td>${category.mo_ta || ''}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id}, '${category.ten}', '${category.mo_ta || ''}')">Cập Nhật</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Xóa</button>
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
    //add-DanhMuc 
    addsavebutton.addEventListener("click", async () => {
        const ten = document.getElementById("add-name").value.trim();
        const mo_ta = document.getElementById("add-description").value.trim();

        if (!ten) {
            toastr.error("Tên danh mục không được để trống!");
            return;
        }
        try {
            const response = await axios.post('/admin/danh-muc/create', { ten, mo_ta });

            if (response.data.status) {
                toastr.success(response.data.message);
                fetchCategories(currentPage); 
            } else {
                toastr.error(response.data.message);
            }
        } catch (error) {
            console.error("lỗi thêm mới Danh Mục", error);
            toastr.error("Có lỗi xảy ra khi thêm danh mục!");
        }
    });

    //Edit
    window.editCategory = async (id, ten, mo_ta) => {
        document.getElementById("edit-id").value = id;
        document.getElementById("edit-name").value = ten;
        document.getElementById("edit-description").value = mo_ta;

        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    };

    updateSaveButton.addEventListener("click", async () => {
        const id = document.getElementById("edit-id").value;
        const newTen = document.getElementById("edit-name").value.trim();
        const newMoTa = document.getElementById("edit-description").value.trim();
        if (!newTen) {
            toastr.error("Tên danh mục không được để trống!");
            return;
        }
        try {
            const response = await axios.post('/admin/danh-muc/update', { id, ten: newTen, mo_ta: newMoTa });

            if (response.data.status) {
                const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
                editModal.hide();

                // Tải lại danh sách danh mục
                fetchCategories(currentPage);

                toastr.success(response.data.message);
            } else {
                toastr.error("Cập nhật thất bại: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating category:", error);
            toastr.error("Có lỗi xảy ra khi cập nhật danh mục!");
        }

    })

    // DELETE//
    window.deleteCategory = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await axios.post('/admin/danh-muc/delete', { id });
                fetchCategories(currentPage);
                alert("Xóa danh mục thành công!");
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    searchInput.addEventListener("input", () => {
        fetchCategories(1, searchInput.value);
    });

    fetchCategories();
});
