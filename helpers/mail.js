const transporter = require('../middleware/nodemailer');
const { getMaxListeners } = require('../models/user');
const { format } = require('date-fns'); // Instalar: npm install date-fns

const sendMailRegisterUser = async (toUser) => {
    await transporter.sendMail({
        from: '"Bienvenido a SALUD ORGANIZADA!👻" <saludorganizada@gmail.com>', // sender address
        to:  "noeliajudithzela@gmail.com", /*  toUser */ // list of receivers
        subject: "Bienvenido a SALUD ORGANIZADA !", // Subject line
        html: ` <div>
                    <h3>Bienvenido a SALUD ORGANIZADA!</h3>
                    <img  src="https://www.aprendemas.com/es/blog/images/2022/09/veterinaria_masterd.jpg" alt="ve00px">
                    <p >En Salud organizada podes: </p>
                    <p>* Agendar tu información médica</p>  
                    <p>*Guardar información de tus estudios médicos</p>
                    <p>*Guardar información de los médicos a los que acudis y turnos</p>
                    <p>*Ver la ubicación de sanatorios y hospitales con las especialidades médicas de guardia </p>
                </div>` // html body
      });
}

/* const sendMailUserPay = async (toUser) => {
    await transporter.sendMail({
        from: '"KING PET!👻" <saludorganizada@gmail.com>', // sender address
        to: toUser, // list of receivers
        subject: "Gracias por su compra", // Subject line
        html: ` <div>
        <h3>Gracias por comprar en nuestra tienda!!</h3>
        <img  src="https://www.aprendemas.com/es/blog/images/2022/09/veterinaria_masterd.jpg" alt="ve00px">
        <p >KING PET es un centro especializado en la atención integral de la mascota. </p>
        <p >Desde hace más de 10 años ofrecemos a nuestros clientes una completa atención para los animales, ya sean perros, gatos o especies exóticas.</p>
        <p >A través de nuestra página web podes reservar un turno con cualquiera de nuestros especialistas y realizar compras las 24 horas ! </p>
    </div>` , // html body
      });
} */

// ******************************************************
// ** NUEVA FUNCIÓN PARA ENVIAR EL RECORDATORIO **
// ******************************************************
const sendMailReminder = async ({ to, doctorName, doctorSpecialty, turns }) => {
    
    // 1. Formatear los turnos
    const formattedTurns = turns.map(turno => 
        `<li>Fecha y Hora: ${new Date(turno).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}</li>`
    ).join('');

    await transporter.sendMail({
        from: '"SALUD ORGANIZADA - Recordatorio" <saludorganizada@gmail.com>',
        to: to, // El email del administrador logueado
        subject: `🔔 Recordatorio de Turnos para Dr/a. ${doctorName}`,
        html: ` 
            <div>
                <h3>Recordatorio de Turnos Asignados</h3>
                <p>Estimado/a Administrador/a,</p>
                <p>La siguiente es la lista de turnos para el **Dr/a. ${doctorName}** (${doctorSpecialty}):</p>
                
                <ul style="list-style: none; padding-left: 0;">
                    ${formattedTurns}
                </ul>
                
                <p>Favor de revisar la agenda.</p>
                <p>Atentamente, Salud Organizada.</p>
            </div>`
    });
};

module.exports = {
    sendMailRegisterUser,
    sendMailReminder // Exporta la nueva función
}


