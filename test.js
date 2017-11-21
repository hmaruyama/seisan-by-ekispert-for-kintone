jQuery(function($) {
  "use strict";

  function toArray(obj) {
    if (!Array.isArray(obj)) { return [obj] }
    else { return obj }
  }

var stationDeparturePart;
var stationArrivalPart;
var courseResult;
var inputOptions;

function init(){
  stationDeparturePart = new expGuiStation(document.getElementById("input-departure-station"));
  stationDeparturePart.setConfigure("ssl", true);
  stationDeparturePart.dispStation();
  stationArrivalPart = new expGuiStation(document.getElementById("input-arrival-station"));
  stationArrivalPart.setConfigure("ssl", true);
  stationArrivalPart.dispStation();
  // courseResult = new expGuiCourse(document.getElementById("result"));
  // courseResult.setConfigure("ssl", true);
}

  $('#button').click(function() {

    swal({
      title: "駅を入力してください",
      showCancelButton: true,
      html:'出発<div id="input-departure-station"></div>' +'到着<div id="input-arrival-station"></div>',
      preConfirm: function () {
        return new Promise(function (resolve, reject) {

          setTimeout(function() {
            var departureStationCode = stationDeparturePart.getStationCode();
            var arrivalStationCode = stationArrivalPart.getStationCode();
            if (!departureStationCode || !arrivalStationCode) {
              reject('駅が選択されていないようです。')
            } else {
              inputOptions = {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc"
              }
              resolve([ departureStationCode, arrivalStationCode ])
            }
          }, 500)
        })
      },
      onOpen: function () {
        init();
      }
    }).then(function (result) {
      swal({
        html: '経路を選択してください',
        input: 'radio',
        inputOptions: inputOptions
      }).then(function (result) {
        swal({
          html: '受け付けました！'
        })
      })
    })
  })
});
