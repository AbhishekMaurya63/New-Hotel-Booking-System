function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const formErr=document.getElementById('formErr')
    document.getElementById('emailErr').innerText=''
    document.getElementById('passwordErr').innerText=''
    isValid=true
 if (!validateEmail(email)) {
        document.getElementById('emailErr').textContent = 'Email is required';
        isValid = false;
        }
else if(!validatePassword(password)) {
            document.getElementById('passwordErr').textContent = 'Password is required';
            isValid = false;
        }
        if (isValid) {
            const formData = new FormData(document.getElementById('loginForm'));
    
            fetch('/loginEmp', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                formErr.textContent = '';
                // Reset the form fields
                document.getElementById("loginForm").reset();
                document.getElementById('formSuccess').innerText=data.success
                window.location.href = '/index';  // Redirect to index page after successful login
            })
            .catch(err => {
                formErr.textContent = err.error || 'An error occurred. Please try again.';
            });
        }  
    return isValid
  }
const validateEmail = (email) => {
    const regex = /^[a-zA-Z]+([a-zA-Z0-9]+)?@[a-zA-Z]+\.(?<firstDomain>[a-zA-Z]{2,5})(?:\.(?<secondDomain>[a-zA-Z]{2,5}))?$/;
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
const validatePassword = (password) => /^(?=[A-Z])(?=.*[A-Za-z])(?=.*\d)(?=.{8,})/.test(password);


document.getElementById('registerEmail').addEventListener('input', () => {        
    const email = document.getElementById('registerEmail').value;
    document.getElementById('emailErr').textContent = validateEmail(email) ? '' : 'Invalid email format.';
});  

document.getElementById('registerPassword').addEventListener('input', () => {
    const password = document.getElementById('registerPassword').value;
    let errorMessage = '';
    

    if (!/^[A-Z]/.test(password)) {
        errorMessage = 'Password must start with a capital letter.';
    }
  
    else if (password.length < 8) {
        errorMessage = 'Password must be at least 8 characters long.';
    }
   
    else if (!/\d/.test(password)) {
        errorMessage = 'Password must contain at least one number.';
    }
    
   
    document.getElementById('passwordErr').textContent = errorMessage;
});


