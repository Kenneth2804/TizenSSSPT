window.ConfigManager = {
    loadConfig: function () {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "config.json", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                var config = JSON.parse(xhr.responseText);
                resolve(config);
              } catch (e) {
                reject("Error al parsear config.json");
              }
            } else {
              reject("No se pudo obtener config.json");
            }
          }
        };
        xhr.send();
      });
    }
<<<<<<< Updated upstream
  };
=======
  };*/


const ConfigManager = {
  async LoadConfig() {
    try{
    const response = await fetch ("config.json");
    if (!response.ok) throw new Error("No se pudo cargar config.json");
    const json = await response.json();
    return json;
  } catch (e) {
    console.error("Error cargando configuracion configManager", e);
  }
  }
};
>>>>>>> Stashed changes
