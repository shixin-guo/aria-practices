var MenuButtonInput = function (inputNode, buttonNode, messageNode, datepicker) {
  this.inputNode    = inputNode;
  this.buttonNode   = buttonNode;
  this.messageNode  = messageNode;
  this.imageNode    = false;

  this.datepicker = datepicker;

  this.ignoreFocusEvent = false;
  this.ignoreBlurEvent = false;
  this.lastEventFocus = false;

  this.hasFocusFlag = false;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

MenuButtonInput.prototype.init = function () {
  this.inputNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.inputNode.addEventListener('focus', this.handleFocus.bind(this));
  this.inputNode.addEventListener('blur', this.handleBlur.bind(this));

  this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
  this.buttonNode.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleButtonKeyDown.bind(this));

  if (this.inputNode.nextElementSibling &&
      this.inputNode.nextElementSibling.tagName.toLowerCase() == 'img') {
    this.imageNode = this.inputNode.nextElementSibling;
  }

  if (this.imageNode) {
    this.imageNode.addEventListener('click', this.handleClick.bind(this));
  }

  this.setMessage('');
};

MenuButtonInput.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.DOWN:
      this.datepicker.show();
      this.ignoreBlurEvent = true;
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.datepicker.hide(false);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.ignoreBlurEvent = true;
      this.datepicker.hide(false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuButtonInput.prototype.handleTouchStart = function (event) {

  if (event.targetTouches.length === 1) {
    console.log('[handleTouchStart][tagName]: ' + event.targetTouches[0].target.tagName);
    if (this.comboboxNode.contains(event.targetTouches[0].target)) {
      if (this.isCollapsed()) {
        this.showDownArrow();
        this.datepicker.show();
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
  }
};

MenuButtonInput.prototype.handleFocus = function () {
  console.log('[MenuButtonInput][handleFocus]')
  if (!this.ignoreFocusEvent && this.isCollapsed()) {
    this.setMessage('Use the down arrow key to move focus to the datepicker grid.');
  }
  this.showDownArrow();

  this.lastEventFocus = true;
  this.hasFocusFlag = true;
  this.ignoreFocusEvent = false;

};


MenuButtonInput.prototype.handleBlur = function () {
  if (!this.ignoreBlurEvent) {
    this.setMessage('');
  }
  this.hideDownArrow();

  this.lastEventFocus = false;
  this.hasFocusFlag = false;
  this.ignoreBlurEvent = false;
};

MenuButtonInput.prototype.handleClick = function (event) {
  console.log('[MenuButtonInput][handleClick]: ' + event.target.tagName);
  if (this.lastEventFocus) {
    this.lastEventFocus = false;
    return;
  }

  if (this.isCollapsed()) {
    this.datepicker.show();
  }
  else {
    this.ignoreFocusEvent = true;
    this.datepicker.hide();
  }

  this.lastEventFocus = false;

};

MenuButtonInput.prototype.handleButtonClick = function (event) {
  this.ignoreBlurEvent = true;
  this.datepicker.show();
  this.datepicker.setFocusDay();

  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuButtonInput.prototype.handleButtonKeyDown = function (event) {

  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.handleButtonClick();
      this.ignoreBlurEvent = true;
      this.setFocusDay();
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuButtonInput.prototype.focus = function () {
  this.inputNode.focus();
};

MenuButtonInput.prototype.setAriaExpanded = function (flag) {

  if (flag) {
    if (this.comboboxNode) {
      this.comboboxNode.setAttribute('aria-expanded', 'true');
    }
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }
  else {
    if (this.comboboxNode) {
      this.comboboxNode.setAttribute('aria-expanded', 'false');
    }
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }

};

MenuButtonInput.prototype.getAriaExpanded = function () {
  if (this.comboboxNode) {
    return this.comboboxNode.getAttribute('aria-expanded') === 'true';
  }
   return this.buttonNode.getAttribute('aria-expanded') === 'true';
};

MenuButtonInput.prototype.isCollapsed = function () {
  return this.inputNode.getAttribute('aria-expanded') !== 'true';
};

MenuButtonInput.prototype.setDate = function (month, day, year) {
  this.inputNode.value = (month + 1) + '/' + (day + 1) + '/' + year;
};

MenuButtonInput.prototype.getDate = function () {
  return this.inputNode.value;
};

MenuButtonInput.prototype.setMessage = function (str) {
  return this.messageNode.textContent = str;
};

MenuButtonInput.prototype.hasFocus = function () {
  return this.hasFocusflag;
};

MenuButtonInput.prototype.showDownArrow = function () {
  if (this.imageNode) {
    this.imageNode.style.visibility = 'visible';
  }
};

MenuButtonInput.prototype.hideDownArrow = function () {
  if (this.imageNode) {
    this.imageNode.style.visibility = 'hidden';
  }
};

// Initialize menu button date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('.datepicker');

  datePickers.forEach(function (dp) {
    var dpInput = dp.querySelector('input');
    var dpButton = dp.querySelector('button');
    var dpMessage = dp.querySelector('.message');
    var dpDialog = dp.querySelector('[role=dialog]');
    var datePicker = new DatePicker(null, dpInput, dpButton, dpDialog, dpMessage);
    datePicker.init();
  });

});