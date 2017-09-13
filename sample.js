jQuery(function($) {
  "use strict";

  var ekispertDomain = "https://api.ekispert.jp"
  var ekispertAccessKey = "wC4SR9ETBhBcJ3Bv"


  function toArray(obj) {
    if (!Array.isArray(obj)) { return [obj] }
    else { return obj }
  }


  kintone.events.on('app.record.create.show', function(event) {



    var mySpaceFieldButton = document.createElement('button');
    mySpaceFieldButton.id = 'my_space_field_button';
    mySpaceFieldButton.innerHTML = '経路を探索する';


    mySpaceFieldButton.onclick = function () {

      var record = kintone.app.record.get();
      console.log("record: " + JSON.stringify(record));
      var stationDeparture = record.record.station_departure.value;
      var stationArrival = record.record.station_arrival.value;

      var stationDepartureRequestParams = {
        "key": ekispertAccessKey,
        "name": stationDeparture
      };

      var stationArrivalRequestParams = {
        "key": ekispertAccessKey,
        "name": stationArrival
      };

     $.get(ekispertDomain + "/v1/json/station", stationDepartureRequestParams, function(data){})
     .done(function(data) {
        var departurePoints = toArray(JSON.parse(data).ResultSet.Point);

        $.get(ekispertDomain + "/v1/json/station", stationArrivalRequestParams, function(data){})
        .done(function(data) {
          var arrivalPoints = toArray(JSON.parse(data).ResultSet.Point);
          var routeSearchRequestParams = {
            "key": ekispertAccessKey,
            "viaList": departurePoints[0].Station.Name + ":" + arrivalPoints[0].Station.Name,
            "searchType": "plain"
          }

          $.get(ekispertDomain + "/v1/json/search/course/extreme", routeSearchRequestParams, function(data){})
          .done(function(data) {
            var course = JSON.parse(data).ResultSet.Course;

            var routeStrings = [];
            for(var i = 0; i < course.length; i++) {
              routeStrings[i] = ""
              // 経路を文字列で表現
              var route = course[i].Route;
              for(var j = 0; j < route.Point.length; j++) {
                routeStrings[i] += route.Point[j].Station.Name;
                var lines = toArray(route.Line);
                if(lines[j]) {
                  routeStrings[i] += "→" + lines[j].Name + "→";
                }
              }
            }

            var resolveObj = {}
            for(var i = 0; i < routeStrings.length; i++) {
              resolveObj['route' + i] = routeStrings[i] + "<br><br>";
            }


            var inputOptions = new Promise(function (resolve) {
              setTimeout(function () {
                resolve(resolveObj)
              }, 2000)
            })

            swal({
              title: '経路を選択してください',
              input: 'radio',
              inputOptions: inputOptions,
              inputValidator: function (result) {
                return new Promise(function (resolve, reject) {
                  if (result) {
                    resolve()
                  } else {
                    reject('選択されていません')
                  }
                })
              }
            }).then(function (result) {
              swal({
                type: 'success',
                html: '選択を受け付けました！'
              })
            })
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            var errorMessage = JSON.parse(jqXHR.responseText).ResultSet.Error.Message;
            alert(errorMessage);
          })
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          var errorMessage = JSON.parse(jqXHR.responseText).ResultSet.Error.Message;
          alert(errorMessage);
        })
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        var errorMessage = JSON.parse(jqXHR.responseText).ResultSet.Error.Message;
        alert(errorMessage);
      })
    }
    kintone.app.record.getSpaceElement('my_space_field').appendChild(mySpaceFieldButton);
  });
});
