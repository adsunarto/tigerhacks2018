$(function () {
  var dropZoneId = "drop-zone";
  var buttonId = "clickHere";
  var mouseOverClass = "mouse-over";

  var dropZone = $("#" + dropZoneId);
  var ooleft = dropZone.offset().left;
  var ooright = dropZone.outerWidth() + ooleft;
  var ootop = dropZone.offset().top;
  var oobottom = dropZone.outerHeight() + ootop;
  var inputFile = dropZone.find("input");
  document.getElementById(dropZoneId).addEventListener("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.addClass(mouseOverClass);
      var x = e.pageX;
      var y = e.pageY;

      if (!(x < ooleft || x > ooright || y < ootop || y > oobottom)) {
          inputFile.offset({ top: y - 15, left: x - 100 });
      } else {
          inputFile.offset({ top: -400, left: -400 });
      }

  }, true);

  if (buttonId != "") {
      var clickZone = $("#" + buttonId);

      var oleft = clickZone.offset().left;
      var oright = clickZone.outerWidth() + oleft;
      var otop = clickZone.offset().top;
      var obottom = clickZone.outerHeight() + otop;

      $("#" + buttonId).mousemove(function (e) {
          var x = e.pageX;
          var y = e.pageY;
          if (!(x < oleft || x > oright || y < otop || y > obottom)) {
              inputFile.offset({ top: y - 15, left: x - 160 });
          } else {
              inputFile.offset({ top: -400, left: -400 });
          }
      });
  }

  document.getElementById(dropZoneId).addEventListener("drop", function (e) {
      $("#" + dropZoneId).removeClass(mouseOverClass);
  }, true);

  // var url = "http://161.130.188.235/api/transcribe"  
  // let fileInput = document.querySelector('input[name="file"]');
  //   fileInput.addEventListener('change', () => {
  //     let formData = new FormData();
  //     console.log('d', formData);
  //     for (file of fileInput.files) {
  //       console.log('f', file);
  //       formData.append('uploads[]', file);
  //     }
  //     let request = new XMLHttpRequest();
  //     request.open("POST", url);
  //     request.send(formData);
  // })  
  
  $('#next').on('click', function(e){
    $(e.target).closest('#page1').css('display', 'none');
    $(e.target).closest('#closest').find("#page2").css('visibility', 'visible');    

  });

})