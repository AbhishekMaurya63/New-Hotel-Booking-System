document.getElementById('sidebarToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('d-none'); // Toggle sidebar visibility
    sidebar.classList.toggle('d-md-block'); // Ensure it's visible on medium and larger screens
    sidebar.classList.toggle('sidebar-expanded');
    document.getElementById('main-content').classList.toggle('hide')

});
document.getElementById('sidebarToggle1').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('d-none'); // Toggle sidebar visibility
    sidebar.classList.toggle('d-md-block'); // Ensure it's visible on medium and larger screens
    sidebar.classList.toggle('sidebar-expanded');
    document.getElementById('main-content').classList.remove('hide')

});
function showGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours < 12) {
        greeting = "Good Morning!";
    } else if (hours < 18) {
        greeting = "Good Afternoon!";
    } else if (hours < 21) {
        greeting = "Good Evening!";
    } else {
        greeting = "Good Night!";
    }

    document.getElementById("showTime").textContent = greeting;
}

// Call the function once to show the initial greeting
showGreeting();

// Optionally, update the greeting every hour
setInterval(showGreeting, 3600000);

function loadDashboardData() {
    fetch('/dashboard-data')
        .then(response => response.json())
        .then(data => {
            document.querySelector('#totalRooms').textContent = data.total_rooms;
            document.querySelector('#occupiedRooms').textContent = data.occupied_rooms;
            document.querySelector('#totalGuests').textContent = data.total_guests;
            document.querySelector('#totalRevenue').textContent = `₹ ${data.total_revenue}`;
            console.log(data.emp_name)
            document.querySelector('#empname').textContent = data.emp_name;
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);
window.onload = showGreeting;