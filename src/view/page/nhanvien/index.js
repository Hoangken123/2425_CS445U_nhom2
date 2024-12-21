document.addEventListener("DOMContentLoaded", () => {
  const EmployeeTable = document.getElementById("employee-table");
  const searchInput = document.getElementById("search-input");
  const updateSaveButton = document.getElementById("edit-save-button");
  const pagination = document.getElementById("pagination");
  let currentPage = 1;
  const limit = 10;

  // Load Employee
  const LoadEmployee = async (page = 1, search = "") => {
    try {
      const response = await axios.get("/admin/nhan-vien/get-data", {
        params: { page, limit, search },
      });
      const { data, pagination: pag } = response.data;
      EmployeeTable.innerHTML = data
        .map(
          (Employee, index) =>
            `<tr class="text-center">
                    <td>${index + 1 + (page - 1) * limit}</td>
                    <td>${Employee.ten_hien_thi}</td>
                    <td>${Employee.so_dien_thoai}</td>
                    <td>${Employee.email}</td>
                    <td>${Employee.ten_cua_hang ? Employee.ten_cua_hang : 'Chưa quản lý cửa hàng'}</td>
                    <td>${Employee.day_off}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editEmployee(${Employee.id}, '${Employee.ten_hien_thi}', '${Employee.so_dien_thoai}', '${Employee.email}', '${Employee.id_cua_hang}', '${Employee.day_off}')">Cập Nhật</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${Employee.id})">Xóa</button>
                    </td>
                </tr>`
        )
        .join("");
      renderPagination(pag.total, pag.page, pag.limit);
    } catch (error) {
      console.error("Lỗi load nhân viên:", error);
    }
  };

  // Pagination
  const renderPagination = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
      <button class="btn ${i + 1 === page ? "btn-primary" : "btn-secondary"} btn-sm mx-1" onclick="LoadEmployee(${i + 1}, searchInput.value)">
        ${i + 1}
      </button>
    `).join("");
  };

  searchInput.addEventListener("input", () => {
    LoadEmployee(1, searchInput.value);
  });

  // Delete Employee
  window.deleteEmployee = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên khỏi hệ thống này?")) {
      try {
        const response = await axios.delete(`/admin/nhan-vien/delete?id=${id}`);
        LoadEmployee(currentPage);
        toastr.success(response.data.message);
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        toastr.error("Có lỗi xảy ra khi xóa nhân viên!");
      }
    }
  };

  // Edit Employee
  window.editEmployee = async (id, ten_hien_thi, so_dien_thoai, email, id_cua_hang, day_off) => {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit_name_employee").value = ten_hien_thi;
    document.getElementById("edit_phone_employee").value = so_dien_thoai;
    document.getElementById("edit_email_employee").value = email;

    await populateDropdowns();

    const dropdown = document.getElementById("edit_id_cua_hang");
    dropdown.value = id_cua_hang || "0";

    document.getElementById("edit_day_off").value = day_off;

    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
  };

  // Update Employee
  updateSaveButton.addEventListener("click", async () => {
    const id = document.getElementById("edit-id").value;
    const newTen = document.getElementById("edit_name_employee").value.trim();
    const newPhone = document.getElementById("edit_phone_employee").value.trim();
    const newEmail = document.getElementById("edit_email_employee").value.trim();
    const newCuaHang = document.getElementById("edit_id_cua_hang").value.trim();

    try {
      const response = await axios.put("/admin/nhan-vien/update", {
        id,
        ten_hien_thi: newTen,
        so_dien_thoai: newPhone,
        email: newEmail,
        id_cua_hang: newCuaHang,
      });

      if (response.data.status) {
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        editModal.hide();

        LoadEmployee(currentPage);
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
        toastr.error("Có lỗi xảy ra khi cập nhật!");
      }
    }
  });

  // Populate Cửa hàng Dropdown
  const populateDropdowns = async () => {
    const response = await axios.get("/admin/nhan-vien/get-cua-hang");
    const dropdown = document.getElementById("edit_id_cua_hang");
    dropdown.innerHTML = response.data
      .map(
        (store) =>
          `<option value="${store.id}">${store.ten_cua_hang}</option>`
      )
      .join("");
  };

  // Initial load
  LoadEmployee();
});
