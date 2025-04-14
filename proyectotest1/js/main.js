document.addEventListener("DOMContentLoaded", function () {
  const message = document.getElementById("message");
  message.textContent = "Consultando timeapi.io...";

  const apiUrl =
    "https://timeapi.io/api/Time/current/coordinate?latitude=-34.6037&longitude=-58.3816";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);

          if (!data.dateTime) throw new Error("Sin campo dateTime");

          const targetTime = new Date(data.dateTime);
          const currentTime = new Date();

          message.innerHTML =
            "Hora actual: " +
            currentTime.toLocaleString() +
            "<br>" +
            "Nueva hora: " +
            targetTime.toLocaleString();

          try {
            tizen.time.setCurrentDateTime(targetTime);
            message.innerHTML += "<br>Hora ajustada correctamente";
          } catch (e) {
            message.innerHTML += "<br>Error al ajustar hora: " + e.message;
          }
        } catch (err) {
          message.textContent = "Error procesando respuesta: " + err.message;
        }
      } else {
        message.textContent = "Error HTTP: " + xhr.status;
      }
    }
  };
  xhr.send();
});
