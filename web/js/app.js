// Use an async IIFE to start the application
(async () => {
  const serverAddress = `${window.location.hostname}:${window.location.port}`
  const clientId = uuidv4()
  const socketUrl = `ws://${serverAddress}/ws?clientId=${clientId}`
  const workflow = await loadWorkflow()
  
  const promptElement = document.getElementById('prompt')
  const sendPromptButton = document.getElementById('sendPromptButton')
  const mainBuildElement = document.getElementById('maingen')
  const cfgRescaleElement = document.getElementById('cfgrescale')

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
    // const response = await fetch('/comfygen/js/base_workflow.json')
    const response = await fetch('/comfygen/js/advanced_workflow.json')
    return response.json()
  }

  // Handle messages from WebSocket
  function handleSocketMessage(event) {
    const data = JSON.parse(event.data)
    
    if (data.type === 'executed' && 'images' in data['data']['output']) {
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
      alert("Please enter some text to generate an image.");
      return
    }
    
    // Clear the image
    mainBuildElement.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    
    // It's important to verify that the workflow node indexes
    // correspond to the correct nodes in your workflow JSON.
    workflow["6"]["inputs"]["text"] = text.replace(/(\r\n|\n|\r)/gm, " ")
    workflow["3"]["inputs"]["seed"] = Math.floor(Math.random() * 9999999999)
    
    // Check if the "RescaleCFG" node ("10") exists in the workflow.
    if ("10" in workflow && cfgRescaleElement.checked) {
      workflow["3"]["inputs"]["model"][0] = "10"
      workflow["3"]["inputs"]["cfg"] = "3.6"
    } else {
      workflow["3"]["inputs"]["model"][0] = "4" // Default model
      workflow["3"]["inputs"]["cfg"] = "2.1" // Default cfg value
    }

    const data = { prompt: workflow, client_id: clientId }
    
    await fetch('/prompt', {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
})()