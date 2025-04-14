window.TimeSync = {
    init: function (config, onStatus) {
      var lat = config.lat;
      var lng = config.lng;
      var geonamesUser = config.geonamesUser;
      var apiUrl = "https://secure.geonames.org/timezoneJSON?lat=" + lat + "&lng=" + lng + "&username=" + geonamesUser;
  
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