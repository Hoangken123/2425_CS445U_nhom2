document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("product-search");
    const productList = document.getElementById("product-list");
    const addToinvoice = document.getElementById("addToinvoice");


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

    addToinvoice.addEventListener("click", async (e) => {
        const idProduct          = document.getElementById("codeProduct").value.trim();
        const nameProduct        = searchInput.value.trim();
        const quannity           = 1;
        const UnitsOfCalculation = document.getElementById("id_don_vi").value.trim();
        const UnitpPice          = document.getElementById("don_gia").value.trim();
        
        

        
        

    })
    LoadProduct();

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
});
