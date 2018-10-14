$(() => {
  let fileInput = $('input[name="dropbox"]')
  fileInput.on('change', async () => {
    let formData = new FormData()
    console.log('d', formData)
    for (file of fileInput[0].files) {
      console.log('f', file)
      formData.append('uploads[]', file)
    }
    let response = await (await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    })).json()
    console.log('r', response)
    let editor = $('trix-editor.tx1')[0].editor
    for (let files of response) {
      for (let file in files) {
        editor.insertHTML(`<h1>${file}</h1>
          <p>${files[file]}<p>`)
      }
    }
  })
})
