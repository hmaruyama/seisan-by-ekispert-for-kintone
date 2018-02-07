jQuery(function($) {
  "use strict";

  function toArray(obj) {
    if (!Array.isArray(obj)) { return [obj] }
    else { return obj }
  }

  function editRecord(route, price) {
    var rec = kintone.app.record.get();
    var tableRecord = rec.record['明細'].value;

    var today = moment().format("YYYY-MM-DD");

    var newRow = {
      value: {
        金額: {
          type: "NUMBER",
          value: price
        },
        経路: {
          type: "SINGLE_LINE_TEXT",
          value: route
        },
        訪問先: {
          type: "SINGLE_LINE_TEXT",
          value: ""
        },
        日付: {
          type: "DATE",
          value: today
        },
        入力方法: {
          type: "DROP_DOWN",
          value: "駅すぱあと"
        }
      }
    }

    tableRecord.push(newRow);
    kintone.app.record.set(rec);
  }

  kintone.events.on('app.record.edit.change.入力方法', function(event) {
    for(var i = 0; i < event.record['明細'].value.length; i++) {
      var tableRecord = event.record['明細'].value;
      if(tableRecord[i].value['入力方法'].value == '駅すぱあと') {
        tableRecord[i].value['金額'].disabled = true;
        tableRecord[i].value['経路'].disabled = true;
      }
    }
  });

  kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function(event) {


    // テーブル内編集不可処理
    for(var i = 0; i < event.record['明細'].value.length; i++) {
      var tableRecord = event.record['明細'].value;
      if(tableRecord[i].value['入力方法'].value == '駅すぱあと') {
        tableRecord[i].value['金額'].disabled = true;
        tableRecord[i].value['経路'].disabled = true;
      }
    }

    // メニュ右側の空白部分にボタンを設置
    var searchButton = document.createElement('button');
    searchButton.id = 'search_button';
    searchButton.innerHTML = '駅すぱあとから追加';
    searchButton.onclick = function() {

        var depStationPart;
        var arrStationPart;
        var courseResult;
        var inputOptions = {};
        var selectRoutes = {};
        var depStation = {};
        var arrStation = {};

        swal({
          title: "駅を入力してください",
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
          if (!depStation.code || !arrStation.code) {
            return;
          }
          swal({
            title: '経路を選択してください',
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

              editRecord(selectRoutes[result.value].route, selectRoutes[result.value].price);

            }
          })
        })

    }
    kintone.app.record.getHeaderMenuSpaceElement().appendChild(searchButton);


    return event;
  });
});
