$(document).ready(function () {

  // Datepicker
  var $inputDate = $('#data_date').pickadate({
    format: 'yyyy-mm-dd',
    hiddenName: true
  });

  // Picker object
  var picker = $inputDate.pickadate('picker');

  // Timepicker
  var $inputStartTime = $('#data_startTime').pickatime({
    format: 'H:i',
    formatLabel: undefined,
    formatSubmit: undefined,
    hiddenPrefix: undefined
  });

  var $inputEndTime = $('#data_endTime').pickatime({
    format: 'H:i',
    formatLabel: undefined,
    formatSubmit: undefined,
    hiddenPrefix: undefined
  });

  // Utility functions
  var util = {
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },

    pluralize: function (count, word) {
      return count === 1 ? word : word + 's';
    },

    store: function (namespace, data) {
      if (arguments.length > 1) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      } else {
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
      }
    },

    objectPropInArray: function (list, prop, val) {
      if (list.length > 0) {
        for (var i in list) {
          if (list[i][prop] === val) {
            return true;
          }
        }
      }
      return false;
    },


    findOne: function (haystack, item) {
      return haystack.includes(item);

    },


    firstWord: function (str) {
      let spacePos = str.indexOf(' ');
      if (spacePos === -1) {
        return str;
      } else {
        return str.substr(0, spacePos);
      }

    },



  };


  // Form Data
  var inputData = {
    submitData: function () {
      this.id = util.uuid();
      this.client = $('#data_client').val().trim();
      this.description = $('#data_description').val().trim();
      this.hours = parseInt($('#data_hours').val());
      this.date = moment($('#data_date').val().trim()).format('LL');
      this.startTime = function () {
        var begTime = $('#data_startTime').val().trim();
        if (begTime.length < 5) {
          return "0" + begTime;
        } else {
          return begTime;
        }
      }
      this.endTime = function () {
        var finalTime = $('#data_endTime').val().trim();
        if (finalTime.length < 5) {
          return "0" + finalTime;
        } else {
          return finalTime;
        }
      }
      this.startDate = $('#data_date').val().trim() + " " + this.startTime();
      this.endDate = $('#data_date').val().trim() + " " + this.endTime();
      console.log(this);

      //Validate and then Post to server
      $.ajax({
        type: "POST",
        url: "http://www.mybillablecalendar/events",
        dataType: 'json',
        data: {
          id: this.id,
          title: this.client,
          description: this.description,
          hours: this.hours,
          start: this.startDate,
          end: this.endDate
        },
        success: function (result) {
          console.log("you have succesfully saved" + result + " to the database");
        }
      });

      //Redirect back to home page

    }
  }


  // Form Submission Handler
  $('#submitForm').on('click', function (e) {
    e.preventDefault(); //prevent href & page refresh from triggering
    inputData.submitData.apply(inputData);

    var newEvent = {
      id: inputData.id,
      title: inputData.client,
      description: inputData.description,
      hours: inputData.hours,
      start: inputData.startDate,
      end: inputData.endDate,
      editable: true,
    }

    $('#calendar').fullCalendar('renderEvent', newEvent, true);
  });


  // Full Calendar Object
  $('#calendar').fullCalendar({
    themeSystem: 'bootstrap3',
    defaultView: 'month',
    height: 'parent',
    header: {
      left: 'prev, next today',
      center: 'title',
      right: 'month, agendaWeek, agendaDay'
    },
    navLinks: true,
    navLinkDayClick: 'agendaDay',
    function (date, jsEvent) {
      console.log('day', date.format()); // date is a moment
      console.log('coords', jsEvent.pageX, jsEvent.pageY);
    },
    selectable: true,
    events: function (start, end, timezone, callback) {
      $.ajax({
        url: "http://www.mybillablecalendar/start",
        dataType: 'json',
        data: {
          start: start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD")
        },
        success: function (result) {
          var events = [];
          var data = result;
          data.forEach(function (element) {
            events.push({
              id: element.id,
              title: element.title,
              description: element.description,
              hours: element.hours,
              start: element.start,
              end: element.end
            });
          });

          console.log(events);
          callback(events);

        }
      });
    },

    displayEventEnd: true,

    eventClick: function (event, jsEvent, view) {
      $('#modalId').val(event.id);
      $('.modal-title').html(event.title);
      $('#clientModal').html(event.title);
      $('.hoursPara').html(event.hours);
      $('.startPara').html(event.start._i);
      $('.endPara').html(event.end._i);
      $('.descriptionPara').html(event.description);
      $('#eventModal').modal();
    }
  });


  //Event Handlers
  $('#delete-event').click(function (events) {
    var id = $('#modalId').val();
    $('#calendar').fullCalendar('removeEvents', id);
    $("#calendar").fullCalendar('addEventSource', events);

    $.ajax({
      type: 'DELETE',
      url: "http://www.mybillablecalendar/deleteEvents/" + id,
      success: function (response) {
        alert('Deleting Event');
        window.location.href = '/';
      },
      error: function (err) {
        console.log(err);
      }


    });


    $('#eventModal').modal('hide');

    console.log("event deleted");
  });


});