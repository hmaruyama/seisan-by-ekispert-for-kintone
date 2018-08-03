(function($) {
  "use strict";

  // 駅すぱあとWebサービスのアクセスキー
  var ekispertAccessKey = '';
  var coursePart;

  kintone.events.on(['app.record.detail.show'], function(event) {
    var resultJson = event.record['経路表示データ'].value;

    var courseResultSpace = document.createElement('div');
    courseResultSpace.id = 'course-result';
    kintone.app.record.getSpaceElement('course-result-space').appendChild(courseResultSpace);

    // 探索結果
    coursePart = new expGuiCourse(document.getElementById("course-result"));
    coursePart.setConfigure("ssl", true);
    coursePart.setConfigure("key", ekispertAccessKey);

    coursePart.setResult(resultJson);

  });
})(jQuery);
