jQuery(function($) {
  "use strict";

  function toArray(obj) {
    if (!Array.isArray(obj)) { return [obj] }
    else { return obj }
  }

  function editRecord(depStationName, arrStationName, route, price) {
    var record = kintone.app.record.get();
    record.record.dep_station_1.value = depStationName;
    record.record.arr_station_1.value = arrStationName;
    record.record.route_1.value = route;
    record.record.price_1.value = price;

    kintone.app.record.set(record);
  }

  function testtesttest() {

    var depStationPart;
    var arrStationPart;
    var courseResult;
    var inputOptions = {};
    var selectRoutes = {};
    var depStation = {};
    var arrStation = {};

    var search1Button = document.createElement('button');
    search1Button.id = 'search_1_button';
    search1Button.innerHTML = '経路を探索する!';


    search1Button.onclick = function () {

      swal({
        title: "駅を入力してください",
        allowOutsideClick: false,
        showCancelButton: true,
        html:'出発<div id="input-dep-station"></div>到着<div id="input-arr-station"></div><div id="course-result" style="display:none;">',
        onOpen: function () {
          // 出発駅
          depStationPart = new expGuiStation(document.getElementById("input-dep-station"));
          depStationPart.setConfigure("ssl", true);
          depStationPart.dispStation();

          // 到着駅
          arrStationPart = new expGuiStation(document.getElementById("input-arr-station"));
          arrStationPart.setConfigure("ssl", true);
          arrStationPart.dispStation();

          // 探索結果
          courseResult = new expGuiCourse(document.getElementById("course-result"));
          courseResult.setConfigure("ssl", true);
        },
        preConfirm: function () {
          return new Promise(function (resolve) {
            depStation.name = depStationPart.getStationName();
            depStation.code = depStationPart.getStationCode();
            arrStation.name = arrStationPart.getStationName();
            arrStation.code = arrStationPart.getStationCode();
            if (!depStation.code || !arrStation.code) {
              swal.showValidationError("駅を選択してください。");
              resolve();
              return;
            }
            var searchObject = courseResult.createSearchInterface();
            searchObject.setAnswerCount(3);
            searchObject.setSearchType('plain');
            searchObject.setViaList(depStation.code + ':' + arrStation.code);
            courseResult.search(searchObject, function(isSuccess) {
              if(!isSuccess){
                swal.showValidationError("探索結果が取得できませんでした");
                resolve();
                return;
              }
              for (var i = 1; i <= courseResult.getResultCount(); i++) {
                courseResult.changeCourse(i);
                var onewayPrice = courseResult.getPrice(courseResult.PRICE_ONEWAY);
                var pointList = courseResult.getPointList().split(',');
                var lineList = courseResult.getLineList().split(',');
                var routeStr = "";
                for (var j = 0; j < pointList.length; j++) {
                  if (lineList[j]) {
                    routeStr += pointList[j] + " - [" + lineList[j] + "] - "
                  } else {
                    routeStr += pointList[j]
                  }
                }
                selectRoutes[String(i)] = {
                  route: routeStr,
                  price: onewayPrice
                }
                inputOptions[String(i)] = routeStr + " 片道" +  onewayPrice + "円";
              }
              resolve();
            });
          })
        }
      }).then(function (result) {
        swal({
          title: '経路を選択してください',
          showCancelButton: true,
          allowOutsideClick: false,
          input: 'radio',
          inputOptions: inputOptions,
          inputValidator: function(value) {
            return !value && "経路を選択してください。"
          }
        }).then(function (result) {
          if(result.value){
            swal({
              title: '受け付けました！',
              type: "success"
            })

            editRecord(depStation.name, arrStation.name, selectRoutes[result.value].route, selectRoutes[result.value].price);

          }
        })
      })

    }
    kintone.app.record.getSpaceElement('search_1').appendChild(search1Button);

  }


  kintone.events.on('app.record.create.show', function(event) {
    testtesttest()

  });
  kintone.events.on('app.record.edit.show', function(event) {
    testtesttest()

  });
});
