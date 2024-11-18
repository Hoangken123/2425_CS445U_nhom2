document.addEventListener("DOMContentLoaded", () => {
    const categoryTable = document.getElementById("category-table");
    const searchInput = document.getElementById("search-input");
    const addButton = document.getElementById("add-button");
    const pagination = document.getElementById("pagination");

    let currentPage = 1;
    const limit = 10;

    const fetchCategories = async (page = 1, search = "") => {
        try {
            const response = await axios.get('/admin/danh-muc/get-data', { params: { page, limit, search } });
            const { data, pagination: pag } = response.data;

            categoryTable.innerHTML = data.map((category, index) => `
                <tr>
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

    addButton.addEventListener("click", async () => {
        const ten = prompt("Nhập tên danh mục:");
        const mo_ta = prompt("Nhập mô tả danh mục:");
        if (ten) {
            try {
                await axios.post('/admin/danh-muc/create', { ten, mo_ta });
                fetchCategories(currentPage);
                alert("Thêm danh mục thành công!");
            } catch (error) {
                console.error("Error adding category:", error);
            }
        }
    });

    window.editCategory = async (id, ten, mo_ta) => {
        const newTen = prompt("Cập nhật tên danh mục:", ten);
        const newMoTa = prompt("Cập nhật mô tả danh mục:", mo_ta);
        if (newTen) {
            try {
                await axios.post('/admin/danh-muc/update', { id, ten: newTen, mo_ta: newMoTa });
                fetchCategories(currentPage);
                alert("Cập nhật danh mục thành công!");
            } catch (error) {
                console.error("Error updating category:", error);
            }
        }
    };

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
