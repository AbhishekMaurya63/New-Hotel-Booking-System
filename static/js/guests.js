
function validation(event){
    event.preventDefault();
    const guestName = document.getElementById("guestName").value;
    const guestEmail = document.getElementById("guestEmail").value;
    const formError = document.getElementById("formError");
    let isValid=true
    if(!validateName(guestName)){
        document.getElementById('guestNameErr').innerText="Name Required"
        isValid=false
    }
    else if(!validateEmail(guestEmail)){
        document.getElementById('guestEmailErr').innerText='Email Required'
        isValid=false
    }
    if(isValid){
        const formData = new FormData(document.getElementById("addGuestForm"));
        fetch('/api/guests', {
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
            console.log(data); // Log the full response
            if (data.success) { // Check if success property exists
                document.getElementById('formsuccess').textContent = data.success;
            } else {
                document.getElementById('formsuccess').textContent = "Unexpected response.";
            }
            console.log(data.success);
            document.getElementById("addGuestForm").reset(); 
            loadRooms();
        })
        .catch(err => {
            document.getElementById('formsuccess').textContent=''
            formError.textContent = err.error;
        });
    }
    return isValid

}
const validateName = (name) => /^[A-Za-z]+(\s[A-Za-z]+)*$/.test(name);
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


// Remove Guest





document.getElementById('guestName').addEventListener('input', () => {
    const name = document.getElementById('guestName').value;
    let errorMessage = '';

    
    if (/^\s|\s$/.test(name)) {
        errorMessage = 'Name cannot have leading or trailing spaces.';
    }
    
    else if (/\s{2,}/.test(name)) {
        errorMessage = 'Name cannot contain multiple consecutive spaces.';
    }
   
    else if (!/^[A-Za-z]+(\s[A-Za-z]+)*$/.test(name)) {
        errorMessage = 'Name can only contain letters and single spaces';
    }
    
    else if (name.trim().length < 2) {
        errorMessage = 'Name must be at least 2 characters long.';
    }
 
    document.getElementById('guestNameErr').textContent = errorMessage;
});

document.getElementById('guestEmail').addEventListener('input', () => {        
    const email = document.getElementById('guestEmail').value;
    document.getElementById('guestEmailErr').textContent = validateEmail(email) ? '' : 'Invalid email format.';
}); 



function loadGuests() {
    fetch('/api/guests')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch guests');
            }
            return response.json();
        })
        .then(guests => {
            const guestsList = document.getElementById('guestList');
            guestsList.innerHTML = ''; // Clear the list
            let num=1
            guests.forEach(guest => {
                // Create a new list item for each room
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                   ${num++}. Guest Id: ${guest.guest_id} Name: ${guest.name} Email: ${guest.email}
                   <div>
                   <button class="btn text-success p-1" onclick="showRoom(${guest.guest_id})"><i class="fas fa-eye"></i></button>
                   <button class="btn text-warning p-1" onclick="updatedata(${guest.guest_id})"><i class="fas fa-edit"></i></button>
                    <button class="btn text-danger p-1" onclick="confirmRemove(${guest.guest_id})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                guestsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching rooms:', error);
        });
}

// show guests 

function showRoom(guestId) {
    fetch(`/api/guests/${guestId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch guests');
            }
            return response.json();})
        .then(guest => {
            document.getElementById('showPrompt').style.display='flex'
            document.getElementById('guestList').style.display='none'
            document.getElementById('guest_id').textContent=guest.guest_id
            document.getElementById('guest_name').textContent=guest.name
            document.getElementById('guest_email').textContent=guest.email
            // document.getElementById('room_av').textContent=room.available?'No':'Yes'

        })
        .catch(error => console.error('Error fetching room details:', error));
}
function closeShowData(){
    document.getElementById('showPrompt').style.display='none'
    document.getElementById('guestList').style.display='flex'
}

//remove rooms 
let deleteGuestId=null
function confirmRemove(guestId) {
    deleteGuestId=guestId
    document.getElementById('removePropt').style.display='flex'
    document.getElementById('guestList').style.display='none'
   
}
function confirmfunc(res){
    if(res){
        document.getElementById('removePropt').style.display='none'
        document.getElementById('guestList').style.display='flex'
        deleteGuest(deleteGuestId)
    }
    if(res==false){
        location.reload();
    }
    
}

function deleteGuest(guestId) {
    fetch(`/api/guests/${guestId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete guest');
        }
        return response.json();
    })
    .then(data => {
        alert(data.success);
        loadGuests(); // Refresh the list after deletion
    })
    .catch(error => {
        console.error('Error deleting guest:', error);
    });
}

// update room details 

function updatedata(guestId) {
    fetch(`/api/guests/${guestId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Guest');
            }
            return response.json();})
        .then(guest => {
            document.getElementById('guestupdate_id').value = guest.guest_id;
            document.getElementById('guestupdate_name').value = guest.name;
            document.getElementById('guestupdate_email').value = guest.email;
            console.log(guest.guest_id)
            document.getElementById('showupdatePrompt').style.display = 'flex';
            document.getElementById('guestList').style.display='none'
        })
        .catch(error => console.error('Error fetching guest details:', error));
}
function closeUpdateData(){
    document.getElementById('showupdatePrompt').style.display = 'none';
    document.getElementById('guestList').style.display='flex'
}

function submitUpdateGuest() {
    const guestId = document.getElementById('guestupdate_id').value;
    const guestName = document.getElementById('guestupdate_name').value;
    const guestEmail = document.getElementById('guestupdate_email').value;

    fetch(`/api/guests/${guestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: guestName, email: guestEmail }),
    })
    .then(response => {
        if (response.ok) {
            closeUpdateData()
            alert('Guest updated successfully!');
            loadGuests();  // Refresh the room list
            
        } else {
            throw new Error('Failed to update Guest');
        }
    })
    .catch(error => console.error('Error updating Guest:', error));
}




window.onload = loadGuests;