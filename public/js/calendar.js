var SITEURL = window.location.origin;
  $(document).ready(function () {
        $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').prop('content')
          }
        });

        var calendarEl = document.getElementById("calendar");
        var calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ["dayGrid", "timeGrid", "interaction"],
            editable: true,
            events: SITEURL + "/fullcalendar/index",
            displayEventTime: true,
            eventRender: function (event, element, view) {
                if (event.allDay === 'true') {
                    event.allDay = true;
                } else {
                    event.allDay = false;
                }
            },
            header: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },
            locale: "hu",
            selectable: true,
            selectMirror: true,
            select: function (info) {
                $("#delete").prop("hidden", true);
                showModal(info.allDay, moment(info.start).format("YYYY-MM-DDTHH:mm:ss"), moment(info.end).format("YYYY-MM-DDTHH:mm:ss"));
            },

            eventDrop: function (info) {
                        var start = moment(info.event.start).format("YYYY-MM-DD HH:mm:ss")
                        var end = moment(info.event.end).format("YYYY-MM-DD HH:mm:ss");
                        var title = info.event.title;
                        var allDay = info.event.allDay;
                        var id = info.event.id;
                        updateEvent(id, title, start, end, allDay);
                    },
            eventClick: function (info) {
                $("#delete").prop("hidden", false);
                showModal(info.event.allDay, info.event.start, info.event.end, info.event.title, info.event.id);
            }

        });

        calendar.render();

        $("#event-form").submit(function(e) {
            e.preventDefault();
            $("#modal").modal("hide");
            var start = $("#start").val();
            var end = $("#end").val();
            var title = $("#title").val();
            var id= $("#event_id").val();
            var allDay= $("#all-day").prop("checked");
            if(title && !id) {
                $.ajax({
                        url: SITEURL + "/fullcalendar/create",
                        data: 'title=' + title + '&start=' + start + '&end=' + end + "&allDay=" + allDay,
                        type: "POST",
                        success: function (data) {
                            displayMessage("Added Successfully");
                        },
                        error: function (jqXHR, textStatus, error) {
                            alert(error.message);
                        }
                    });
                    calendar.addEvent(
                            {
                                title: title,
                                start: start,
                                end: end,
                                allDay: allDay
                            },
                            );
            }

            if(title && id) {
                updateEvent(id, title, start, end, allDay)
                var event=calendar.getEventById(id);
                event.setProp("title", title);
                event.setDates(start, end);
                $("#event_id").val(null);
            }
        });

        $("#delete").click(function() {
            var deleteMsg = confirm("Do you really want to delete?");
            if (deleteMsg) {
                $.ajax({
                    type: "POST",
                    url: SITEURL + '/fullcalendar/delete',
                    data: "&id=" + $("#event_id").val(),
                    success: function (response) {
                        if(parseInt(response) > 0) {
                            toBeDeleted = calendar.getEventById($("#event_id").val());
                            toBeDeleted.remove();
                            displayMessage("Deleted Successfully");
                            $("#event_id").val(null);
                        }
                    }
                });
            }
            $("#modal").modal("hide");
        })

        $("#all-day").change(function() {
            var start = $("#start");
            var end = $("#end");
            var allDay = $("#all-day").prop("checked");
            disable(start, allDay);
            disable(end, allDay);
        })


    });


  function displayMessage(message) {
    $(".response").html("<div class='success'>"+message+"</div>");
    setInterval(function() { $(".success").fadeOut(); }, 1000);
  }

  function updateEvent(id, title, start, end, allDay) {
    $.ajax({
        url: SITEURL + '/fullcalendar/update',
        data: 'id=' + id + '&title=' + title + '&start=' + start + '&end=' + end + '&allDay=' + allDay,
        type: "POST",
        success: function (response) {
            displayMessage("Updated Successfully");
        }
    });
  }

  function showModal(allDay, start, end, title, eventId) {
        $("#event_id").val(eventId);
        $("#title").val(title);
        $("#start").val(start);
        $("#end").val(end);
        $("#all-day").prop("checked",allDay);
        if(allDay){
            $("#start").prop("disabled", true);
            $("#end").prop("disabled", true);
        }
        else {
            $("#start").prop("disabled", false);
            $("#end").prop("disabled", false);
            $("#start").val(moment(start).format("YYYY-MM-DDTHH:mm:ss"));
            $("#end").val(moment(end).format("YYYY-MM-DDTHH:mm:ss"));
        }
        $("#modal").modal();
  }

  function disable(element, state) {
      element.prop("disabled", state);
  }
