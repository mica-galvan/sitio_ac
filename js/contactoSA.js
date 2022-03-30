const btn = document.querySelector('#myBtn')

function submitForm() {
    document.getElementById("myForm").submit()
}

document.getElementById('myBtn').onclick = function () {
    setTimeout(submitForm, 2000);
}

btn.addEventListener('click', () => {

    Swal.fire({
        title: '&#10024¡Gracias por tu consulta!&#10024',
        text: 'Te contactaremos a la brevedad',
        icon: 'success',
        iconColor: 'pink',
        background: '#FFEEF8',
        showConfirmButton: false,

    })
})
