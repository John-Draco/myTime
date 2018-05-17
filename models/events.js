let mongoose = require('mongoose');

//event schema

let eventsSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true   
  },
  description: {
    type: String,
    required: true   
  },
  hours: {
    type: Number,
    required: true   
  },
  start: {
    type: String,
    required: true   
  },
  end: {
    type: String,
    required: true   
  }
  
});

let Events = module.exports = mongoose.model('Events', eventsSchema);