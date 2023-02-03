const form = document.querySelector('#form');
const listUsers = document.querySelector('.listUsers');
const { username, email, telephone } = form;


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        username: username.value, 
        email: email.value, 
        telephone: telephone.value
    }

    if(!validateInputs(data)) return;
    if(localStorage.getItem("users")) {
        const users = JSON.parse(localStorage.getItem("users"));

        const userFound = users.find(user => user.email == data.email);

        if(userFound) {
            alert("Email já cadastrado!");
            return;
        }
    }

    saveData(data);

    username.value = '';
    email.value = '';
    telephone.value = '';
    
    alert("Usuário cadastrado!");
});

function validateInputs(data) {
    const phoneRegex = /^\d{10,11}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!phoneRegex.test(data.telephone)) {
        alert("Formato de telefone inválido!");
        return false;
    }
    if(!emailRegex.test(data.email)) {
        alert("Formato de email inválido!");
        return false;
    }
    
    return true;
}


function saveData(data) {
    const users = JSON.parse(localStorage.getItem("users"));

    if(users) {
        users.push(data);
        localStorage.setItem("users", JSON.stringify(users));
    } else {
        localStorage.setItem("users", JSON.stringify([data]));
    }

    renderListUsers();
}


function deleteUser(email) {
    const users = JSON.parse(localStorage.getItem("users"));

    users.forEach((user, index) => {
        if(user.email == email) {
            users.splice(index, 1);
        }
    });

    localStorage.setItem("users", JSON.stringify(users));

    renderListUsers();
}

function updateUser(userEmail) {
    const modal = document.querySelector('.modal-update-user');
    const form = document.querySelector('#formUpdate');
    const cancelUpdateForm = document.querySelector('#cancelUpdateForm');
    const users = JSON.parse(localStorage.getItem('users'));
    
    modal.classList.add('active');

    cancelUpdateForm.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    const { username, email, telephone } = form;

    users.forEach((user) => {
        if(user.email == userEmail) {
            username.value = user.username;
            email.value = user.email;
            telephone.value = user.telephone;
        }
    });

    const data = {
        username: username.value,
        email: email.value,
        telephone: telephone.value
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if(!validateInputs(data)) return;

        users.forEach((user) => {
            if(user.email == userEmail) {
                user.username = username.value;
                user.email = email.value;
                user.telephone = telephone.value;
            }
        });

        localStorage.setItem("users", JSON.stringify(users));
        modal.classList.remove('active');
        renderListUsers();

    });

}

function renderListUsers() {
    const users = JSON.parse(localStorage.getItem("users"));

    if(!users) return;

    listUsers.innerHTML = '';

    users.forEach((user) => {
        listUsers.innerHTML += `
            <div class="user">
                <p>${user.username}</p>
                <p>${user.email}</p>
                <p>${user.telephone}</p>
                <div class="buttons">
                    <button class="deleteButton" onClick="deleteUser('${user.email}')">Excluir</button>
                    <button class="updateButton" onClick="updateUser('${user.email}')">Atualizar</button>
                </div>
            </div>
        `;
    });
}