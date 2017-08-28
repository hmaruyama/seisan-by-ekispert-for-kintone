jQuery(function($) {
  "use strict";


    kintone.events.on('app.record.create.show', function(event) {



      //詳細画面のメニュー部分の空白要素を取得
       var myHeaderSpace = kintone.app.record.getHeaderMenuSpaceElement();
       myHeaderSpace.innerHTML = "";
       //ダイアログを表示する関数を作成
       var showDialog = function() {
           $('.dialog_content').dialogModal({
               topOffset: 0,
               top: '10%',
               type: '',
               onOkBut: function() {},
               onCancelBut: function() {},
               onLoad: function(el, current) {},
               onClose: function() {},
               onChange: function(el, current) {}
           });
       };
        //ダイアログと表示内容を用意
       var createDialogContent = function() {
               var dialog_1 =
                $('<div id="dialog_content_1" class="dialog_content" style="display:none;">' +
                    '<div class="dialogModal_header">社員用ノートPCの申請</div>' +
                    '<div class="dialogModal_content">' +
                   'ノートPCの交換・追加が必要な方はこのアプリで申請してください。</br>' +
                    '標準機種をご要望の場合、' +
                    '標準機種一覧から選んでください。</br>' +
                     '標準機種情報の詳細は次の通りです。</br>' +
                      '<table border="1px">' +
                      '<tr><td>タイプ</td><td>Panasonic（レッツノート）</td><td>Fujitsu（ライフブック）</td></tr>' +
                      '<tr><td>サイズ</td><td> 12.1 inch</td><td> 12.5 inch</td></tr>' +
                      '<tr><td>OS</td><td>Windows 10 Pro</td><td>Windows 10 Pro</td></tr>' +
                      '<tr><td>メモリ</td><td>8 GiB</td><td>8 GiB</td></tr>' +
                      '<tr><td>ストレージ</td><td>256 GB SSD</td><td>256 GB SSD</td></tr>' +
                      '<tr><td>CPU</td><td> Core i5 6200U 2コア</td><td> Core i5 6200U 2コア</td></tr></table></br>' +
                    '標準機以外を申請した場合、ご希望の機種やスペックなどを詳しく書いたうえ、次の注意点をご確認ください。</br>' +
                    '<ul><li>故障した場合、代替機が素早きに手配できません。</li>' +
                    '<li>標準機では検証されているソフトウェアが動かないかもしれません。</li></ul>' +
                    'また、２台以上または標準機能以外をご希望の場合、上長の承認が必要となります。</br></br>' +
                    'パートナーや契約社員の場合、ノートPCを最大１台のみ申請できます。</br>' +
                    '尚、社内でのご利用のみ、社外へ持ち出しを禁止しております。</br></br>' +
                    '社外の方に貸し出す場合、次のページをご確認ください。</br>' +
                    'ノートPC利用際の注意事項についてページ3をご確認ください。' +
                    '</div>' +
                    '<div class="dialogModal_footer">' +
                        '<button class="btn btn-primary" data-dialogmodal-but="next" type="button">Next</button>' +
                        '<button class="btn btn-default" data-dialogmodal-but="cancel" type="button">Cancel</button>' +
                    '</div>' +
                    '</div>');

               var dialog_2 =
                $('<div id="dialog_content_2" class="dialog_content" style="display:none;">' +
                    '<div class="dialogModal_header">社外の方に貸し出す場合</div>' +
                    '<div class="dialogModal_content">' +
                    'イベントの参加者に対して、' +
                    'ノートパソコンを貸し出す場合、</br>' +
                    'このアプリでの申請が必要となります。' +
                    '申請時に必要な条件は以下です。' +
                    '<ul><li>同意書を取り交わしていること</li>' +
                    '<li>運用ルールを遵守できること</li></ul>' +
                     'ノートPCを申請した方が責任を持ってPCの管理をしてください。</br>' +
                     '社外の方が指定の場所のみ使えていただけます。</br>' +
                    'お使い後になるべく早く返還してください。</br>' +
                    'また、必要な機能のみ使えるように制限します。</br>' +
                    '</div>' +
                    '<div class="dialogModal_footer">' +
                        '<button class="btn btn-default btn-left" data-dialogmodal-but="prev" type="button">' +
                        'Back</button>' +
                        '<button class="btn btn-primary" data-dialogmodal-but="next" type="button">Next</button>' +
                        '<button class="btn btn-default" data-dialogmodal-but="cancel" type="button">Cancel</button>' +
                   '</div>' +
                '</div>');

               var dialog_3 =
                $('<div id="dialog_content_3" class="dialog_content" style="display:none;">' +
                    '<div class="dialogModal_header">社外に持ち出す場合の注意事項</div>' +
                    '<div class="dialogModal_content">' +
                    '持ち出しの設定を行ったPCだけ持ち出すことができます。</br>' +
                    '社外に持ち出す前に、上記の設定を行ってから、情報システム部にチェックを回してください。</br>' +
                     '故障以外での交換や追加購入が発生しないよう、慎重に選定して下さい。</br>' +
                     '二度手間を避けるため、受け取る際に足りない部品がないか確認して下さい。</br>' +
                     'PCを他の人に渡すのは禁止です。</br>' +
                      'PCの購買は情報システム部のみ行えます。</br>' +
                      '二度手間を避けるため、受け取る際に足りない部品がないか確認して下さい。</br>' +
                    '</div>' +
                    '<div class="dialogModal_footer">' +
                        '<button class="btn btn-default btn-left" data-dialogmodal-but="prev" type="button">' +
                        'Back</button>' +
                        '<button class="btn btn-primary" data-dialogmodal-but="ok" type="button">Ok</button>' +
                        '<button class="btn btn-default" data-dialogmodal-but="cancel" type="button">Cancel</button>' +
                    '</div>' +
                '</div>');

               $(myHeaderSpace).append(dialog_1).append(dialog_2).append(dialog_3);
           };

       createDialogContent();
        //popModalのボタンと説明をフォームにあわせて揃える
       $(myHeaderSpace).css({'padding-left': '20px'});
       $(myHeaderSpace).append(
            'ノートPC利用者によって申請ルールが異なってくるため、</br>登録前に必ず<b>ノートPC申請の注意事項</b>をご確認ください！</br>');
       var myPMBtn = $("<button>", {id: 'my_PM_button', text: 'ノートPC申請の注意事項', indent: '10'});
       //マウスをボタンに当てるときのボタン色を指定
       myPMBtn.hover(function() {
               $(this).css({'color': '#ececec', 'background': '#3498db'});
           }, function() {
               $(this).css({'color': '', 'background': ''});
           });
       myPMBtn.on('click', showDialog);
       $(myHeaderSpace).append(myPMBtn);



        // 出発駅を取得する
        // var event = event.record;
        // var stationDeparture = event.station_departure.value;

        // 任意のスペースフィールドにボタンを設置
        var mySpaceFieldButton = document.createElement('button');
        mySpaceFieldButton.id = 'my_space_field_button';
        mySpaceFieldButton.innerHTML = '申請内容追加';
        mySpaceFieldButton.onclick = function () {

            var record = kintone.app.record.get();
            console.log("record: " + JSON.stringify(record));
            var stationDeparture = record.record.station_departure.value;
            var stationArrival = record.record.station_arrival.value;
            // window.alert('スペースフィールド');
            var ekispert_uri_departure = encodeURI("https://api.ekispert.jp/v1/json/station?key=key&name=" + stationDeparture);
            var ekispert_uri_arrival = encodeURI("https://api.ekispert.jp/v1/json/station?key=key&name=" + stationArrival);

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
                // alert("出発駅候補：" + departurePoints);
                $('.modal').modal('show');
              });
            });
        }
        kintone.app.record.getSpaceElement('my_space_field').appendChild(mySpaceFieldButton);
    });
});
