document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
    const unitTable = document.getElementById("unit-table");
    const searchInput = document.getElementById("search-input");
    const addsavebutton = document.getElementById("add-save-button");
    const updateSaveButton = document.getElementById("edit-save-button");
  
    let currentPage = 1;
    const limit = 10;
    const LoadUnit = async (page = 1, search = "") => {
      try {
        const response = await axios.get("/admin/don-vi/get-data", {
          params: { page, limit, search },
        });
        const { data, pagination: pag } = response.data;
        unitTable.innerHTML = data
          .map(
            (unit, index) =>
              `<tr class="text-center">
                      <td>${index + 1 + (page - 1) * limit}</td>
                      <td>${unit.ten_don_vi}</td>
                      <td>
                          <button class="btn btn-primary btn-sm" onclick="editUnit(${
                            unit.id
                          }, '${unit.ten_don_vi}', '${
                unit.slug_don_vi || ""
              }')">Cập Nhật</button>
                          <button class="btn btn-danger btn-sm" onclick="deleteUnit(${
                            unit.id
                          })">Xóa</button>
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
  
    // --KeyUp UNIT-----
    document.getElementById("name-unit").addEventListener("keyup", () => {
      const ten_don_vi = document.getElementById("name-unit").value.trim();
      const slug_don_vi = document.getElementById("slug-unit");
  
      if (ten_don_vi) {
        const generatedSlug = generateSlug(ten_don_vi);
        slug_don_vi.value = generatedSlug;
      }
    });
    // --KeyUp Udate---//
    document.getElementById("edit-name-unit").addEventListener("keyup", () => {
      const ten_don_vi = document.getElementById("edit-name-unit").value.trim();
      const slug_don_vi = document.getElementById("edit-slug_unit");
  
      if (ten_don_vi) {
        const generatedSlug = generateSlug(ten_don_vi);
        slug_don_vi.value = generatedSlug;
      }
    });
  
    searchInput.addEventListener("input", () => {
      LoadUnit(1, searchInput.value);
    });
    //----ADD UNIT----//
    addsavebutton.addEventListener("click", async () => {
      const ten_don_vi = document.getElementById("name-unit").value.trim();
      const slug_don_vi = document.getElementById("slug-unit").value.trim();
      try {
        const response = await axios.post("/admin/don-vi/create", {
          ten_don_vi,
          slug_don_vi,
        });
        if (response.data.status) {
          toastr.success(response.data.message);
          LoadUnit(currentPage);
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
          console.error("Lỗi thêm mới đơn vị:", error);
          toastr.error("Có lỗi xảy ra khi thêm đơn vị!");
        }
      }
    });
    //----DELETE UNIT----//
    window.deleteUnit = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa đơn vị khỏi hệ thống này?")) {
        try {
          const response = await axios.delete(`/admin/don-vi/delete?id=${id}`);
          LoadUnit(currentPage);
          toastr.success(response.data.message);
        } catch (error) {
          console.error("Error deleting Unit:", error);
          toastr.error("Có lỗi xảy ra khi xóa đơn vị!");
        }
      }
    };
    //----SHOW UNIT----//
    window.editUnit = async (id, ten_don_vi, slug_don_vi) => {
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-name-unit").value = ten_don_vi;
      document.getElementById("edit-slug_unit").value = slug_don_vi;
  
      const editModal = new bootstrap.Modal(document.getElementById("editModal"));
      editModal.show();
    };
    //---Update-UNIT--//
    // Update UNIT
    updateSaveButton.addEventListener("click", async () => {
      const id = document.getElementById("edit-id").value;
      const newTen = document.getElementById("edit-name-unit").value.trim();
      const newslug = document.getElementById("edit-slug_unit").value.trim();
  
      try {
        const response = await axios.put("/admin/don-vi/update", {
          id,
          ten_don_vi: newTen,
          slug_don_vi: newslug,
        });
  
        if (response.data.status) {
          const editModal = bootstrap.Modal.getInstance(
            document.getElementById("editModal")
          );
          editModal.hide();
  
          LoadUnit(currentPage);
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
          console.error("Lỗi thêm mới đơn vị:", error);
          toastr.error("Có lỗi xảy ra khi thêm đơn vị!");
        }
      }
    });
  
    LoadUnit();
  });
  
=======
  const unitTable = document.getElementById("unit-table");
  const searchInput = document.getElementById("search-input");
  const addsavebutton = document.getElementById("add-save-button");
  const updateSaveButton = document.getElementById("edit-save-button");

  let currentPage = 1;
  const limit = 10;
  const LoadUnit = async (page = 1, search = "") => {
    try {
      const response = await axios.get("/admin/don-vi/get-data", {
        params: { page, limit, search },
      });
      const { data, pagination: pag } = response.data;
      unitTable.innerHTML = data
        .map(
          (unit, index) =>
            `<tr class="text-center">
                    <td>${index + 1 + (page - 1) * limit}</td>
                    <td>${unit.ten_don_vi}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editUnit(${
                          unit.id
                        }, '${unit.ten_don_vi}', '${
              unit.slug_don_vi || ""
            }')">Cập Nhật</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUnit(${
                          unit.id
                        })">Xóa</button>
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

  // --KeyUp UNIT-----
  document.getElementById("name-unit").addEventListener("keyup", () => {
    const ten_don_vi = document.getElementById("name-unit").value.trim();
    const slug_don_vi = document.getElementById("slug-unit");

    if (ten_don_vi) {
      const generatedSlug = generateSlug(ten_don_vi);
      slug_don_vi.value = generatedSlug;
    }
  });
  // --KeyUp Udate---//
  document.getElementById("edit-name-unit").addEventListener("keyup", () => {
    const ten_don_vi = document.getElementById("edit-name-unit").value.trim();
    const slug_don_vi = document.getElementById("edit-slug_unit");

    if (ten_don_vi) {
      const generatedSlug = generateSlug(ten_don_vi);
      slug_don_vi.value = generatedSlug;
    }
  });

  searchInput.addEventListener("input", () => {
    LoadUnit(1, searchInput.value);
  });
  //----ADD UNIT----//
  addsavebutton.addEventListener("click", async () => {
    const ten_don_vi = document.getElementById("name-unit").value.trim();
    const slug_don_vi = document.getElementById("slug-unit").value.trim();
    try {
      const response = await axios.post("/admin/don-vi/create", {
        ten_don_vi,
        slug_don_vi,
      });
      if (response.data.status) {
        toastr.success(response.data.message);
        LoadUnit(currentPage);
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
        console.error("Lỗi thêm mới đơn vị:", error);
        toastr.error("Có lỗi xảy ra khi thêm đơn vị!");
      }
    }
  });
  //----DELETE UNIT----//
  window.deleteUnit = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn vị khỏi hệ thống này?")) {
      try {
        const response = await axios.delete(`/admin/don-vi/delete?id=${id}`);
        LoadUnit(currentPage);
        toastr.success(response.data.message);
      } catch (error) {
        console.error("Error deleting Unit:", error);
        toastr.error("Có lỗi xảy ra khi xóa đơn vị!");
      }
    }
  };
  //----SHOW UNIT----//
  window.editUnit = async (id, ten_don_vi, slug_don_vi) => {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-name-unit").value = ten_don_vi;
    document.getElementById("edit-slug_unit").value = slug_don_vi;

    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
  };
  //---Update-UNIT--//
  // Update UNIT
  updateSaveButton.addEventListener("click", async () => {
    const id = document.getElementById("edit-id").value;
    const newTen = document.getElementById("edit-name-unit").value.trim();
    const newslug = document.getElementById("edit-slug_unit").value.trim();

    try {
      const response = await axios.put("/admin/don-vi/update", {
        id,
        ten_don_vi: newTen,
        slug_don_vi: newslug,
      });

      if (response.data.status) {
        const editModal = bootstrap.Modal.getInstance(
          document.getElementById("editModal")
        );
        editModal.hide();

        LoadUnit(currentPage);
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
        console.error("Lỗi thêm mới đơn vị:", error);
        toastr.error("Có lỗi xảy ra khi thêm đơn vị!");
      }
    }
  });

  LoadUnit();
});
>>>>>>> a564eb7929eacaf047d568ad8c16a33642ac4690
