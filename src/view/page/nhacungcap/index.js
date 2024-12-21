document.addEventListener("DOMContentLoaded", () => {
    const addSaveButton = document.getElementById("add-save-button");
    const updateSaveButton = document.getElementById("update-save-button");
    const searchInput = document.getElementById("search-input");
    let currentPage = 1;
  
    // Hàm lấy danh sách cửa hàng
    const fetchStores = async () => {
      try {
        const response = await axios.get("/admin/cua-hang/get-data");
        const stores = response.data.data;
  
        // Điền vào dropdown cửa hàng
        const addStoreSelect = document.getElementById("add-cua-hang");
        const updateStoreSelect = document.getElementById("update-cua-hang");
  
        addStoreSelect.innerHTML = "";
        updateStoreSelect.innerHTML = "";
  
        stores.forEach((store) => {
          const optionAdd = document.createElement("option");
          optionAdd.value = store.id;
          optionAdd.textContent = store.ten_cua_hang;
  
          const optionUpdate = document.createElement("option");
          optionUpdate.value = store.id;
          optionUpdate.textContent = store.ten_cua_hang;
  
          addStoreSelect.appendChild(optionAdd);
          updateStoreSelect.appendChild(optionUpdate);
        });
      } catch (error) {
        toastr.error("Lỗi khi tải danh sách cửa hàng.");
      }
    };
  
    // Hàm lấy danh sách nhà cung cấp từ backend
    const fetchSuppliers = async (page, search = "") => {
      try {
        const response = await axios.get(
          `/admin/nha-cung-cap/get-data?page=${page}&search=${search}`
        );
        const suppliers = response.data.data;
        const totalPages = Math.ceil(response.data.pagination.total / 10);
  
        renderSuppliers(suppliers);
        renderPagination(totalPages);
      } catch (error) {
        toastr.error("Lỗi khi tải danh sách nhà cung cấp.");
      }
    };
  
    // Hàm hiển thị danh sách nhà cung cấp
    const renderSuppliers = (suppliers) => {
      const tableBody = document.getElementById("supplier-table");
      tableBody.innerHTML = ""; // Xóa dữ liệu cũ
    
      suppliers.forEach((supplier, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-center">${(currentPage - 1) * 10 + (index + 1)}</td>
            <td>${supplier.ten_nha_cung_cap}</td>
            <td>${supplier.dia_chi}</td>
            <td>${supplier.so_dien_thoai}</td>
            <td>${supplier.email}</td>
            <td>${supplier.ten_chi_nhanh || "Không có cửa hàng"}</td>
            <td class="text-center">
                <button class="btn btn-warning" onclick="editSupplier(${supplier.id}, '${supplier.ten_nha_cung_cap}', '${supplier.dia_chi}', '${supplier.so_dien_thoai}', '${supplier.email}', ${supplier.id_cua_hang})">Chỉnh sửa</button>
                <button class="btn btn-danger" onclick="deleteSupplier(${supplier.id})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
      });
    };
    
  
    // Hàm hiển thị phân trang
    const renderPagination = (totalPages) => {
      const paginationContainer = document.getElementById("pagination");
      paginationContainer.innerHTML = "";
  
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = "btn btn-primary";
        pageButton.textContent = i;
        pageButton.onclick = () => {
          currentPage = i;
          fetchSuppliers(i, searchInput.value);
        };
        paginationContainer.appendChild(pageButton);
      }
    };
  
    // Thêm nhà cung cấp mới
    addSaveButton.addEventListener("click", async () => {
      const ten_nha_cung_cap = document.getElementById("add-name").value.trim();
      const dia_chi = document.getElementById("add-address").value.trim();
      const so_dien_thoai = document.getElementById("add-phone").value.trim();
      const email = document.getElementById("add-email").value.trim();
      const id_cua_hang = document.getElementById("add-cua-hang").value;
  
      if (!ten_nha_cung_cap) {
          toastr.error("Tên nhà cung cấp không được để trống!");
          return;
      }
  
      try {
          const response = await axios.post('/admin/nha-cung-cap/create', {
              ten_nha_cung_cap,
              dia_chi,
              so_dien_thoai,
              email,
              id_cua_hang
          });
  
          if (response.data.status) {
              $('#addModal').modal('hide');
              fetchSuppliers(currentPage, searchInput.value);
              toastr.success("Thêm nhà cung cấp thành công!");
          } else {
              toastr.error(response.data.message || "Thêm nhà cung cấp thất bại.");
          }
      } catch (error) {
          toastr.error("Thêm nhà cung cấp thất bại.");
      }
    });
  
    // Cập nhật nhà cung cấp
    updateSaveButton.addEventListener("click", async () => {
      const id = document.getElementById("update-id").value;
      const ten_nha_cung_cap = document.getElementById("update-name").value.trim();
      const dia_chi = document.getElementById("update-address").value.trim();
      const so_dien_thoai = document.getElementById("update-phone").value.trim();
      const email = document.getElementById("update-email").value.trim();
      const id_cua_hang = document.getElementById("update-cua-hang").value;
  
      if (!ten_nha_cung_cap) {
          toastr.error("Tên nhà cung cấp không được để trống!");
          return;
      }
  
      try {
        const response = await axios.post(`/admin/nha-cung-cap/update`, {
            id,
            ten_nha_cung_cap,
            dia_chi,
            so_dien_thoai,
            email,
            id_cua_hang
        });
        if (response.data.status) {
            $('#updateModal').modal('hide');
            fetchSuppliers(currentPage, searchInput.value);
            toastr.success("Cập nhật nhà cung cấp thành công!");
        } else {
            toastr.error(response.data.message || "Cập nhật nhà cung cấp thất bại.");
        }
    } catch (error) {
        toastr.error("Cập nhật nhà cung cấp thất bại.");
    }
    
    });
  
    // Xóa nhà cung cấp
    window.deleteSupplier = async (id) => {
      if (!id) {
          toastr.error("ID nhà cung cấp không hợp lệ.");
          return;
      }
      if (confirm("Bạn chắc chắn muốn xóa nhà cung cấp này?")) {
          try {
              const response = await axios.post(`/admin/nha-cung-cap/delete`, { id });
              if (response.data.status) {
                  fetchSuppliers(currentPage, searchInput.value);
                  toastr.success("Xóa nhà cung cấp thành công!");
              } else {
                  toastr.error(response.data.message || "Xóa nhà cung cấp thất bại.");
              }
          } catch (error) {
              toastr.error("Xóa nhà cung cấp thất bại.");
          }
      }
  };
  
  
    // Chỉnh sửa nhà cung cấp
    window.editSupplier = async (id, ten_nha_cung_cap, dia_chi, so_dien_thoai, email, id_cua_hang) => {
      // Điền dữ liệu vào modal
      document.getElementById("update-id").value = id;
      document.getElementById("update-name").value = ten_nha_cung_cap;
      document.getElementById("update-address").value = dia_chi;
      document.getElementById("update-phone").value = so_dien_thoai;
      document.getElementById("update-email").value = email;
      document.getElementById("update-cua-hang").value = id_cua_hang;
      
      // Nạp danh sách cửa hàng vào dropdown (giả sử bạn có API lấy danh sách cửa hàng)
      try {
        const response = await axios.get('/admin/cua-hang/get-data'); // API lấy danh sách cửa hàng
        if (response.data.status) {
          const stores = response.data.data;
          const storeSelect = document.getElementById('update-cua-hang');
          storeSelect.innerHTML = '<option value="">Chọn cửa hàng</option>'; // Reset lại dropdown
          stores.forEach(store => {
            const option = document.createElement('option');
            option.value = store.id;
            option.textContent = store.ten_cua_hang;
            storeSelect.appendChild(option);
          });
        } else {
          toastr.error("Lấy danh sách cửa hàng thất bại.");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        toastr.error("Lỗi khi lấy danh sách cửa hàng.");
      }
      
      // Hiển thị modal
      $("#updateModal").modal("show");
    };
  
    // Tìm kiếm nhà cung cấp
    searchInput.addEventListener("input", () => {
      fetchSuppliers(currentPage, searchInput.value);
    });
  
    // Khởi tạo khi trang được tải
    fetchStores();
    fetchSuppliers(currentPage);
  });
  