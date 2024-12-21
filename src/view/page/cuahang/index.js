document.addEventListener("DOMContentLoaded", () => {
    const CuaHangTable = document.getElementById("cua-hang-table");
    const searchInput = document.getElementById("search-input");
    const addsavebutton = document.getElementById("add-save-button");
    const updateSaveButton = document.getElementById("edit-save-button");
  
    let currentPage = 1;
    const limit = 10;
    const LoadCuaHang = async (page = 1, search = "") => {
      try {
        const response = await axios.get("/admin/cua-hang/get-data", {
          params: { page, limit, search },
        });
        const { data, pagination: pag } = response.data;
        CuaHangTable.innerHTML = data
          .map(
            (cuahang, index) =>
              `<tr class="text-center">
                      <td>${index + 1 + (page - 1) * limit}</td>
                      <td>${cuahang.ten_cua_hang}</td>
                      <td>${cuahang.dia_chi}</td>
                      <td>
                          <button class="btn btn-primary btn-sm" onclick="editcuahang(${cuahang.id}, '${cuahang.ten_cua_hang}', '${cuahang.slug_cua_hang}' , '${cuahang.dia_chi}')">Cập Nhật</button>
                          <button class="btn btn-danger btn-sm" onclick="deletecuahang(${cuahang.id})">Xóa</button>
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
    // renderPagination
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
  
    // --KeyUp CuaHang-----
    document.getElementById("name-cuahang").addEventListener("keyup", () => {
      const ten_cua_hang = document.getElementById("name-cuahang").value.trim();
      const slug_cua_hang = document.getElementById("slug-cuahang");
  
      if (ten_cua_hang) {
        const generatedSlug = generateSlug(ten_cua_hang);
        slug_cua_hang.value = generatedSlug;
      }
    });
    // KeyUp Udate
    document.getElementById("edit-name_cuahang").addEventListener("keyup", () => {
      const ten_cua_hang = document.getElementById("edit-name_cuahang").value.trim();
      const slug_cua_hang = document.getElementById("edit-slug_cuahang");
  
      if (ten_cua_hang) {
        const generatedSlug = generateSlug(ten_cua_hang);
        slug_cua_hang.value = generatedSlug;
      }
    });
    //Search Cửa Hàng
    searchInput.addEventListener("input", () => {
      LoadCuaHang(1, searchInput.value);
    });
    //----ADD UNIT----//
    addsavebutton.addEventListener("click", async () => {
      const ten_cua_hang  = document.getElementById("name-cuahang").value.trim();
      const slug_cua_hang = document.getElementById("slug-cuahang").value.trim();
      const dia_chi       = document.getElementById("address-cuahang").value.trim();

      try {
        const response = await axios.post("/admin/cua-hang/create", {ten_cua_hang, slug_cua_hang,dia_chi});
        if (response.data.status) {
            LoadCuaHang(currentPage);
          toastr.success(response.data.message);
        } else {
          toastr.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const errorMessages = error.response.data.errors
            .map((err) => err.msg)
            .join("<br>");
          toastr.error(errorMessages);
        } else {
          console.error("Lỗi thêm mới cửa hàng:", error);
          toastr.error("Có lỗi xảy ra khi thêm cửa hàng!");
        }
      }
    });
    //----DELETE UNIT----//
    window.deletecuahang = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa cửa hàng khỏi hệ thống này?")) {
        try {
          const response = await axios.delete(`/admin/cua-hang/delete?id=${id}`);
          LoadCuaHang(currentPage);
          toastr.success(response.data.message);
        } catch (error) {
          console.error("Error deleting shop:", error);
          toastr.error("Có lỗi xảy ra khi xóa cửa hàng!");
        }
      }
    };
    // //----SHOW UNIT----//
    window.editcuahang = async (id, ten_cua_hang, slug_cua_hang,dia_chi) => {
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-name_cuahang").value = ten_cua_hang;
      document.getElementById("edit-slug_cuahang").value = slug_cua_hang;
      document.getElementById("edit-address").value = dia_chi;
      const editModal = new bootstrap.Modal(document.getElementById("editModal"));
      editModal.show();
    };
    // //---Update-UNIT--//
    updateSaveButton.addEventListener("click", async () => {
      const id            = document.getElementById("edit-id").value;
      const newNameShop  = document.getElementById("edit-name_cuahang").value.trim();
      const newSlug = document.getElementById("edit-slug_cuahang").value.trim();
      const newAddress       = document.getElementById("edit-address").value.trim();
  
      try {
        const response = await axios.put("/admin/cua-hang/update", {
          id,
          ten_cua_hang: newNameShop,
          slug_cua_hang: newSlug,
          dia_chi:newAddress
        });
  
        if (response.data.status) {
          const editModal = bootstrap.Modal.getInstance(
            document.getElementById("editModal")
          );
          editModal.hide();
  
          LoadCuaHang(currentPage);
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
          console.error("Lỗi thêm mới cửa hàng:", error);
          toastr.error("Có lỗi xảy ra khi thêm cửa hàng!");
        }
      }
    });
  
    LoadCuaHang();
  });
  