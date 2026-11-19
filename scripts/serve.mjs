import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(import.meta.dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.wasm':'application/wasm','.bcmap':'application/octet-stream','.pfb':'application/octet-stream','.ttf':'font/ttf'};

export async function startServer({port=4176,basePath='/'}={}){
 if(!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(basePath))throw Error('Use a base path such as /zin-studio/.');
 const server=createServer(async(req,res)=>{
  try{
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(!pathname.startsWith(basePath))throw Error('Not found');
   const relative=pathname.slice(basePath.length)||'index.html';
   if(relative.split(/[\\/]/).some(part=>part.startsWith('.'))||relative.includes('\\'))throw Error('Not found');
   const file=resolve(root,relative);
   if(!file.startsWith(root+sep))throw Error('Not found');
   const body=await readFile(file);
   res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
   res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404);res.end('Not found');}
 });
 await new Promise((accept,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',accept);});
 return {server,url:`http://127.0.0.1:${server.address().port}${basePath}`};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const {url}=await startServer({port:Number(process.env.PORT||4176)});
 console.log('Zin Studio: '+url+' (Ctrl+C to stop)');
}
