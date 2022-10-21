"use strict";

const tsTranspiledEvent = new Event('tsTranspiled');

const workerFile = window.URL.createObjectURL(
  new Blob(
    [
      `
        const load = sourceUrl => {
          const xhr = XMLHttpRequest
            ? new XMLHttpRequest()
            : ActiveXObject
            ? new ActiveXObject('Microsoft.XMLHTTP')
            : null;

          if (!xhr) return '';

          xhr.open('GET', sourceUrl, false);
          xhr.overrideMimeType && xhr.overrideMimeType('text/plain');
          xhr.send(null);
          return xhr.status == 200 ? xhr.responseText : '';
        };

        onmessage = ({data: [sourceUrl, sourceCode, tsconfig, tspath]}) => {

          importScripts(tspath);

          const raw = sourceCode ? sourceCode : load(sourceUrl);
          const transpiled = ts.transpile(raw,tsconfig.compilerOptions);
          postMessage(transpiled);
        };
      `,
    ],
    {type: 'text/javascript'},
  ),
);

window.addEventListener('DOMContentLoaded', () => {
  fetch('/tsconfig.json').then((response) => response.json()).then( async (tsconfig) => {
    
    const scripts = document.getElementsByTagName('script');
    let pending = [];

    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].type === 'text/typescript') {
        const {src} = scripts[i];
        const innerHtml = src ? null : scripts[i].innerHTML;
        
        pending.push(
          new Promise(resolve => {
            const w = new Worker(workerFile);
            w.postMessage([src, innerHtml, tsconfig, `${ document.location }libraries/typescript/typescript.4.8.4.js`]);
            w.onmessage = ({data: transpiled}) => {

              window.addEventListener('tsTranspiled', function() {
                
                const newScript = document.createElement('script');
                newScript.innerHTML = transpiled;
                scripts[i].replaceWith(newScript);
                
              });
              
              w.terminate();
              resolve();
            }
          }),
        );
      }
    }

    await Promise.all(pending);
    window.dispatchEvent(tsTranspiledEvent);
  });
})
