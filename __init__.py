from .comfygen import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

import os
import server
from aiohttp import web

WEBROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "web")

@server.PromptServer.instance.routes.get("/comfygen")
def deungeon_entrance(request):
    return web.FileResponse(os.path.join(WEBROOT, "index.html"))

server.PromptServer.instance.routes.static("/comfygen/css/", path=os.path.join(WEBROOT, "css"))
server.PromptServer.instance.routes.static("/comfygen/js/", path=os.path.join(WEBROOT, "js"))

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']