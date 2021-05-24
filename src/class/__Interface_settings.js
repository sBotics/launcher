const InterfaceSettings = (
  state = false,
  elementeContent = 'config-content',
) => {
  document.getElementById(elementeContent).style.display = state
    ? 'block'
    : 'none';
};
