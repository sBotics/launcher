import { URLdictionary, DataRequest } from '../utils/connection-manager.js';
import { GeoFinder } from '../utils/geo-manager.js';

const NextCompetitionGenerator = (data) => {
  const dataContainer = `<div class="col-12 col-md-4" style="margin-bottom: 15px" ><div class="card" style="width: 100%; border: 0px solid black; border-radius: 13px;"><img src="${data['img']}"style="width: 100%;height: 230px;object-fit: cover;border-radius: 10px 10px 0px 0px;"/><div class="card-body shadow-lg"><h5 class="card-title text-dark">${data['title']}</h5><p class="card-text text-secondary">${data['description']}</p><p class="card-text"><small class="text-muted">${data['open_in']}</small></p><div class=" w-100 d-flex  justify-content-end align-items-center" ><a onclick="OpenNextCompetition('${data['url']}')" target="_blank" class="btn btn-success">Saiba Mais</a></div></div></div></div>`;
  document.getElementById('RowContainerCompetition').innerHTML += dataContainer;
};

const NextCompetition = async () => {
  const geoFinder = await GeoFinder();
  const dataRequest = await DataRequest({
    url: URLdictionary['NextCompetition'],
  });
  if (dataRequest.competition.length != 0) {
    document.getElementById('ContainerCompetitionCBotics').style.display =
      'block';
  }
  dataRequest.competition.map((data) => {
    const locales = data.locales.length != 0 ? data.locales : false;
    const regions = data.regions.length != 0 ? data.regions : false;
    if (!locales && !regions) return NextCompetitionGenerator(data);
    locales.map((dataL) => {
      if (dataL == geoFinder['country']) {
        if (!regions) return NextCompetitionGenerator(data);
        regions.map((dataR) => {
          if (dataR == geoFinder['region']) NextCompetitionGenerator(data);
        });
      }
    });
  });
};

export { NextCompetition };
