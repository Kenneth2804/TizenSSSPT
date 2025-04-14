<<<<<<< Updated upstream
window.TimeSync = {
    init: function (config, onStatus) {
      var lat = config.lat;
      var lng = config.lng;
      var geonamesUser = config.geonamesUser;
      var apiUrl = "http://api.geonames.org/timezoneJSON?lat=" + lat + "&lng=" + lng + "&username=" + geonamesUser;

      var xhr = new XMLHttpRequest();
      xhr.open("GET", apiUrl, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              var data = JSON.parse(xhr.responseText);
              if (!data.time || !data.gmtOffset) {
                throw new Error("Datos inválidos desde GeoNames");
              }
  
              var serverTime = new Date(data.time);
              var currentTime = new Date();
              var difference = Math.abs(serverTime.getTime() - currentTime.getTime());
  
              if (difference > 15000) {
                try {
                  tizen.time.setCurrentDateTime(serverTime);
                  console.log("Hora ajustada con éxito.");
                  if (onStatus) { onStatus("Hora ajustada con éxito"); }
                } catch (e) {
                  console.error("Error al ajustar la hora:", e);
                  if (onStatus) { onStatus("Error al ajustar la hora"); }
                }
              } else {
                console.log("La hora ya está sincronizada.");
                if (onStatus) { onStatus("La hora ya está sincronizada"); }
              }
  
            } catch (err) {
              console.error("Error al procesar la respuesta:", err);
              if (onStatus) { onStatus("Error al procesar respuesta"); }
            }
          } else {
            console.error("Error al consultar GeoNames:", xhr.status);
            if (onStatus) { onStatus("Error al consultar GeoNames"); }
          }
        }
      };
      xhr.send();
    }
  };
=======
const TimeSync = {
  async init(config) {
    try {
      let serverTime;

      try {
        serverTime = await this.getServerTime(config.serverUrl);
      } catch (serverErr) {
        console.warn("Fallo servidor. Intentando WorldTimeAPI...timesync");
        try {
          serverTime = await this.getWorldTime();
        } catch (worldTimeErr) {
          console.warn("Fallo WorldTimeAPI. Intentando fallback local...timesync");
          if (config.fallbackTimezone) {
            serverTime = this.getTimeFromTimezone(config.fallbackTimezone);
          } else {
            throw new Error("No hay fuente de tiempo válida.timesync");
          }
        }
      }

      return await this.applyTime(serverTime);
    } catch (e) {
      console.error("Error al sincronizar la hora: timesync", e);
      throw new Error("No se pudo sincronizar la hora. timesync");
    }
  },

  async getServerTime(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Respuesta inválida del servidor timesync");
    const data = await response.json();
    return new Date(data.currentTime);
  },

  async getWorldTime() {
    const response = await fetch("https://worldtimeapi.org/api/ip timesync");
    if (!response.ok) throw new Error("Error al consultar WorldTimeAPI timesync");
    const data = await response.json();
    return new Date(data.utc_datetime);
  },

  getTimeFromTimezone(timezoneString) {
    const match = timezoneString.match(/UTC([+-]\d{1,2})/i);
    if (!match) throw new Error("Formato de fallbackTimezone inválido timesync");

    const offsetHours = parseInt(match[1], 10);
    const nowUTC = new Date(new Date().toUTCString()); 
    nowUTC.setHours(nowUTC.getHours() + offsetHours);
    return nowUTC;
  },

  async applyTime(serverTime) {
    const currentTime = new Date();
    const difference = Math.abs(serverTime - currentTime);

    if (difference > 60000) {
      try {
        tizen.time.setCurrentDateTime(serverTime);
        return "Hora ajustada con éxito. timesync";
      } catch (e) {
        console.error("Error al aplicar hora: timesync", e);
        throw new Error("No se pudo ajustar la hora. timesync");
      }
    } else {
      return "La hora ya estaba correcta. timesync";
    }
  }
};
>>>>>>> Stashed changes
