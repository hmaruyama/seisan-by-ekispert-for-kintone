(function($) {
  "use strict";

  var courseResult;

  kintone.events.on(['app.record.detail.show'], function(event) {

    var courseResultSpace = document.createElement('div');
    courseResultSpace.id = 'course-result';
    kintone.app.record.getSpaceElement('course-result-space').appendChild(courseResultSpace);

    function init() {
      // 探索結果
      courseResult = new expGuiCourse(document.getElementById("course-result"));
      courseResult.setConfigure("ssl", true);
      courseResult.setConfigure("key", ekispert.accessKey);

      var resultJson = kintone.app.record.get().record["経路表示データ"].value;
      courseResult.setResult(resultJson);
    }

    window.addEventListener('load', init);

  });
})(jQuery);
