const InterfaceSettings = (
  state = false,
  elementeContent = 'config-content',
) => {
  document.getElementById(elementeContent).style.display = state
    ? 'block'
    : 'none';
};

const RelatorioDownloadManager = (state) => {
  document.getElementById('RelatorioDonwloadView').style.display = state
    ? 'flex'
    : 'none';
};
