# Setting Up a Web Interface Using ComfyUI

To quickly set up a web interface using ComfyUI, follow these steps:

## 1.Clone or Download the Repository:
Clone or download the repository directly into the `custom_nodes` directory within ComfyUI.

## 2.Run the ComfyUI Server:
Execute `run_nvidia_gpu.bat` or `run_cpu.bat`.

## 3.Replace the Default Workflow:
Follow these steps to replace the default workflow with your own:

- Enable Dev Mode Options: Click on "Settings" in the ComfyUI interface to enable Dev Mode Options.

- Generate Workflow JSON: Go back and click "Save (API Format)" to make a JSON for your workflow.

- Replace Base Workflow: Replace web/js/base_workflow.json with your JSON to use your workflow.

![comfygen](https://github.com/wei30172/comfygen/assets/60259324/b0b4f0f7-01fa-488e-aca0-24c38de18b18)

## 4.Workflow Node Configuration:
When setting up your workflow in ComfyUI, it’s essential to configure the nodes correctly. Here are some key nodes you may encounter:

- CLIPTextEncode Node (e.g., workflow['6']): Encodes the positive prompt text for image generation.

- CCLIPTextEncode Node for Negative Prompt (e.g., workflow['7']): Encodes the negative prompt to avoid certain features (e.g., watermarks).

- KSampler Node (e.g., workflow['3']): Generates images based on the encoded prompts.

Notes:

- Node identifiers (e.g., workflow['6'], workflow['7'], workflow['3']) may vary in other users' JSON files. Always check your specific workflow JSON for the correct node structure and settings.

- When replacing models, ensure to locate the appropriate model nodes and confirm if a seed value needs to be set.

## 5.Access the Web Interface:
Open your web browser and navigate to `http://<comfy_address>:<comfy_port>/<repository_name>` (e.g., http://127.0.0.1:8188/comfygen). 

# Project Screenshots
![comfygen](https://github.com/wei30172/comfygen/assets/60259324/a0427135-ba13-471d-ad37-559de57f8f54)
![comfygen](https://github.com/wei30172/comfygen/assets/60259324/3b5566f8-1dae-4986-ac73-e08bb26f0553)
![comfygen](https://github.com/wei30172/comfygen/assets/60259324/ceb9a127-ac22-44a0-9b75-49247d35a07e)
