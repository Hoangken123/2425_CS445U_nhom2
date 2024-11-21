document.addEventListener("DOMContentLoaded", () => {
    const productTable = document.getElementById("product-table");
    const searchInput = document.getElementById("search-input");
    const addsavebutton = document.getElementById("add-form");
    const updateSaveButton = document.getElementById("edit-save-button");

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
                          <button class="btn btn-primary btn-sm" onclick="editProduct(${Product.id},'${Product.hinh_anh}','${Product.ten_san_pham}','${Product.so_luong}','${Product.ten_don_vi}','${Product.gia_ban}','${Product.ten_don_vi}','${Product.ten_danh_muc || ""}')">Cập Nhật</button>
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
    // document.getElementById("edit-name-unit").addEventListener("keyup", () => {
    //   const ten_don_vi = document.getElementById("edit-name-unit").value.trim();
    //   const slug_don_vi = document.getElementById("edit-slug_unit");
  
    //   if (ten_don_vi) {
    //     const generatedSlug = generateSlug(ten_don_vi);
    //     slug_don_vi.value = generatedSlug;
    //   }
    // });
  
    searchInput.addEventListener("input", () => {
      LoadUnit(1, searchInput.value);
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

    //----DELETE UNIT----//
    window.deleteProduct = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm khỏi hệ thống này?")) {
        try {
          const response = await axios.delete(`/admin/san-pham/delete?id=${id}`);
          LoadProduct(currentPage);
          toastr.success(response.data.message);
        } catch (error) {
          console.error("Error deleting Unit:", error);
          toastr.error("Có lỗi xảy ra khi xóa sản phẩm!");
        }
      }
    };
    // //----SHOW UNIT----//
    // window.editUnit = async (id, ten_don_vi, slug_don_vi) => {
    //   document.getElementById("edit-id").value = id;
    //   document.getElementById("edit-name-unit").value = ten_don_vi;
    //   document.getElementById("edit-slug_unit").value = slug_don_vi;
  
    //   const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    //   editModal.show();
    // };
    // //---Update-UNIT--//
    // // Update UNIT
    // updateSaveButton.addEventListener("click", async () => {
    //   const id = document.getElementById("edit-id").value;
    //   const newTen = document.getElementById("edit-name-unit").value.trim();
    //   const newslug = document.getElementById("edit-slug_unit").value.trim();
  
    //   try {
    //     const response = await axios.put("/admin/don-vi/update", {
    //       id,
    //       ten_don_vi: newTen,
    //       slug_don_vi: newslug,
    //     });
  
    //     if (response.data.status) {
    //       const editModal = bootstrap.Modal.getInstance(
    //         document.getElementById("editModal")
    //       );
    //       editModal.hide();
  
    //       LoadUnit(currentPage);
    //       toastr.success(response.data.message);
    //     } else {
    //       toastr.error("Cập nhật thất bại: " + response.data.message);
    //     }
    //   } catch (error) {
    //     if (error.response && error.response.data.errors) {
    //       const errorMessages = error.response.data.errors
    //         .map((err) => err.msg)
    //         .join("<br>");
    //       toastr.error(errorMessages);
    //     } else {
    //       console.error("Lỗi thêm mới đơn vị:", error);
    //       toastr.error("Có lỗi xảy ra khi thêm đơn vị!");
    //     }
    //   }
    // });
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
