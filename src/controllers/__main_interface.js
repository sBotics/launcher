const isScrolledIntoView = () => {
  const element = document.getElementById('__container_center_sbotics_action');
  const docViewTop = document.getElementById('__container_center').scrollTop;
  const docViewBottom =
    docViewTop + document.getElementById('__container_center').clientHeight;
  const elemTop = element.offsetTop;
  const elemBottom = elemTop + element.clientHeight;
  return elemBottom <= docViewBottom && elemTop >= docViewTop;
};

const CheckDimension = () => {
  if (window.innerWidth < 768) {
    document
      .getElementById('__container_fixed_sbotics_action')
      .classList.remove('hidden');
    document
      .getElementById('__container_fixed_sbotics_action')
      .classList.add('flex');
  }
  if (window.innerWidth > 768 && isScrolledIntoView()) {
    document
      .getElementById('__container_fixed_sbotics_action')
      .classList.remove('flex');
    document
      .getElementById('__container_fixed_sbotics_action')
      .classList.add('hidden');
  }
  return window.innerWidth > 768;
};

const LoadingController = (state) => {
  document.getElementById('__main_container').style.display = state ? 'none' :'block';
  document.getElementById('animation_loading').style.display = state ? 'block' :'none';
};

document.getElementById('__container_center').addEventListener('scroll', () => {
  if (CheckDimension()) {
    if (!isScrolledIntoView()) {
      document
        .getElementById('__container_fixed_sbotics_action')
        .classList.remove('hidden');
      document
        .getElementById('__container_fixed_sbotics_action')
        .classList.add('flex');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.remove('opacity-100');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.remove('delay-75');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.add('delay-150');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.add('opacity-0');
    } else {
      document
        .getElementById('__container_fixed_sbotics_action')
        .classList.remove('flex');
      document
        .getElementById('__container_fixed_sbotics_action')
        .classList.add('hidden');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.remove('delay-150');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.add('delay-75');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.remove('opacity-0');
      document
        .getElementById('__container_center_sbotics_action')
        .classList.add('opacity-100');
    }
  }
});

window.addEventListener('resize', function () {
  CheckDimension();
});

CheckDimension();
