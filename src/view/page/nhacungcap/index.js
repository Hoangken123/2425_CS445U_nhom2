<<<<<<< HEAD
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
  
=======
    
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
>>>>>>> a564eb7929eacaf047d568ad8c16a33642ac4690
