function validation(event){
    event.preventDefault();
    const roomNumber=document.getElementById('roomNumber').value
    const guestEmail = document.getElementById("guestEmail").value;
    const checkInDate=document.getElementById('checkInDate').value
    const checkOutDate=document.getElementById('checkOutDate').value
    let isValid=true
    const formError = document.getElementById("formError");
    
    // Clear previous error messages
    document.getElementById('roomNumberErr').textContent = '';
    document.getElementById('guestEmailErr').textContent = '';
    document.getElementById('checkInDateErr').textContent = '';
    document.getElementById('checkOutDateErr').textContent = '';
    formError.textContent = '';

    if (!validateRoomNumber(roomNumber)) {
        console.log(roomNumber)
        document.getElementById('roomNumberErr').textContent = 'Room Number Required';
        isValid = false;
    }else if(!validateEmail(guestEmail)){
        document.getElementById('guestEmailErr').innerText='Email Required'
        isValid=false
    }else if (checkInDate == '') {
        document.getElementById('checkInDateErr').textContent = 'Enter Check in Date';
        isValid = false;
    } else if (checkOutDate=='') {
        document.getElementById('checkOutDateErr').textContent = 'Enter Check in Date';
        isValid = false;
    }
    if(isValid){
        const formData = new FormData(document.getElementById("bookRoomForm"));

        fetch('/api/bookings', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            formError.textContent = "";
            // Reset the form fields
            document.getElementById("bookRoomForm").reset(); 
            console.log(data.success)
            document.getElementById('formsuccess').textContent=data.success
            fetchBookings();
        })
        .catch(err => {
            document.getElementById('formsuccess').textContent=''
            formError.textContent = err.error;
        });
    }
    return true

}

const dateInputs = document.querySelectorAll('.dateInput');

        // Function to open date picker
        dateInputs.forEach(input => {
            input.addEventListener('click', function() {
                this.showPicker(); // Open the date picker
            });
        });


const validateRoomNumber = (roomNum) => /^[0-9]+$/.test(roomNum);
document.getElementById('roomNumber').addEventListener('input',()=>{
    const roomNum = document.getElementById('roomNumber').value;
    let errmsg=''
    if(!validateRoomNumber(roomNum) ){
        errmsg='Invalid Room Number'
    }
    else if(roomNum.length<3){
        errmsg='Min Value 3'
    }
    else if(roomNum.length>6){
         errmsg='Max Value 6'
    }
    document.getElementById('roomNumberErr').textContent = errmsg;
})
const validateEmail = (email) => {
    const regex = /^[a-zA-Z.\-_+]+([a-zA-Z0-9]+)?@[a-zA-Z]+\.(?<firstDomain>[a-zA-Z]{2,5})(?:\.(?<secondDomain>[a-zA-Z]{2,5}))?$/;
    const matchs = email.trim().match(regex);
    
    if (!matchs) {
      return false; // Invalid email format
    }
    
    const { firstDomain, secondDomain } = matchs.groups;
    
  
    if (secondDomain && firstDomain.toLowerCase() === secondDomain.toLowerCase()) {
      return false;
    }
    
    return true;
  };
  document.getElementById('guestEmail').addEventListener('input', () => {        
    const email = document.getElementById('guestEmail').value;
    document.getElementById('guestEmailErr').textContent = validateEmail(email) ? '' : 'Invalid email format.';
});


