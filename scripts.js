// Toggle the dropdown open and closed

function navToggle() {
  element = document.querySelector('.variations');
  element.classList.toggle('closed');
}

// Make an element a dropdown toggle button

function togglify(item) {
  document.querySelector(item).addEventListener('click', navToggle);
  document.querySelector(item).removeAttribute('href');
}

document.body.className += ' js-enabled';

// Close the dropdown by default

document.querySelector('.variations').classList.add('closed');

navPosition = document.body.className;
dropDown = document.querySelectorAll('.v-link');

// Deactivate the link for the nav item pointing to the
// current page and make it a dropdown toggle button

for (i = 0; i < dropDown.length; ++i) {
  j = dropDown[i].className.slice(-3, dropDown[i].length);
  // console.log(j);
	if (navPosition.includes(j)) {
    current = '.v-link.' + j;
    // console.log(current);
    togglify(current);
    dropDown[i].classList.add('current');
    break;
	}
}

// Make the "Variations" subhead a dropdown toggle button

togglify('.v-subhead');

// Close the dropdown when the user clicks outside of it
// http://blustemy.io/detecting-a-click-outside-an-element-in-javascript/

document.addEventListener("click", function(evt) {  
  var dropdownElement = document.querySelector('.variations'),
  targetElement = evt.target;  // clicked element

  do {
    if (targetElement == dropdownElement) {
      // This is a click inside. Do nothing, just return.
      return;
    }
    // Go up the DOM
    targetElement = targetElement.parentNode;
  } while (targetElement);
    // This is a click outside.
    // console.log('Clicked outside');
    variations = document.querySelector('.variations').className;
    if (variations.includes('closed') == false) {
      document.querySelector('.variations').classList.toggle('closed');
    }
});