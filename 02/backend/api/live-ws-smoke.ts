const MODEL='gemini-3.5-live-translate-preview';
const WS_BASE='wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';

export async function GET(): Promise<Response> {
  try {
    const tokenResponse=await fetch('https://wdfox.vercel.app/api/live-token',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({target:'sk'})
    });
    const tokenData:any=await tokenResponse.json().catch(()=>({}));
    if(!tokenResponse.ok||!tokenData?.token){
      return Response.json({ok:false,stage:'token',status:tokenResponse.status,error:tokenData?.error||'token failed'},{status:502,headers:{'Cache-Control':'no-store'}});
    }

    const result=await new Promise<any>((resolve)=>{
      const ws=new WebSocket(`${WS_BASE}?access_token=${encodeURIComponent(tokenData.token)}`);
      const timer=setTimeout(()=>{
        try{ws.close()}catch{}
        resolve({ok:false,stage:'websocket',error:'timeout'});
      },9000);
      ws.onopen=()=>{
        ws.send(JSON.stringify({
          setup:{
            model:`models/${MODEL}`,
            generationConfig:{
              responseModalities:['AUDIO'],
              translationConfig:{targetLanguageCode:'sk',echoTargetLanguage:false}
            },
            inputAudioTranscription:{},
            outputAudioTranscription:{}
          }
        }));
      };
      ws.onmessage=(event:any)=>{
        let message:any;
        try{message=JSON.parse(String(event.data))}catch{return}
        if(message?.setupComplete){
          clearTimeout(timer);
          try{ws.close(1000,'smoke')}catch{}
          resolve({ok:true,stage:'setupComplete',model:MODEL,target:'sk'});
        } else if(message?.error){
          clearTimeout(timer);
          try{ws.close()}catch{}
          resolve({ok:false,stage:'gemini',error:message.error});
        }
      };
      ws.onerror=()=>{
        clearTimeout(timer);
        resolve({ok:false,stage:'websocket',error:'socket error'});
      };
    });

    return Response.json(result,{status:result.ok?200:502,headers:{'Cache-Control':'no-store'}});
  } catch(error:any){
    return Response.json({ok:false,stage:'exception',error:error?.message||'smoke failed'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
