let websocket = new WebSocket(wsUri);
let requestBettingOngoing;

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

const onOpen = (evt) => {
  requestBettingOngoing = setInterval(() => {
    websocket.send(
      JSON.stringify({
        type: "betting-ongoing-request",
        data: {},
      })
    );
  }, 1000);
};

const onMessage = (evt) => {
  const { type, data } = JSON.parse(evt.data);
  if (type === "betting-ongoing") {
    if (Object.keys(data).length === 0) {
      $("#status-notice").text("There is no ongoing betting");
      $("#status-notice").removeClass("text-red-400");
      $("#betting-ongoing").addClass("hidden");
    } else {
      console.log(data);
      $("#status-notice").html(`<i>${data.title}</i> betting is ongoing`);
      $("#status-notice").removeClass("text-red-400");
      $("#betting-description").text(data.description);
      let optionsHtml = "";
      let pointsBarHtml = "";
      let t = 0;
      let info = [];
      let participantsHtml = "";
      for (let i = 0; i < data.options.length; i++) {
        optionsHtml += `<div class='flex gap-4'>
          <p>case: ${data.options[i].case}</p>
          <p>command: ${data.options[i].command}</p>
          <p>count of participants: ${data.options[i].participants.length}</p>
        </div>`;
        let pp = {
          title: data.options[i].case,
          color: colors[i],
          point: 0,
        };
        participantsHtml += `<div class='flex flex-col gap-3'>
          <p class='pt-label'>${data.options[i].case}</p>
          <hr />
        `;
        for (let j = 0; j < data.options[i].participants.length; j++) {
          t += data.options[i].participants[j].amount;
          pp.point += data.options[i].participants[j].amount;
          participantsHtml += `
          <p>${data.options[i].participants[j].user.name} => ${data.options[i].participants[j].amount} points</p>`;
        }
        info.push({ ...pp });
        participantsHtml += `</div>`;
      }
      $("#betting-options").html(optionsHtml);
      $("#betting-duration").text(`${data.duration} mins`);
      $("#betting-minAmount").text(`${data.minAmount} points`);
      $("#betting-maxAmount").text(`${data.maxAmount} points`);
      $("#betting-createdAt").text(
        moment(data.createdAt).format("hh:mm:ss MM/DD")
      );
      $("#betting-remainingTime").text(
        `${parseInt(data.remainingSeconds / 60)} mins ${parseInt(
          data.remainingSeconds % 60
        )} s`
      );
      for (let i = 0; i < info.length; i++) {
        pointsBarHtml += `
        <div style='width: ${(info[i].point / t) * 100}%; background-color: ${
          info[i].color
        }' class='pt-betting-bar'>
          <p>${info[i].title} (${info[i].point})</p>
        </div>`;
      }
      $("#betting-points").text(`(${t})`);
      if (t === 0) {
        $("#betting-pointsBar").html("");
      } else {
        $("#betting-pointsBar").html(pointsBarHtml);
      }
      $("#betting-participants").html(participantsHtml);
      $("#betting-ongoing").removeClass("hidden");
    }
  }
};

const onError = (evt) => {};

const onClose = (evt) => {
  $("#status-notice").text("Something went wrong with server...");
  $("#status-notice").addClass("text-red-400");
  $("#betting-ongoing").addClass("hidden");
  websocket.close();
  clearInterval(requestBettingOngoing);
};

window.addEventListener("load", init, false);
