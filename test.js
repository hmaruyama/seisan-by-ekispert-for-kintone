jQuery(function($) {
  "use strict";

  function toArray(obj) {
    if (!Array.isArray(obj)) { return [obj] }
    else { return obj }
  }

var stationDeparturePart;
var stationArrivalPart;
var inputOptions;

  $('#button').click(function() {

    swal({
      title: "駅を入力してください",
      showCancelButton: true,
      html:'出発<div id="input-departure-station"></div>' +'到着<div id="input-arrival-station"></div>',
      preConfirm: function () {
        return new Promise(function (resolve, reject) {

          setTimeout(function() {
            var departureStation = stationDeparturePart.getStationCode();
            var arrivalStation = stationArrivalPart.getStationCode();
            if (!departureStation || !arrivalStation) {
              reject('駅が選択されていないようです。')
            } else {
              inputOptions = {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc"
              }
              resolve([ departureStation, arrivalStation ])
            }
          }, 500)
        })
      },
      onOpen: function () {
        function init(){
          stationDeparturePart = new expGuiStation(document.getElementById("input-departure-station"));
          stationDeparturePart.dispStation();
          stationArrivalPart = new expGuiStation(document.getElementById("input-arrival-station"));
          stationArrivalPart.dispStation();
        }
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
