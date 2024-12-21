document.addEventListener("DOMContentLoaded", function () {
  loadKhoThuoc();

  // Load danh sách kho thuốc
  async function loadKhoThuoc() {
    try {
      const res = await fetch("/admin/kho-thuoc/get-data");
      const { data } = await res.json();

      const tbody = document.getElementById("table-body");

      tbody.innerHTML = data
        .map(
          (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.ten_san_pham || "N/A"}</td> <!-- Sửa key -->
          <td>${item.ten_nha_cung_cap || "N/A"}</td> <!-- Sửa key -->
          <td>${item.so_luong}</td>
          <td>${item.don_gia_nhap}</td>
          <td>${item.thanh_tien}</td>
          <td>${item.ghi_chu || ""}</td>
          <td>
            <button class="btn btn-warning btn-sm" 
              onclick="editKhoThuoc(${item.id}, '${item.id_san_pham}', '${
            item.id_nha_cung_cap
          }', ${item.so_luong}, ${item.don_gia_nhap}, '${item.ghi_chu || ""}')">
              Sửa
            </button>
            <button class="btn btn-danger btn-sm" 
              onclick="deleteKhoThuoc(${item.id})">
              Xóa
            </button>
          </td>
        </tr>`
        )
        .join("");
    } catch (error) {
      console.error("Lỗi khi tải danh sách kho thuốc:", error);
      alert("Không thể tải dữ liệu kho thuốc!");
    }
  }

  // Mở modal thêm mới
  window.openAddModal = () => {
    document.getElementById("formKhoThuoc").reset();
    document.getElementById("id").value = "";
    document.getElementById("modalTitle").textContent = "Thêm Thuốc";
    new bootstrap.Modal(document.getElementById("modalKhoThuoc")).show();
  };

  // Mở modal chỉnh sửa
  window.editKhoThuoc = (
    id,
    id_san_pham,
    id_nha_cung_cap,
    so_luong,
    don_gia_nhap,
    ghi_chu
  ) => {
    document.getElementById("id").value = id;
    document.getElementById("id_san_pham").value = id_san_pham;
    document.getElementById("id_nha_cung_cap").value = id_nha_cung_cap;
    document.getElementById("so_luong").value = so_luong;
    document.getElementById("don_gia_nhap").value = don_gia_nhap;
    document.getElementById("ghi_chu").value = ghi_chu;

    document.getElementById("modalTitle").textContent = "Chỉnh Sửa Thuốc";
    new bootstrap.Modal(document.getElementById("modalKhoThuoc")).show();
  };

  // Xóa kho thuốc
  window.deleteKhoThuoc = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
      await fetch(`/admin/kho-thuoc/delete/${id}`, { method: "DELETE" });
      loadKhoThuoc();
    }
  };

  // Thêm hoặc cập nhật kho thuốc
  document
    .getElementById("formKhoThuoc")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("id").value;
      const payload = {
        id_san_pham: document.getElementById("id_san_pham").value,
        id_nha_cung_cap: document.getElementById("id_nha_cung_cap").value,
        so_luong: document.getElementById("so_luong").value,
        don_gia_nhap: document.getElementById("don_gia_nhap").value,
        ghi_chu: document.getElementById("ghi_chu").value,
      };

      const url = id
        ? `/admin/kho-thuoc/update/${id}`
        : "/admin/kho-thuoc/create";
      const method = id ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      bootstrap.Modal.getInstance(
        document.getElementById("modalKhoThuoc")
      ).hide();
      loadKhoThuoc();
    });
});
