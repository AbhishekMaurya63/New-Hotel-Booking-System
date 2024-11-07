document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display dashboard data
    fetchtotalRevnue();
});

function fetchtotalRevnue() {
    fetch('/revenueData')
        .then(response => response.json())
        .then(data => {
            document.getElementById("allRevenue").textContent = data.total_revenue;
        })
        .catch(error => {
            console.error("Error fetching Revenue data:", error);
            alert("Failed to load Revenue data.");
        });
}
function fetchRevenueByDate() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    fetch(`/total_revenue?start_date=${startDate}&end_date=${endDate}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalRevenue").textContent = `₹${data.total_revenue.toFixed(2)}`;
        })
        .catch(error => {
            console.error("Error fetching revenue by date:", error);
            alert("Failed to load revenue data.");
        });
    }