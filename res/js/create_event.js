var title = "";
var event_location = "";
var startTime = "";
var endTime = "";
var eventType = -1;
var isPublic = false;
var description = "";

var submitted = false;

// debug function
var showMe = function() {
   console.log("Title: " + title);
   console.log("Location: " + event_location);
   console.log("Start Time: " + startTime);
   console.log("End Time: " + endTime);
   console.log("Is Internal: " + isInternal);
   console.log("Is Public: " + isPublic);
   console.log("Description: " + description);
   
   //var internal = new InternalEvent(title);
   
   //console.log(internal.getTitle());
};



var fullSubmission = function(form) {
   // TODO
   document.getElementById('eventSpecific').style.display = 'none';
};


var generateKickbackDiv = function() {
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
   
   return div;
};


var formSubmit = function(form) {
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
   eventType = form[4].value;
   isPublic = form[5].value === 'public';
   description = form[6].value;
   
   /* This check may be not needed anymore...*/
   if (submitted) {
      return;
   }
   
   submitted = true;
   document.getElementById('requiredInformation').style.display = 'none';
   
   if (eventType == EventType.KICKBACK) {
      var form = generateKickbackDiv();
      document.getElementById('eventSpecific').appendChild(form);
   } else if (eventType == EventType.PROFESSIONAL) {
      // TODO
   } else if (eventType == EventType.BROTHEROOD) {
      // TODO
   } else {
      console.log("Not yet implemented");
   }
   
   
};


/* BELOW THIS IS THE ONLOAD FUNCTIONALITY */

/* This function walks through the 'EventType' enum (defined in Events.js) and
   adds an option automatically */
var populateEventTypes = function() {
   var select = document.getElementById('eventSelect');
   
   for (var key in EventType) {
      var opt = document.createElement('option');
      opt.value = EventType[key];
      opt.text = key;
      select.appendChild(opt);
   }
};

/* This is the function that is called when the DOM is all done.
   Setup functions should be put in here */
var ready = function() {
   
   populateEventTypes();
};

// Set 'ready' to be the function called when the DOM is ready
document.addEventListener('load', ready, true);