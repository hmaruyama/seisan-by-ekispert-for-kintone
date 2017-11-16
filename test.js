jQuery(function($) {
  "use strict";


  var ekispertDomain = "https://api.ekispert.jp"
  var ekispertAccessKey = ""

  function toArray(obj) {
    if (!Array.isArray(obj)) { return [obj] }
    else { return obj }
  }

  $('#button').click(function() {

    swal({
      title: "駅を入力してください",
      html:
        '出発<div id="input-departure-station">' + '<br>' +
        '到着<input id="input-arrival-station">',
      preConfirm: function (email) {
        return new Promise(function (resolve, reject) {

          // window.onload = function() {
          //   init();
          // }
          setTimeout(function() {
            var departureStation = $('#input-departure-station').val();
            var arrivalStation = $('#input-arrival-station').val();
            if (!departureStation || !arrivalStation) {
              reject('駅を入力してください。')
            } else {
              resolve([ departureStation, arrivalStation ])
            }
          }, 500)
        })
      },
      onOpen: function () {
        console.log("bbb");
        var stationApp;
        function init(){
          console.log("aaa")
          stationApp = new expGuiStation(document.getElementById("input-departure-station"));
          stationApp.dispStation();
        }
        init();
        $('#input-departure-station').focus()
      }
    }).then(function (result) {
      swal({
        type: "success",
        html: '選択を受け付けました！'
      })
    }).catch(swal.noop)


    var stationApp;
    function init(){
      stationApp = new expGuiStation(document.getElementById("departure-station"));
      stationApp.dispStation();
    }
    window.onload = function() {
      init();
    }
  })
});
