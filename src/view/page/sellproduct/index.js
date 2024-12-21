document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("product-search");
  const productList = document.getElementById("product-list");
  const listTable = document.getElementById("list-table");
  const addToinvoice = document.getElementById("addToinvoice");
  const creditPay = document.getElementById("btn-credit-pay")
  const payAndPrintBill = document.getElementById("btn-pay-and-print-bill")
  const pay = document.getElementById("btn-pay")
  const saveTempBill = document.getElementById("btn-save-temp-bill")
  const deleteBill = document.getElementById("btn-delete-bill")
  let products = [];

  const LoadProduct = async () => {
      try {
          const response = await axios.get("/admin/san-pham/get-data");
          products = response.data.data.map(item => ({
              id: item.id,
              name: item.ten_san_pham,
              unit: item.ten_don_vi,
              stock: item.so_luong,
              price: item.gia_ban,
          }));
      } catch (error) {
          console.error("Lỗi load sản phẩm:", error);
      }
  };

  addToinvoice.addEventListener("click", () => {
      try {
          const idProduct = document.getElementById("codeProduct").value.trim();
          const nameProduct = searchInput.value.trim();
          const quantity = parseInt(document.getElementById("so_luong").value) || 1;
          const UnitsOfCalculation = document.getElementById("id_don_vi").value.trim();
          const UnitPrice = parseFloat(document.getElementById("don_gia").value.trim()) || 0;

          const totalAmount = quantity * UnitPrice;

          // Validate inputs
          if (!nameProduct) {
              alert("Vui lòng chọn sản phẩm");
              return;
          }

          if (quantity <= 0) {
              alert("Số lượng phải lớn hơn 0");
              return;
          }

          // Update total amount field
          document.getElementById("thanh_tien").value = totalAmount;

          // Add product to the list table
          const listTable = document.getElementById("list-table");
          if (!listTable) {
              console.error("List table not found");
              return;
          }

          const newRow = document.createElement("tr");
          newRow.className = "text-center";
          newRow.innerHTML = `
              <td>${listTable.rows.length + 1}</td>
              <td>${nameProduct}</td>
              <td>${UnitPrice.toLocaleString()}</td>
              <td>${quantity}</td>
              <td>${UnitsOfCalculation}</td>
              <td>${totalAmount.toLocaleString()}</td>
          `;
          listTable.appendChild(newRow);

          // Reset input fields after adding
          searchInput.value = "";
          document.getElementById("so_luong").value = "0";
          document.getElementById("thanh_tien").value = "0";
          document.getElementById("codeProduct").value = "";
          document.getElementById("id_don_vi").value = "";
          document.getElementById("ton").value = "";
          document.getElementById("don_gia").value = "0";

          

      } catch (error) {
          console.error("Error adding product to invoice:", error);
          alert("Có lỗi xảy ra khi thêm sản phẩm");
      }
  });

  searchInput.addEventListener("input", function () {
      const query = this.value.trim().toLowerCase();
      if (query) {
          const filteredProducts = products.filter(product =>
              product.name && product.name.toLowerCase().includes(query)
          );

          productList.innerHTML = "";

          if (filteredProducts.length > 0) {
              productList.style.display = "block";
              filteredProducts.forEach(product => {
                  const listItem = document.createElement("li");
                  listItem.className = "list-group-item";
                  listItem.textContent = product.name;

                  listItem.addEventListener("click", () => {
                      searchInput.value = product.name;
                      document.getElementById("id_don_vi").value = product.unit || "N/A";
                      document.getElementById("ton").value = product.stock || "0";
                      document.getElementById("don_gia").value = product.price || "0";
                      document.getElementById("codeProduct").value = product.id || "0";

                      productList.style.display = "none";
                  });
                  productList.appendChild(listItem);
              });
          } else {
              productList.style.display = "none";
          }
      } else {
          productList.style.display = "none";
      }
  });

  pay.addEventListener("click", async () => {
      try {
          const products = Array.from(listTable.rows).map(row => {
              const cells = row.cells;
              return {
                  ten_san_pham: cells[1].textContent,
                  gia_ban: parseFloat(cells[2].textContent.replace(/,/g, '')),
                  so_luong: parseInt(cells[3].textContent),
                  DVT: cells[4].textContent,
                  thanh_tien: parseFloat(cells[5].textContent.replace(/,/g, ''))
              };
          });

          if (products.length === 0) {
              alert("Vui lòng thêm sản phẩm vào hóa đơn");
              return;
          }

          // Calculate total amount
          const tongTienHang = products.reduce((sum, product) => sum + product.thanh_tien, 0);
          const tienChietKhau = parseFloat(document.getElementById("tien_chiec_khau").value) || 0;
          const phiDichVu = parseFloat(document.getElementById("phi_dich_vu").value) || 0;
          const tienThanhToan = tongTienHang - tienChietKhau + phiDichVu;

          const invoiceData = {
              tong_tien: tongTienHang,
              chiet_khau: tienChietKhau,
              phi_dich_vu: phiDichVu,
              thanh_toan: tienThanhToan,
              khach_hang: {
                  ten: document.getElementById("ten_khach_hang").value.trim(),
                  sdt: document.getElementById("so_dien_thoai").value.trim(),
                  dia_chi: document.getElementById("dia_chi").value.trim()
              },
              san_pham: products
          };

          // Send data to server
          const response = await axios.post('/admin/save-invoice', invoiceData);
          
          if (response.data.success) {
              alert(response.data.message);
              // Clear the form and table
              listTable.innerHTML = '';
              document.getElementById("tong_tien_hang").value = "0";
              document.getElementById("tien_chiec_khau").value = "0";
              document.getElementById("phi_dich_vu").value = "0";
              document.getElementById("tien_thanh_toan").value = "0";
              document.getElementById("ten_khach_hang").value = "";
              document.getElementById("so_dien_thoai").value = "";
              document.getElementById("dia_chi").value = "";
          } else {
              throw new Error(response.data.message || "Có lỗi xảy ra");
          }

      } catch (error) {
          console.error("Error processing payment:", error);
          alert(error.response?.data?.message || "Có lỗi xảy ra khi thanh toán");
      }
  });

  LoadProduct();
});
