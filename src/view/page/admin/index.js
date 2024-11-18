const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const add = ref({});
        const edit = ref({});
        const del = ref({});
        const dataAdmin = ref([]);
        
        // Fetch Admin Data
        const fetchData = async () => {
            try {
                const res = await axios.get('/admin/get-data');
                dataAdmin.value = res.data.data; // Chỉ giữ lại thông tin Admin cần thiết
                console.log("Admin data loaded:", dataAdmin.value);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        // Create New Admin
        const themMoi = async () => {
            try {
                const res = await axios.post('/admin/create', add.value);
                if (res.data.status) {
                    toastr.success(res.data.message, 'success');
                    fetchData(); // Reload data after success
                }
            } catch (error) {
                if (error.response?.data?.errors) {
                    Object.values(error.response.data.errors).forEach(err => {
                        toastr.error(err.msg, 'error');
                    });
                }
            }
        };

        // Update Admin
        const capNhat = async () => {
            try {
                const res = await axios.post('/admin/update', edit.value);
                if (res.data.status) {
                    toastr.success(res.data.message, 'success');
                    $("#capNhatModal").modal('hide'); // Hide the modal
                    fetchData(); // Reload data after success
                }
            } catch (error) {
                if (error.response?.data?.errors) {
                    Object.values(error.response.data.errors).forEach(err => {
                        toastr.error(err.msg, 'error');
                    });
                }
            }
        };

        // Delete Admin
        const Xoa = async () => {
            try {
                const res = await axios.post('/admin/delete', del.value);
                if (res.data.status) {
                    toastr.success(res.data.message, 'success');
                    $("#deleteModal").modal('hide'); // Hide the modal
                    fetchData(); // Reload data after success
                }
            } catch (error) {
                toastr.error("Error deleting admin", 'error');
                console.error("Delete error:", error);
            }
        };

        // Load data on component mount
        onMounted(() => {
            fetchData();
        });

        return {
            add,
            edit,
            del,
            dataAdmin,
            themMoi,
            capNhat,
            Xoa
        };
    },
}).mount('#app');
