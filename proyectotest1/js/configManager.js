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
  };