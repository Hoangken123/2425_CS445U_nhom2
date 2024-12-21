document.addEventListener("DOMContentLoaded", function () {
    const listNhapKho = document.getElementById("listNhapKho");
    const formNhapKho = document.getElementById("formNhapKho");
    const btnThemMoi = document.getElementById("btnThemMoi");
    const maNhapKhoField = document.getElementById("ma_nhap_kho");
  
    // Mảng lưu danh sách đơn nhập kho
    let danhSachNhapKho = [];
  
    // Hàm lấy mã nhập kho mới từ API
    const getNewMaNhapKho = async () => {
      try {
        const response = await fetch('/api/get-new-ma-nhap-kho');
        const data = await response.json();
        if (data && data.ma_nhap_kho) {
          return data.ma_nhap_kho;
        }
        return 'NK-2024-001'; // Mã mặc định nếu không lấy được từ API
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return 'NK-2024-001'; // Mã mặc định nếu có lỗi
      }
    };
  
    // Hàm hiển thị danh sách đơn nhập kho
    const renderDanhSachNhapKho = () => {
      listNhapKho.innerHTML = danhSachNhapKho
        .map(
          (item, index) => `
          <tr>
            <td class="text-center">${index + 1}</td>
            <td>${item.ma_nhap_kho}</td>
            <td>${item.nguoi_nhap}</td>
            <td>${item.tong_tien}</td>
            <td class="text-center">
              <button class="btn btn-warning btn-sm" onclick="suaDonNhapKho(${index})">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="xoaDonNhapKho(${index})">Xóa</button>
            </td>
          </tr>`
        )
        .join("");
    };
  
    // Hàm xử lý thêm mới đơn nhập kho
    btnThemMoi.addEventListener("click", async () => {
      const maNhapKho = maNhapKhoField.value;
      const thue = document.getElementById("thue").value;
      const idUser = document.getElementById("id_user").value;
      const tongTien = document.getElementById("tong_tien").value;
  
      if (!maNhapKho || !thue || !idUser || !tongTien) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      }
  
      // Tạo đơn nhập kho mới
      const donNhapKho = {
        ma_nhap_kho: maNhapKho,
        nguoi_nhap: idUser,
        tong_tien: tongTien,
        thue: thue,
      };
  
      // Thêm vào danh sách đơn nhập kho
      danhSachNhapKho.push(donNhapKho);
      renderDanhSachNhapKho();
  
      // Reset form
      formNhapKho.reset();
  
      // Cập nhật lại mã nhập kho tự động
      maNhapKhoField.value = await getNewMaNhapKho();
    });
  
    // Hàm xử lý xóa đơn nhập kho
    window.xoaDonNhapKho = (index) => {
      const confirmDelete = confirm("Bạn có chắc muốn xóa đơn này?");
      if (confirmDelete) {
        danhSachNhapKho.splice(index, 1);
        renderDanhSachNhapKho();
      }
    };
  
    // Hàm xử lý sửa đơn nhập kho
    window.suaDonNhapKho = (index) => {
      const donNhapKho = danhSachNhapKho[index];
      document.getElementById("ma_nhap_kho").value = donNhapKho.ma_nhap_kho;
      document.getElementById("thue").value = donNhapKho.thue;
      document.getElementById("id_user").value = donNhapKho.nguoi_nhap;
      document.getElementById("tong_tien").value = donNhapKho.tong_tien;
  
      // Sau khi sửa, xóa đơn cũ và thêm đơn mới vào danh sách
      danhSachNhapKho.splice(index, 1);
      renderDanhSachNhapKho();
    };
  
    // Hiển thị mã nhập kho mới khi trang được tải
    (async () => {
      const newMaNhapKho = await getNewMaNhapKho();
      maNhapKhoField.value = newMaNhapKho;
    })();
  
    // Hiển thị danh sách đơn nhập kho
    renderDanhSachNhapKho();
  });
  