import { URLdictionary, DataRequest } from '../utils/connection-manager.js';
import { GeoFinder } from '../utils/geo-manager.js';
import { Lang } from '../utils/language-manager.js';

const NextCompetitionGenerator = (data) => {
  const dataVerification = `<div style="color: #2FA9C2;"><svg viewBox="0 0 20 20" fill="currentColor" style="width: 1.5rem;height: 1.5rem;"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div>`;
  const dataContainer = `<div class="col-12 col-md-4" style="margin-bottom: 15px" ><div class="card" style="width: 100%; border: 0px solid black; border-radius: 13px;"><img src="${
    data['img']
  }" style="width: 100%;height: 230px;object-fit: cover;border-radius: 10px 10px 0px 0px;"/><div class="card-body shadow-lg"><div class="w-100 d-flex justify-content-between align-items-center" style="margin-bottom: 1rem;"><p class="card-text" style="padding: 0px; margin: 0px;"><small class="text-muted">${
    data['open_in']
  }</small></p>${
    data['verified_competition'] ? dataVerification : ''
  }</div><h5 class="card-title text-dark">${
    data['title']
  }</h5><p class="card-text text-secondary">${
    data['description']
  }</p><p class="card-text"><small class="text-muted">${
    data['participating_teams']
  }</small></p><div class=" w-100 d-flex  justify-content-end align-items-center" ><a onclick="OpenNextCompetition('${
    data['url']
  }')" target="_blank" class="btn btn-success">${Lang(
    'Details',
  )}</a></div></div></div></div>`;
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
    if (!data['state']) return;
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
