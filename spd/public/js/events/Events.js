var EventType = {
   KICKBACK: 1,
   BROTHERHOOD: 2,
   PROFESSIONAL: 3
};

// First, we define the general parent 'Event' class
var Event = function(title, location, start, end, type, isPublic, description) {
   this.title = title;
   this.location = location;
   this.start = start;
   this.end = end;
   this.type = type;
   this.isPublic = isPublic;
   this.description = description;
};

// These give the 'Event' class a few (core) functions
Event.prototype.toString = function() {
   console.log("Title: " + this.title + "\nLocation: " + this.location);
};
Event.prototype.getTitle = function() {
   return this.title;
};

/***************************************************************************************************/

// This defines the 'KickbackEvent' constructor
// Notice that it's not assigned to a var
function KickbackEvent(title, location, start, end, type, isPublic, description, isOpen) {
   // Call the parent constructor
   Event.call(this, title, location, start, end, type, isPublic, description);
   
   // Set Kickback-specific properties
   this.isOpen = isOpen;
};

// Set KickbackEvent to inherit from Event
KickbackEvent.prototype = Object.create(Event.prototype);
// Set the constructor
KickbackEvent.prototype.constructor = KickbackEvent;

KickbackEvent.prototype.isEventOpen = function() {
   return this.isOpen;
};