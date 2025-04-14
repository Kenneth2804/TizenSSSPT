/* global ConfigManager, TimeSync */

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        checkAndFixTime();
      }
    });
  
    checkAndFixTime();
  });
  
  function checkAndFixTime() {
    const message = document.getElementById("message");
  
    if (!message) {
      console.error("Elemento con id 'message' no encontrado");
      return;
    }
  
    ConfigManager.loadConfig()
      .then(function (config) {
        TimeSync.init(config, function (statusText) {
          message.textContent = statusText;
  
          setTimeout(function () {
            try {
              tizen.application.getCurrentApplication().exit();
            } catch (e) {
              console.error("No se pudo cerrar la app:", e);
            }
          }, 5000);
        });
      })
      .catch(function (err) {
        console.error("Error al sincronizar:", err);
        message.textContent = "Error al sincronizar";
      });
  }
  