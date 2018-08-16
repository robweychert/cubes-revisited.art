function navToggle() {
  element = document.querySelector(".variations");
  element.classList.toggle("closed");
}

function togglify(item) {
  document.querySelector(item).addEventListener('click', navToggle);
  document.querySelector(item).removeAttribute('href');
}

document.body.className += ' js-enabled';

document.querySelector('.variations').classList.add('closed');

navPosition = document.body.className;
dropDown = document.querySelectorAll('.v-link');

for (i = 0; i < dropDown.length; ++i) {
  j = dropDown[i].className.slice(-3, dropDown[i].length);
  console.log(j);
	if (navPosition.includes(j)) {
    current = '.v-link.' + j;
    console.log(current);
    togglify(current);
    dropDown[i].classList.add('current');
    break;
	}
}

togglify('.v-subhead');