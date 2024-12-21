document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("table-body");

    const loadChiTietHoaDonBan = async () => {
        try {
            const response = await axios.get("/admin/chi-tiet-hoa-don-ban/get-data");
            const { data } = response.data;

            tbody.innerHTML = data
                .map(
                    (item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.ten_san_pham}</td>
                    <td>${item.gia_ban.toLocaleString()}</td>
                    <td>${item.so_luong}</td>
                    <td>${item.DVT || "N/A"}</td>
                    <td>${item.thanh_tien.toLocaleString()}</td>
                    <td>${item.ghi_chu || ""}</td>
                    <td>${new Date(item.ngay_ban).toLocaleDateString()}</td>
                </tr>`
                )
                .join("");
        } catch (error) {
            console.error("Lỗi load dữ liệu chi tiết hóa đơn bán:", error);
            alert("Có lỗi xảy ra khi tải dữ liệu.");
        }
    };

    loadChiTietHoaDonBan();
});
