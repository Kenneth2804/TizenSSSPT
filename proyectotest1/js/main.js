<<<<<<< Updated upstream
/* global ConfigManager, TimeSync */
=======
window.onload = async () => {
  const msg = document.getElementById("message");
>>>>>>> Stashed changes

  try {
    const config = await ConfigManager.LoadConfig();

    TimeSync.init(config, (status) => {
      msg.textContent = status;

      setTimeout(() => {
        try {
          tizen.application.getCurrentApplication().exit();
        } catch (e) {
          console.error("No se puede cerrar la app main", e);
        }
      }, 5000);
    });
  } catch (e) {
    msg.textContent = "Error cargando configuración main";
    console.error(e);
  }
<<<<<<< Updated upstream
  
=======
};
>>>>>>> Stashed changes
