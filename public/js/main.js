
let state = {}
const defaultState = {
  currentStage: 0,
  previousStage: null,
  documentContents: '',
  translatedContents: '',
  targetLocale: 'es',
  summaryLength: 6,
  translated: false
}

const stages = [{
  query: '#stage-1',
  load: () => {
    $('#stage-1').show()
  },
  unload: () => {
    $('.tx2')[0].editor.loadHTML($('.tx1')[0].value)
    $('#stage-1').hide()
  }
}, {
  query: '#stage-2',
  load: () => {
    $('#stage-2').show()
  },
  unload: () => {
    $('.tx1')[0].editor.loadHTML($('.tx2')[0].value)
    $('#stage-2').hide()
  }
}]

function setState(newState) {
  Object.assign(state, defaultState, newState)
  localStorage.setItem('state', JSON.stringify(state))
}

function loadEditors() {
  $('.tx1')[0].editor.loadHTML(state.documentContents)
  $('.tx2')[0].editor.loadHTML(state.documentContents)
  $('.tx3')[0].editor.loadHTML(state.translatedContents)
}

function hideInactiveStages() {
  stages.filter((s, i) => i != state.currentStage).forEach(stage => stage.unload())
}

function updateStage() {
  stages[state.previousStage].unload()
  stages[state.currentStage].load()
}

function nextPage() {
  setState({
    previousStage: state.currentStage,
    currentStage: Math.min(stages.length - 1, state.currentStage + 1)
  })
  updateStage()
}

function prevPage() {
  setState({
    previousStage: state.currentStage,
    currentStage: Math.max(0, state.currentStage - 1)
  })
  updateStage()
}

async function translate() {
  console.log('TRANS')
  // TODO: Request to translate
  $('.tx3')[0].editor.loadHTML('TODO')
  setState({
    translated: true
  })
}

$(() => {
  setState(JSON.parse(localStorage.getItem('state') || '{}'))
  loadEditors()
  hideInactiveStages()
  $('a.next-page').on('click', nextPage)
  $('a.prev-page').on('click', prevPage)
  $('a.translate').on('click', translate)

  $('.tx3').on('trix-change', function () {
    setState({
      translatedContents: this.value
    })
  })
  $('.tx1').on('trix-change', function () {
    setState({
      documentContents: this.value
    })
  })
  $('.tx2').on('trix-change', function () {
    setState({
      documentContents: this.value
    })
  })
})

/*
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

  function updateView() {

  }

  const STAGES = ['TRANSCRIPT', 'TRANSLATE', 'TRANSFORM']
  let stage = 0
  $('#next').on('click', function(e){
    stage++
    $(e.target).closest('#page1').
    $(e.target).closest('#closest').find("#page2").css('display', 'visible');

  });

})*/