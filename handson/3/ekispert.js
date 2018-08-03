(function($) {
  "use strict";

  // 駅すぱあとWebサービスのアクセスキー
  var ekispertAccessKey = '';

  kintone.events.on(['app.record.edit.change.明細', 'app.record.create.change.明細', 'app.record.create.show', 'app.record.edit.show'], function(event) {
    var table = event.record['明細'].value;
    for (var i = 0; i < table.length; i++) {
      table[i].value['隠しパラメータ'].disabled = true;
      if(table[i].value['入力方法'].value == '駅すぱあと') {
        table[i].value['経路'].disabled = true;
        table[i].value['金額'].disabled = true;
      }
    }
    return event;
  });

  kintone.events.on(['app.record.edit.change.入力方法', 'app.record.create.change.入力方法'], function(event) {
    var changeRow = event.changes.row;
    if(changeRow.value['入力方法'].value == '駅すぱあと') {
      // 編集中のテーブル行をマーク
      changeRow.value['隠しパラメータ'].value = 'true';
    } else { // 入力方法 == '手入力' の場合
      changeRow.value['経路'].disabled = false;
      changeRow.value['金額'].disabled = false;
    }
    return event;
  });

  kintone.events.on(['app.record.edit.change.隠しパラメータ', 'app.record.create.change.隠しパラメータ'], function(event) {

    if ($('#course-result').length) { $('#course-result').remove(); }

    var coursePartSpace = document.createElement('div');
    coursePartSpace.id = 'course-result';
    kintone.app.record.getSpaceElement('course-result-space').appendChild(coursePartSpace);

    var changeRow = event.changes.row;
    if(!changeRow.value['隠しパラメータ'].value) { return; }

    var date = changeRow.value['日付'].value.replace(/-/g, '');
    var depStationPart;
    var arrStationPart;
    var coursePart;
    var teikiSerializeData;
    var depStationCode;
    var arrStationCode;
    var selectRoute = {};
    var conditionPart;

    swal({
      title: '駅を入力してください',
      html:'<div id="condition"></div>出発<div id="input-dep-station"></div>到着<div id="input-arr-station"></div>',
      onOpen: function () {
        // 出発駅
        depStationPart = new expGuiStation(document.getElementById('input-dep-station'));
        depStationPart.setConfigure('ssl', true);
        depStationPart.setConfigure('key', ekispertAccessKey);
        depStationPart.dispStation();

        // 到着駅
        arrStationPart = new expGuiStation(document.getElementById('input-arr-station'));
        arrStationPart.setConfigure('ssl', true);
        arrStationPart.setConfigure('key', ekispertAccessKey);
        arrStationPart.dispStation();

        // 探索結果
        coursePart = new expGuiCourse(document.getElementById('course-result'));
        coursePart.setConfigure('ssl', true);
        coursePart.setConfigure('key', ekispertAccessKey);
        coursePart.setConfigure('window', true);
        coursePart.setConfigure('checkEngineVersion', false);

        // 探索条件
        conditionPart = new expGuiCondition(document.getElementById('condition'));
        conditionPart.setConfigure('ssl', true);
        conditionPart.setConfigure('key', ekispertAccessKey);
        conditionPart.dispCondition();

      },
      preConfirm: function () {
        return new Promise(function (resolve) {
          depStationCode = depStationPart.getStationCode();
          arrStationCode = arrStationPart.getStationCode();
          if (!depStationCode || !arrStationCode) {
            swal.showValidationError('駅を選択してください。');
            resolve();
            return;
          }
          teikiSerializeData = kintone.app.record.get().record['通勤経路'].value;
          var searchObject = coursePart.createSearchInterface();
          searchObject.setDate(date);
          searchObject.setSearchType('plain');
          searchObject.setViaList(depStationCode + ':' + arrStationCode);
          searchObject.setAnswerCount(conditionPart.getAnswerCount());
          searchObject.setSort(conditionPart.getSortType());
          searchObject.setConditionDetail(conditionPart.getConditionDetail());
          searchObject.setPriceType(conditionPart.getPriceType());
          if (teikiSerializeData) { searchObject.setAssignTeikiSerializeData(teikiSerializeData); }
          coursePart.bind('select', function() {
            coursePart.changeCourse(coursePart.getResultNo());
            var onewayPrice = coursePart.getPrice(coursePart.PRICE_ONEWAY);
            var pointList = coursePart.getPointList().split(',');
            var lineList = coursePart.getLineList().split(',');
            var routeStr = '';
            for (var j = 0; j < pointList.length; j++) {
              if (lineList[j]) {
                routeStr += pointList[j] + ' - [' + lineList[j] + '] - '
              } else {
                routeStr += pointList[j]
              }
            }
            selectRoute = {
              route: routeStr,
              price: onewayPrice
            }
            // テーブル値の更新
            var rec = kintone.app.record.get();
            var tableRecord = rec.record['明細'].value;

            for(var i = 0; i < tableRecord.length; i++) {
              if(tableRecord[i].value['隠しパラメータ'].value == 'true') {
                tableRecord[i].value['経路'].value = selectRoute.route;
                tableRecord[i].value['金額'].value = selectRoute.price;
                tableRecord[i].value['隠しパラメータ'].value = '';
                tableRecord[i].value['経路'].disabled = true;
                tableRecord[i].value['金額'].disabled = true;
              }
            }
            kintone.app.record.set(rec);
            swal({
              title: '受け付けました！',
              type: 'success'
            })
          });
          coursePart.bind('close', function() {
            // テーブル値の更新
            var rec = kintone.app.record.get();
            var tableRecord = rec.record['明細'].value;

            for(var i = 0; i < tableRecord.length; i++) {
              if(tableRecord[i].value['隠しパラメータ'].value == 'true') {
                tableRecord[i].value['入力方法'].value = '手入力';
                tableRecord[i].value['隠しパラメータ'].value = '';
              }
            }
            kintone.app.record.set(rec);
            return;
          })
          coursePart.search(searchObject, function(isSuccess) {
            if(!isSuccess){
              swal.showValidationError('探索結果が取得できませんでした');

              // テーブル値の更新
              var rec = kintone.app.record.get();
              var tableRecord = rec.record['明細'].value;

              for(var i = 0; i < tableRecord.length; i++) {
                if(tableRecord[i].value['隠しパラメータ'].value == 'true') {
                  tableRecord[i].value['入力方法'].value = '手入力';
                  tableRecord[i].value['隠しパラメータ'].value = '';
                }
              }
              kintone.app.record.set(rec);
              resolve();
              return;
            }
            resolve();
          });
        })
      }
    }).then(function (result) {
      if (!depStationCode || !arrStationCode) {

        // テーブル値の更新
        var rec = kintone.app.record.get();
        var tableRecord = rec.record['明細'].value;

        for(var i = 0; i < tableRecord.length; i++) {
          if(tableRecord[i].value['隠しパラメータ'].value == 'true') {
            tableRecord[i].value['入力方法'].value = '手入力';
            tableRecord[i].value['隠しパラメータ'].value = '';
          }
        }
        kintone.app.record.set(rec);
        return;
      }
    })
  });
})(jQuery);
