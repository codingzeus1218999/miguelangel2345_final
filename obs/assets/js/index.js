let websocket = new WebSocket(wsUri);

const init = () => {
  webSocket();
};

const webSocket = () => {
  websocket.onopen = (evt) => {
    onOpen(evt);
  };
  websocket.onmessage = (evt) => {
    onMessage(evt);
  };
  websocket.onerror = (evt) => {
    onError(evt);
  };
  websocket.onclose = (evt) => {
    onClose(evt);
  };
};

const onOpen = (evt) => {};

const onMessage = (evt) => {
  const { type, data } = JSON.parse(evt.data);
  if (type === "betting-latest") {
    if (Object.keys(data).length === 0) {
      $("#titulo").text("There is no any betting history");
      $("#titulo").removeClass("text-danger");
    } else {
      $("#titulo").html(`${data.title}<br />${data.description}`);
      $("#titulo").removeClass("text-danger");
      $("#minbet").text(data.minAmount);
      $("#maxbet").text(data.maxAmount);
      $("#time").text(formatTimeToHMS(data.remainingSeconds));
      let totalbets = 0;
      let totalamount = 0;
      let betcommands = "";
      let opcionesHtml = "";
      let infos = [];
      for (let i = 0; i < data.options.length; i++) {
        let pp = {
          option: data.options[i].case,
          command: data.options[i].command,
          color: colors[i],
          point: 0,
        };
        totalbets += data.options[i].participants.length;
        betcommands += `<p><b>${data.options[i].command}</b></p>`;
        for (let j = 0; j < data.options[i].participants.length; j++) {
          totalamount += data.options[i].participants[j].amount;
          pp.point += data.options[i].participants[j].amount;
        }
        infos.push({ ...pp });
      }
      $("#totalbets").text(totalbets);
      $("#totalamount").text(totalamount);
      $("#betcommands").html(betcommands);
      for (let i = 0; i < infos.length; i++) {
        const info = infos[i];
        opcionesHtml += `
        <div>
          <div class="row" style="color: ${info.color} !important;">
            <div class="col-4">OPCION ${info.option}</div>
            <div class="col-6">${info.command}</div>
            <div class="col-2 text-right">${
              (info.point / totalamount) * 100
            }%</div>
          </div>
          <div class="d-flex bg-light" style="height: 20px; border-radius: 6px; overflow: hidden;">
            <div style="width: ${
              (info.point / totalamount) * 100
            }%; background-color: ${info.color};"></div>
          </div>
        </div>`;
        // opcionesHtml += `
        // <div style='width: ${
        //   (info[i].point / totalamount) * 100
        // }%; background-color: ${info[i].color}' class='pt-betting-bar'>
        //   <p>${info[i].title} (${info[i].point})</p>
        // </div>`;
      }
      $("#opciones").html(opcionesHtml);
    }
  }
};

const onError = (evt) => {};

const onClose = (evt) => {
  $("#titulo").text("Something went wrong with server...");
  $("#titulo").addClass("text-danger");
  websocket.close();
};

window.addEventListener("load", init, false);