// Handle form submission to check room availability
document.getElementById("checkAvailabilityForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const checkInDate = document.getElementById("checkInDateAvail").value;
    const checkOutDate = document.getElementById("checkOutDateAvail").value;
    const dateErr=document.getElementById('dateErr')
    if (!checkInDate || !checkOutDate) {
        dateErr.textContent="Please select both check-in and check-out dates.";
        return;
    }
    document.getElementById('dateErr').textContent="";
    const formData = new FormData();
    formData.append("checkInDate", checkInDate);
    formData.append("checkOutDate", checkOutDate);

    try {
        const response = await fetch("/api/available_rooms", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();


        if (response.ok) {
            if (data.available_rooms && data.available_rooms.length > 0) {
                displayAvailableRooms(data.available_rooms)
            } else {
                dateErr.innerText = "No rooms available for the selected dates.";
            }
        } else {
            dateErr.innerText = `${data.error || "An error occurred while checking availability."}`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("availableRoomsErr").innerHTML = "<p class='text-danger'>Failed to check room availability.</p>";
    }
});

// Show room details in the prompt
function displayAvailableRooms(rooms) {
    const roomTableBody = document.getElementById("roomTableBody");
    roomTableBody.innerHTML = "";  // Clear any existing rows

    rooms.forEach(room => {
        // Create a new row
        const row = document.createElement("tr");

        // Add each cell with the room data
        const roomIdCell = document.createElement("td");
        roomIdCell.textContent = room.room_id;
        row.appendChild(roomIdCell);

        const roomTypeCell = document.createElement("td");
        roomTypeCell.textContent = room.room_type;
        row.appendChild(roomTypeCell);

        const roomPriceCell = document.createElement("td");
        roomPriceCell.textContent = room.room_price;
        row.appendChild(roomPriceCell);

        const roomAvailCell = document.createElement("td");
        roomAvailCell.textContent = room.is_available ? "Yes" : "No";
        row.appendChild(roomAvailCell);

        // Append the row to the table body
        roomTableBody.appendChild(row);
    });

    // Show the prompt with the table
    document.getElementById("showPrompt").style.display = "flex";
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    document.getElementById('bodyContainer').style.overflow='hidden'
}

// Close prompt
function closeShowData() {
    document.getElementById("showPrompt").style.display = "none";
    document.getElementById('bodyContainer').style.overflow='visible'
    document.getElementById("checkInDateAvail").value='';
    document.getElementById("checkOutDateAvail").value='';
}


//show all booking

document.addEventListener('DOMContentLoaded', function() {
    fetchBookings(); // Fetch and display bookings when the page loads
});
    // Fetch bookings from the server
    function fetchBookings() {
        fetch('/api/bookings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Bookings');
            }
            return response.json();
        })
        .then(data => {
                const bookingHistoryList = document.getElementById('bookingHistoryList');
                bookingHistoryList.innerHTML = ''; // Clear previous bookings
                console.log(data)
                data.forEach(booking => {
                    const tr = document.createElement('tr');
                    
                    // Fill the table row with booking data
                    tr.innerHTML = `
                        <td>${booking.booking_id}</td>
                        <td>${booking.room_id}</td>
                        <td>${booking.guest_email}</td>
                        <td>${booking.check_in_date}</td>
                        <td>${booking.check_out_date}</td>
                    `;
                    
                    bookingHistoryList.appendChild(tr);
                });
            });
    }

    // View booking details
    function viewBookingDetails(roomId) {
        fetch(`/api/bookings/${roomId}`)
            .then(response => response.json())
            .then(booking => {
                document.getElementById('bookingRoomId').innerText = booking.roomId;
                document.getElementById('bookingCheckIn').innerText = booking.checkInDate;
                document.getElementById('bookingCheckOut').innerText = booking.checkOutDate;
                document.getElementById('bookingDetailModal').style.display = 'block';
            });
    }

    // Close booking details modal
    window.closeBookingDetails = function() {
        document.getElementById('bookingDetailModal').style.display = 'none';
    };

    // Remove booking
    function removeBooking(roomId) {
        fetch(`/api/bookings/${roomId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchBookings(); // Refresh booking list after deletion
            } else {
                alert('Failed to remove booking');
            }
        });
    }



document.getElementById('checkInDate').addEventListener('change', fetchAvailableRooms);
document.getElementById('checkOutDate').addEventListener('change', fetchAvailableRooms);

function fetchAvailableRooms() {
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const roomSelect = document.getElementById('roomNumber');

    // Reset room dropdown
    roomSelect.innerHTML = '<option value="" disabled selected>Select a room number</option>';
    roomSelect.disabled = true; // Disable until we fetch available rooms

    // Validate the dates
    if (!checkInDate || !checkOutDate) {
        document.getElementById('formError').innerText = "Both check-in and check-out dates are required.";
        return;
    }

    fetch('/api/available-rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            checkInDate: checkInDate,
            checkOutDate: checkOutDate
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.availableRooms.length === 0) {
            document.getElementById('formError').innerText = "No rooms available for the selected dates.";
        } else {
            data.availableRooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.room_id;
                option.textContent = room.room_id;
                roomSelect.appendChild(option);

            });
            roomSelect.disabled = false; // Enable dropdown if rooms are available
            document.getElementById('formError').innerText = ""; // Clear any previous errors
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('formError').innerText = "Error fetching available rooms.";
    });
}

