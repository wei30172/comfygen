// Use an async IIFE to start the application
(async () => {
  const serverAddress = `${window.location.hostname}:${window.location.port}`
  const clientId = uuidv4()
  const socketUrl = `ws://${serverAddress}/ws?clientId=${clientId}`
  const workflow = await loadWorkflow()
  const promptElement = document.getElementById('prompt')
  const sendPromptButton = document.getElementById('send-prompt-button')
  const mainBuildElement = document.getElementById('maingen')
  const progressBar = document.getElementById('main-progress')

  // Update the progress bar
  function updateProgress(max=0, value=0) {
    progressBar.max = max // Maximum value
    progressBar.value = value // Current progress value
  }

  // Connect to WebSocket
  const socket = new WebSocket(socketUrl)
  socket.addEventListener('open', () => console.log('Connected to the server'))
  socket.addEventListener('message', handleSocketMessage)

  // Event listener for the button click
  sendPromptButton.addEventListener('click', () => {
    const promptText = promptElement.value
    queuePromptWithText(promptText)
  })

  // Function to generate UUID
  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  }

  // Function to load the workflow
  async function loadWorkflow() {
    const response = await fetch('/comfygen/js/base_workflow.json')
    return response.json()
  }

  // Handle messages from WebSocket
  function handleSocketMessage(event) {
    const data = JSON.parse(event.data)
    // console.log({data})
    
    if (data.type === 'status') {
      updateProgress(0, 0)
    } else if (data.type === 'execution_start') {
      updateProgress(100, 1)
    } else if (data.type === 'progress') {
      updateProgress(data['data']['max'], data['data']['value'])
    } else if (data.type === 'executed' && 'images' in data['data']['output']) {
      const images = data['data']['output']['images'][0]
      updateImage(images.filename, images.subfolder)
    }
  }

  // Update the image source
  function updateImage(filename, subfolder) {
    const rand = Math.random()
    mainBuildElement.src = `/view?filename=${filename}&type=output&subfolder=${subfolder}&rand=${rand}`
  }
    
  //  Generate image
  async function queuePromptWithText(text) {
    // check if the text is empty
    if (!text.trim()) {
      alert('Please enter some text to generate an image.');
      return
    }
  
    workflow['6']['inputs']['text'] = text.replace(/(\r\n|\n|\r)/gm, ' ')
    workflow['3']['inputs']['seed'] = Math.floor(Math.random() * 9999999999)
    const data = { prompt: workflow, client_id: clientId }
    
    await fetch('/prompt', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
})()