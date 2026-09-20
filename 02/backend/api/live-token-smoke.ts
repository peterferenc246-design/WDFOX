export async function GET(): Promise<Response> {
  try {
    const response = await fetch('https://wdfox.vercel.app/api/live-token', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({target:'sk'})
    });
    const data:any = await response.json().catch(()=>({}));
    return Response.json({
      ok: response.ok && Boolean(data?.token),
      status: response.status,
      model: data?.model || null,
      target: data?.target || null,
      hasToken: Boolean(data?.token),
      error: data?.error || null,
      detail: data?.detail || null
    }, {status: response.ok ? 200 : 502, headers:{'Cache-Control':'no-store'}});
  } catch (error:any) {
    return Response.json({ok:false,error:error?.message || 'smoke failed'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
