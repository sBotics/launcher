const AddEvent = (id, path) => {
  document.getElementById(
    'relatorioDownloadContainer',
  ).innerHTML += `<div class="relatorio_download_options" style="margin-top: 5px"><h6 class="text-dark" style="margin: 0px; padding: 0px" id="relatorioEventPath_${id}">${path}</h6><h6 class="text-dark" style="margin: 0px; padding: 0px; font-size: 12px" id="relatorioEventParcentage_${id}">0%</h6></div>`;
};

const UpdateEventParcent = (id, value) => {
  document.getElementById(
    `relatorioEventParcentage_${id}`,
  ).innerHTML = `${value}%`;
};

export { AddEvent, UpdateEventParcent };
