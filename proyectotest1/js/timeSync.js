 window.TimeSync = {
  init: function (config, onStatus) {
    const { expectedTimezone } = config;
    const apiUrl = 'https://ipinfo.io/json';

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);

            const ipTimezone = data.timezone;

            if (!ipTimezone) {
              throw new Error("No se puedo obtenerla zona horaria de la IP");
            }

            console.log("Zona horaria decectada porIP", ipTimezone);

            if (ipTimezone !== expectedTimezone) {
              console.warn(`Zona horaria de la IP (${ipTimezone}) no coincide con la esperada (${expectedTimezone})`);
              adjustTime(ipTimezone, expectedTimezone, onStatus);
            } else {
              onStatus("Zona horaria correcta");
            }
          
          } catch (err) {
            console.error("Errror al procesar la respuesta de la IP", err);
            if (onStatus) onStatus("Error al procesar respuesta IP");
          }
        } else {
          console.error("Error al consultar ipinfo.io:", xhr.status);
          if (onStatus) onStatus("Error al consultar IP");
        }
      }
    };
    xhr.send();

    function adjustTime(ipTimezone, expectedTimezone,onStatus) {
      const apiUrl = `https://timeapi.io/api/Time/current/zone?timezone=${ipTimezone}`;
      
      const xhrTime = new XMLHttpRequest();
      xhrTime.open("GET", apiUrl, true);

      xhrTime.onreadystatechange = function () {
        if (xhrTime.readyState === 4) {
          if (xhrTime.status === 200) {
            try {
              const timeData = JSON.parsel(xhrTime.responseText);

              const utcTime = luxon.DateTime.fromISO(timeData.dateTime, { zone: ipTimezone }).toUTC();
              const targetTime = utcTime.setZone(expectedTimezone);

              const adjustedDate = new Date(targetTime.toISO());
              const info =`Hora ajustada correctamente a ${adjustedTime.toLocaleString()} (${expectedTimezone})`;

              console.log("Hora ajustada:", adjustedDate.toString());

              try {
                tizen.time.setCurrentDateTime(adjustedDate);
                if (onStatus) onStatus(info);
              } catch (e) {
                console.error("Error al ajustar la hora", e);
                if (onStatus) {
                  onStatus(info + "<br><span style='color:orange'>Simulacion: no se puede cambiar la hora</span>");
                }
                
              }
            } catch (error) {
              console.error("Eror al procesar la respuesta", err);
              if (onStatus) onStatus("Error al ajustar la hora");
            }
          } else {
            console.error("Error al consultar API para ajustar hora", xhrTime.status);
            if (onStatus) onStatus("Error al consultar API pra ajustar hora");
          }
        }
      };
      xhrTime.send();
    }
  }
};


