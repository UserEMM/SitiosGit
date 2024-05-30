$(document).ready( function(){
    createOptions();
    $("#closeSession").click((event) => {
        closeActiveSession();
    });
});

const createOptions = () => {//si existe localstorage del user, va crear un header
    isSessionActive = JSON.parse(localStorage.getItem("user")); 
    if (isSessionActive) {
        $("#greeting-message").text("Welcome " + isSessionActive.FirstName);
    }
    const options = `        
        ${isSessionActive ? 
            `<li class="nav-item header__nav__links__item">
                <a class="nav-link" id="closeSession">Log out</a>
            </li>` : 
            `<li class="nav-item header__nav__links__item">
                <a class="nav-link" href="/Login">Login</a>
            </li>
            <li class="nav-item header__nav__links__item">
                <a class="nav-link" href="/Registro">Register</a>
            </li>`}
        <li class="nav-item header__nav__links__item" contactUs>
            <a class="nav-link" href="/contactUs">Contact</a>
        </li>
        <li class="nav-item header__nav__links__item aboutUs">
            <a class="nav-link" href="/aboutUs">About Us</a>
        </li>`;
    $("#header-options").append(options);
}

const closeActiveSession = () => {//mientras exista el localstorage, va darnos opciones para cerrar sesiones activas
    isSessionActive = JSON.parse(localStorage.getItem("user")); 
    if(isSessionActive) {
        Swal.fire({
            title: 'Log out',
            text: 'This will close the current session, do you want to log out of your account?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user");
                localStorage.removeItem("introCalled");
                const url = `${location.protocol}//${window.location.host}/Login`
                window.location.href = url;
            }
          })
    }
}
