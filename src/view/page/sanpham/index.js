document.addEventListener("DOMContentLoaded", () => {
    const productTable = document.getElementById("product-table");
    const searchInput = document.getElementById("search-input");
    const addsavebutton = document.getElementById("add-form");
    const updateSaveButton = document.getElementById("edit-form");

    populateDropdowns();
    let currentPage = 1;
    const limit = 10;
    const LoadProduct = async (page = 1, search = "") => {
      try {
        const response = await axios.get("/admin/san-pham/get-data", {
          params: { page, limit, search },
        });
        const { data, pagination: pag } = response.data;
        productTable.innerHTML = data
          .map(
            (Product, index) =>
              `<tr class="text-center">
                      <td>${index + 1 + (page - 1) * limit}</td>
                      <td>
                          <img src="${Product.hinh_anh}" alt="${Product.ten_san_pham}" style="width: 50px; height: 50px; object-fit: cover;" />
                      </td>
                      <td>${Product.ten_san_pham}</td>
                      <td>${Product.han_su_dung}</td>
                      <td>${Product.so_luong}</td>
                      <td>${Product.gia_ban}</td>
                      <td>${Product.ten_don_vi}</td>
                      <td>${Product.ten_danh_muc}</td>
                      <td>
                          <button class="btn btn-primary btn-sm" onclick="editProduct(${Product.id},'${Product.ten_san_pham}','${Product.han_su_dung}','${Product.so_luong}','${Product.gia_ban}','${Product.id_don_vi}','${Product.id_danh_muc || ""}')">Cập Nhật</button>
                          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${Product.id})">Xóa</button>
                      </td>
                  </tr>
          `
          )
          .join("");
        renderPagination(pag.total, pag.page, pag.limit);
      } catch (error) {
        console.error("Lỗi load trang:", error);
      }
    };
  
    const renderPagination = (total, page, limit) => {
      const totalPages = Math.ceil(total / limit);
      pagination.innerHTML = Array.from(
        { length: totalPages },
        (_, i) => `
          <button class="btn ${
            i + 1 === page ? "btn-primary" : "btn-secondary"
          } btn-sm mx-1"
              onclick="LoadUnit(${i + 1}, searchInput.value)">
              ${i + 1}
          </button>
      `
      ).join("");
    };
  
    // To-Slug
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ/g, "a")
        .replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, "e")
        .replace(/í|ì|ị|ỉ|ĩ/g, "i")
        .replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ/g, "o")
        .replace(/ú|ù|ụ|ủ|ũ|ư|ứ|ừ|ự|ử|ữ/g, "u")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    };
  
    // --KeyUp prodcut-----
    document.getElementById("ten_san_pham").addEventListener("keyup", () => {
      const ten_san_pham = document.getElementById("ten_san_pham").value.trim();
      const slug_san_pham = document.getElementById("slug_san_pham");
  
      if (ten_san_pham) {
        const generatedSlug = generateSlug(ten_san_pham);
        slug_san_pham.value = generatedSlug;
      }
    });
    // // --KeyUp Udate---//
    document.getElementById("edit_ten_san_pham").addEventListener("keyup", () => {
      const ten_don_vi = document.getElementById("edit_ten_san_pham").value.trim();
      const slug_don_vi = document.getElementById("edit_slug_san_pham");
  
      if (ten_don_vi) {
        const generatedSlug = generateSlug(ten_don_vi);
        slug_don_vi.value = generatedSlug;
      }
    });
  
    searchInput.addEventListener("input", () => {
      LoadProduct(1, searchInput.value);
    });
    //----ADD PRODUCT----//
    addsavebutton.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const ten_san_pham = formData.get('ten_san_pham');
            const generatedSlug = generateSlug(ten_san_pham);
            formData.set('slug_san_pham', generatedSlug);
      try {
          const response = await axios.post('/admin/san-pham/create', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
  
          if (response.data.status) {
               LoadProduct(currentPage);
              toastr.success(response.data.message);
          } else {
            toastr.error(response.data.message || 'Thêm sản phẩm thất bại!');
          }
      } catch (error) {
          toastr.error('Lỗi thêm sản phẩm:', error);
          toastr.error('Đã xảy ra lỗi trong quá trình thêm sản phẩm!');
      }
    });

    //----DELETE PRODUCT----//
    window.deleteProduct = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm khỏi hệ thống này?")) {
        try {
          const response = await axios.delete(`/admin/san-pham/delete?id=${id}`);
          LoadProduct(currentPage);
          toastr.success(response.data.message);
        } catch (error) {
          console.error("Error deleting Product:", error);
          toastr.error("Có lỗi xảy ra khi xóa sản phẩm!");
        }
      }
    };
    // //----SHOW PRODUCT----//
    window.editProduct = async (id, ten_san_pham,han_su_dung,so_luong,gia_ban,id_don_vi,id_danh_muc) => {
      document.getElementById("edit-id").value = id;
      document.getElementById("edit_ten_san_pham").value = ten_san_pham;
      document.getElementById("edit_han_su_dung").value = han_su_dung;
      document.getElementById("edit_so_luong").value = so_luong;
      document.getElementById("edit_gia_ban").value = gia_ban;
      document.getElementById("edit_id_don_vi").value = id_don_vi;
      document.getElementById("edit_id_danh_muc").value = id_danh_muc;
      const editModal = new bootstrap.Modal(document.getElementById("editModal"));
      editModal.show();
    };

    //---Update-PRODUCT--//
    updateSaveButton.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const ten_san_pham = formData.get('edit_ten_san_pham');
            const generatedSlug = generateSlug(ten_san_pham);
            formData.set('edit_slug_san_pham', generatedSlug);
      try {
          const response = await axios.post('/admin/san-pham/update', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
  
          if (response.data.status) {
               LoadProduct(currentPage);
              toastr.success(response.data.message);
          } else {
            toastr.error(response.data.message || 'Cập nhật sản phẩm thất bại!');
          }
      } catch (error) {
          toastr.error('Lỗi cập nhật sản phẩm:', error);
          toastr.error('Đã xảy ra lỗi trong quá trình Cập nhật sản phẩm!');
      }
    });
    LoadProduct();
  });


// Code CHATGPT
 async function populateDropdowns() {
    // Populate Don Vi
    try {
      const donViResponse = await fetch('/admin/don-vi/get-data');
      const donViResult = await donViResponse.json();
      if (donViResult.status) {
        const donViDropdown = document.getElementById('id_don_vi');
        donViDropdown.innerHTML = '<option value="0">Vui lòng chọn đơn vị</option>'; 
        donViResult.data.forEach((donVi) => {
          const option = document.createElement('option');
          option.value = donVi.id;
          option.textContent = donVi.ten_don_vi;
          donViDropdown.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error loading units:", error);
    }
  
    // Populate Danh Muc
    try {
      const danhMucResponse = await fetch('/admin/danh-muc/get-data');
      const danhMucResult = await danhMucResponse.json();
      if (danhMucResult.status) {
        const danhMucDropdown = document.getElementById('id_danh_muc');
        danhMucDropdown.innerHTML = '<option value="0">Vui lòng chọn Danh Mục</option>'; 
        danhMucResult.data.forEach((danhMuc) => {
          const option = document.createElement('option');
          option.value = danhMuc.id;
          option.textContent = danhMuc.ten;
          danhMucDropdown.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }
