jQuery(function($) {
  "use strict";


  kintone.events.on('app.record.create.show', function(event) {

    var mySpaceFieldButton = document.createElement('button');
    mySpaceFieldButton.id = 'my_space_field_button';
    mySpaceFieldButton.innerHTML = '申請内容追加';
    mySpaceFieldButton.onclick = function () {

      var record = kintone.app.record.get();
      console.log("record: " + JSON.stringify(record));
      var stationDeparture = record.record.station_departure.value;
      var stationArrival = record.record.station_arrival.value;

      var ekispert_uri_departure = encodeURI("https://api.ekispert.jp/v1/json/station?key=wC4SR9ETBhBcJ3Bv&name=" + stationDeparture);
      var ekispert_uri_arrival = encodeURI("https://api.ekispert.jp/v1/json/station?key=wC4SR9ETBhBcJ3Bv&name=" + stationArrival);

     $.get(ekispert_uri_departure, function(data){
        var departurePoints = [];
        var point = JSON.parse(data).ResultSet.Point;
        if(point.length) {
          for(var i=0; i < point.length; i++) {
            departurePoints.push(point[i].Station.Name);
          }
        } else {
          departurePoints.push(point.Station.Name);
        }
        $.get(ekispert_uri_arrival, function(data){
          console.log("Arrival: " + JSON.stringify(data));
          swal({
            title: '経路を選択してください',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function (email) {
              return new Promise(function (resolve, reject) {
                setTimeout(function() {
                  if (email === 'taken@example.com') {
                    reject('This email is already taken.')
                  } else {
                    resolve()
                  }
                }, 2000)
              })
            },
            allowOutsideClick: false
          }).then(function (email) {
            swal({
              type: 'success',
              title: 'Ajax request finished!',
              html: 'Submitted email: ' + email
            })
          })
        });
      });
    }
    kintone.app.record.getSpaceElement('my_space_field').appendChild(mySpaceFieldButton);
  });
});
