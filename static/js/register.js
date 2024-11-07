function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const repassword = document.getElementById('coregisterPassword').value;
    const formErr=document.getElementById('formErr')
    
    document.getElementById('nameErr').innerText=''
    document.getElementById('emailErr').innerText=''
    document.getElementById('passwordErr').innerText=''
    isValid=true
    if (!nameValidation(name)) {
        document.getElementById('nameErr').textContent = 'Name is Required';
        isValid = false;
        }

else if (!validateEmail(email)) {
        document.getElementById('emailErr').textContent = 'Email is required';
        isValid = false;
        }
    else if (!validatePassword(password)) {
            document.getElementById('passwordErr').textContent = 'Password is required';
            isValid = false;
        }

    else if (password !== repassword) {
            document.getElementById('repasswordErr').textContent = 'Passwords do not match.';
            isValid = false;
        }
    if(isValid){
        const formdata=new FormData(document.getElementById('registerForm'))
        fetch('/registerEmp',{
            method:'POST',
            body:formdata
        })
        .then(response => {
            
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            formErr.textContent = "";
            document.getElementById("registerForm").reset(); 
            document.getElementById('formSuccess').innerText=data.success
            window.location.href = '/index'; 
        })
        .catch(err => {
            formErr.textContent = err.error;
        });
    }
    return isValid
  }
const nameValidation=(name)=>/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(name)
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

document.getElementById('registerName').addEventListener('input', () => {
    const name = document.getElementById('registerName').value;
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

    
    document.getElementById('nameErr').textContent = errorMessage;
});
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

    document.getElementById('coregisterPassword').addEventListener('input', () => {
        const password = document.getElementById('registerPassword').value;
        const rePassword = document.getElementById('coregisterPassword').value;
        document.getElementById('repasswordErr').textContent = (password === rePassword) ? '' : 'Passwords do not match.';
    });            



