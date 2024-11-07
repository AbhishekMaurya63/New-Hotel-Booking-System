
function validation(event) {
    event.preventDefault(); // Prevent the default form submission    
    const roomNumber = document.getElementById("roomNumber").value;
    const roomType = document.getElementById("roomType").value;
    const roomPrice = document.getElementById("roomPrice").value;
    let isValid = true;
    const formError = document.getElementById("formError");
    
    // Clear previous error messages
    document.getElementById('roomNumberErr').textContent = '';
    document.getElementById('roomTypeErr').textContent = '';
    document.getElementById('roomPriceErr').textContent = '';
    formError.textContent = '';

    if (!validateRoomNumber(roomNumber)) {
        document.getElementById('roomNumberErr').textContent = 'Room Number Required';
        isValid = false;
    } else if (roomType == '') {
        document.getElementById('roomTypeErr').textContent = 'Select Room Type';
        isValid = false;
    } else if (!validateRoomPrice(roomPrice)) {
        document.getElementById('roomPriceErr').textContent = 'Price Required';
        isValid = false;
    }

    if (isValid) {
        const formData = new FormData(document.getElementById("addRoomForm"));

        fetch('/api/rooms', {
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
            document.getElementById("addRoomForm").reset(); 
            document.getElementById('formsuccess').textContent=data.success
            loadRooms()
        })
        .catch(err => {
            document.getElementById('formsuccess').textContent=''
            formError.textContent = err.error;
        });
    }
    return isValid;
}


const validateRoomNumber = (roomNum) => /^[0-9]+$/.test(roomNum);
const validateRoomPrice = (roomPrice) => /^[0-9]+$/.test(roomPrice);
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
document.getElementById('roomPrice').addEventListener('input',()=>{
    const roomPrice=document.getElementById('roomPrice').value;
    let errmsg=''
    if(!validateRoomPrice(roomPrice) ){
        errmsg='Invalid Room Price'
    }
    else if(roomPrice.length<3){
        errmsg='Min Value 3'
    }
    else if(roomPrice.length>7){
         errmsg='Max Value 7'
    }
    document.getElementById('roomPriceErr').textContent=errmsg
})





//load all rooms 

function loadRooms() {
    fetch('/api/rooms')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            return response.json();
        })
        .then(rooms => {
            const roomsList = document.getElementById('roomsList');
            roomsList.innerHTML = ''; // Clear the list
            let num=1
            rooms.forEach(room => {
                // Create a new list item for each room
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                   ${num++}. Room ${room.room_id} - ${room.room_type} (${room.price} Rs)
                   <div>
                   <button class="btn text-success p-1" onclick="showRoom(${room.room_id})"><i class="fas fa-eye"></i></button>
                   <button class="btn text-warning p-1" onclick="updatedata(${room.room_id})"><i class="fas fa-edit"></i></button>
                    <button class="btn text-danger p-1" onclick="confirmRemove(${room.room_id})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                roomsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching rooms:', error);
        });
}

//remove rooms 
let deleteRoomId=null
function confirmRemove(roomId) {
    // if (confirm("Are you sure you want to remove this room?")) {
    //     deleteRoom(roomId);
    // }
    deleteRoomId=roomId
    document.getElementById('removePropt').style.display='flex'
    document.getElementById('roomsList').style.display='none'
   
}
function confirmfunc(res){
    if(res){
        document.getElementById('removePropt').style.display='none'
        document.getElementById('roomsList').style.display='flex'
        deleteRoom(deleteRoomId)
    }
    if(res==false){
        location.reload();
    }
    
}

function deleteRoom(roomId) {
    fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete room');
        }
        return response.json();
    })
    .then(data => {
        alert(data.success);
        loadRooms(); // Refresh the list after deletion
    })
    .catch(error => {
        console.error('Error deleting room:', error);
    });
}
// function updatedata(roomId){

// }

//show room 

function showRoom(roomId) {
    fetch(`/api/rooms/${roomId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            return response.json();})
        .then(room => {
            document.getElementById('showPrompt').style.display='flex'
            document.getElementById('roomsList').style.display='none'
            document.getElementById('room_id').textContent=room.room_id
            document.getElementById('room_type').textContent=room.room_type
            document.getElementById('room_price').textContent=room.price
            document.getElementById('room_av').textContent=room.available?'No':'Yes'

        })
        .catch(error => console.error('Error fetching room details:', error));
}
function closeShowData(){
    document.getElementById('showPrompt').style.display='none'
    document.getElementById('roomsList').style.display='flex'
}

// update room details 

function updatedata(roomId) {
    fetch(`/api/rooms/${roomId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            return response.json();})
        .then(room => {
            document.getElementById('roomupdate_id').value = room.room_id;
            document.getElementById('roomdata_type').value = room.room_type;
            document.getElementById('roomdata_price').value = room.price;
            document.getElementById('roomdata_av').value = room.available;
            console.log(room.room_id)
            document.getElementById('showupdatePrompt').style.display = 'flex';
            document.getElementById('roomsList').style.display='none'
        })
        .catch(error => console.error('Error fetching room details:', error));
}
function closeUpdateData(){
    document.getElementById('showupdatePrompt').style.display = 'none';
    document.getElementById('roomsList').style.display='flex'
}

function submitUpdateRoom() {
    const roomId = document.getElementById('roomupdate_id').value;
    const roomType = document.getElementById('roomdata_type').value;
    const roomPrice = document.getElementById('roomdata_price').value;
    const roomAvailable = document.getElementById('roomdata_av').value;

    fetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_type: roomType, price: roomPrice, available: roomAvailable }),
    })
    .then(response => {
        if (response.ok) {
            closeUpdateData()
            alert('Room updated successfully!');
            loadRooms();  // Refresh the room list
            // document.getElementById('updateRoomModal').style.display = 'none';
            
        } else {
            throw new Error('Failed to update room');
        }
    })
    .catch(error => console.error('Error updating room:', error));
}



// Load rooms when the page loads
window.onload = loadRooms;