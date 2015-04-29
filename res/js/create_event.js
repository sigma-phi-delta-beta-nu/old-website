var title = "";
var event_location = "";
var startTime = "";
var endTime = "";
var isInternal = false;
var isPublic = false;
var description = "";


var showMe = function() {
   console.log("Title: " + title);
   console.log("Location: " + event_location);
   console.log("Start Time: " + startTime);
   console.log("End Time: " + endTime);
   console.log("Is Internal: " + isInternal);
   console.log("Is Public: " + isPublic);
   console.log("Description: " + description);
};



var fullSubmission = function(form) {
   console.log('Done and done');
   
   var i = 0;
   while (i < (form.length - 1)) {
      console.log("Value from box[" + i + "]: " + form[i].value);
      ++i;
   }
   
   showMe();
   
};


/*
   Build the desired div here
*/

var showInternalInfo = function() {
   var div = document.createElement('div');
   div.innerHTML = "<h2>INTERNAL EVENT</h2>";
   
   var form = document.createElement('form');
   form.addEventListener('submit', function() {
      return fullSubmission(this);
   }, true);
   form.action = '#';
   
   var closedOption = document.createElement('option');
   closedOption.value = 'closed';
   closedOption.text = 'Closed Event';
   
   var openOption = document.createElement('option');
   openOption.value = 'open';
   openOption.text = 'Open Event';
   
   var select = document.createElement('select');
   select.appendChild(closedOption);
   select.appendChild(openOption);
   form.appendChild(select);
   
   var submit = document.createElement('input');
   submit.type = 'submit';
   form.appendChild(submit);
   
   div.appendChild(form);
   
   document.getElementById('eventSpecific').appendChild(div);
};

var formSubmit = function(form) {
   console.log("Form submitted");
   
   /*
   form[i] gets the input at i in the form.
   i = (number of form elements - 1) is the submit button
   
   form[i].value is the actual content
   
   datetime-local comes in in the form yyyy-mm-ddThh:mm eg: 2015-04-29T19:30 for April 29, 2015 at 7:30 pm
   */
   
   title = form[0].value;
   event_location = form[1].value;
   startTime = form[2].value;
   endTime = form[3].value;
   isInternal = form[4].value === 'internal';
   isPublic = form[5].value === 'public';
   description = form[6].value;
   
   
   if (isInternal) {
      showInternalInfo();
   } else {
      console.log("Not internal");
   }
   
   
};



var ready = function() {
   console.log("Ready to go");
};

var page = function() {
   document.addEventListener('load', ready, true);
};

page();