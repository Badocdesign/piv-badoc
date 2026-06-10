// api/enviar.js — recebe o briefing e envia o email via Resend
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const d = req.body || {};
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Briefing Badoc <onboarding@resend.dev>',
        to: [process.env.EMAIL_DESTINO],
        subject: `Novo briefing · ${d.nome || 'Marca sem nome'}`,
        html: montarEmail(d)
      })
    });
    if (resp.ok) { res.status(200).json({ ok: true }); }
    else { const t = await resp.text(); res.status(500).json({ error: t }); }
  } catch (e) { res.status(500).json({ error: String(e) }); }
};

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function qa(q,a){ if(!a) return ''; return `<div class="qa"><div class="q">${esc(q)}</div><div class="a">${esc(a)}</div></div>`; }

function montarEmail(d){
  const LOGO = '<svg class="brand-logo" viewBox="0 0 526.9 135.91" role="img" aria-label="Badoc"><path d="M362.84,135.63c-27.7-.18-50.09-22.88-49.89-50.58.19-27.71,22.89-50.09,50.58-49.9,27.7.19,50.09,22.87,49.9,50.58-.2,27.7-22.89,50.09-50.59,49.9ZM363.33,64.78c-11.36-.08-20.67,9.1-20.76,20.47-.07,11.37,9.11,20.67,20.48,20.75,11.36.08,20.67-9.11,20.75-20.47.08-11.37-9.11-20.68-20.47-20.75Z"/><path d="M50.24,35.43c-7.34,0-14.32,1.6-20.61,4.43V0H0v135.91l29.63-4.45c6.29,2.85,13.27,4.45,20.61,4.45,27.7,0,50.23-22.54,50.23-50.24s-22.53-50.24-50.23-50.24ZM47.69,106.28c-11.37,0-21.25-9.24-21.25-20.61s9.88-20.61,21.25-20.61,21.25,9.25,21.25,20.61-9.89,20.61-21.25,20.61Z"/><path d="M208.63,85.67c0,27.7,22.54,50.24,50.25,50.24,7.34,0,14.32-1.6,20.61-4.45l29.63,4.45V0h-29.63v39.86c-6.29-2.84-13.27-4.43-20.61-4.43-27.71,0-50.25,22.54-50.25,50.24ZM240.18,85.67c0-11.36,9.88-20.61,21.25-20.61s21.25,9.25,21.25,20.61-9.89,20.61-21.25,20.61-21.25-9.24-21.25-20.61Z"/><path d="M154.56,35.43c-27.71,0-50.25,22.54-50.25,50.24s22.54,50.24,50.25,50.24c7.34,0,14.32-1.6,20.61-4.45l29.63,4.45v-50.24c0-27.7-22.53-50.24-50.24-50.24ZM157.11,106.28c-11.37,0-21.25-9.24-21.25-20.61s9.88-20.61,21.25-20.61,21.25,9.25,21.25,20.61-9.89,20.61-21.25,20.61Z"/><path d="M512.6,37.01c-7.9,0-14.3-6.4-14.3-14.3s6.4-14.3,14.3-14.3,14.3,6.4,14.3,14.3-6.4,14.3-14.3,14.3ZM512.6,10.5c-6.64,0-12.01,5.49-12.01,12.21s5.37,12.21,12.01,12.21,12.05-5.49,12.05-12.21-5.41-12.21-12.05-12.21ZM516.07,30.53l-3.6-6.4h-2.37v6.4h-2.17v-15.68h5.33c2.73,0,4.94,2.05,4.94,4.7,0,2.29-1.42,3.71-3.36,4.31l3.75,6.68h-2.53ZM513.03,16.78h-2.92v5.49h2.92c1.74,0,2.96-1.15,2.96-2.73s-1.23-2.77-2.96-2.77Z"/><path d="M485.65,95.14c-3.51,6.5-10.4,10.91-18.28,10.85-11.36-.08-19.27-9.39-19.2-20.75.08-11.36,8.12-20.55,19.48-20.47,7.79.05,14.55,4.44,18.01,10.85l23.84-17.81c-8.93-13.55-24.23-22.55-41.64-22.67-27.7-.19-50.39,22.19-50.58,49.9-.19,27.7,22.19,50.4,49.89,50.58,17.65.12,33.26-8.93,42.32-22.68l-23.83-17.8Z"/></svg>';

  const tags = (d.personalidade||[]).filter(Boolean).map(t=>`<span>${esc(t)}</span>`).join('');
  const corTitulo = d.corAtributo ? (' &middot; '+esc(d.corAtributo)) : (d.corFamilia ? (' &middot; '+esc(d.corFamilia)) : '');
  const corBloco = d.corPrimaria ? `
      <div class="sec"><h2>Cor${corTitulo}</h2>
        <div class="pal">
          <div class="c"><div class="role">Primária</div><div class="chip" style="background:${esc(d.corPrimaria)}"></div><div class="hx">${esc(d.corPrimaria)}</div></div>
          ${d.corSecundaria?`<div class="c"><div class="role">Secundária</div><div class="chip" style="background:${esc(d.corSecundaria)}"></div><div class="hx">${esc(d.corSecundaria)}</div></div>`:''}
        </div>
      </div>` : '';
  const persBloco = tags ? `<div class="sec"><h2>Personalidade</h2><div class="tags">${tags}</div>${d.personalidadeLinha?`<div class="read">${esc(d.personalidadeLinha)}</div>`:''}</div>` : '';
  const visItens = [
    d.tipografia?`<div class="item"><div class="lbl">Tipografia</div><div class="big">${esc(d.tipografia)}</div></div>`:'',
    d.simboloEstilo?`<div class="item"><div class="lbl">Símbolo</div><div class="big">${esc(d.simboloEstilo)}</div></div>`:''
  ].join('');
  const visBloco = (visItens||d.simboloMental)?`<div class="sec"><h2>Direção visual</h2>${visItens?`<div class="vis">${visItens}</div>`:''}${qa('Imagem que vem à mente',d.simboloMental)}</div>`:'';

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#eef0ef;color:#15211b;line-height:1.5;margin:0;padding:24px 14px 50px;}
  .mail{max-width:600px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;}
  .head{background:#00a651;color:#fff;padding:30px 30px 26px;}
  .brand-logo{height:24px;width:auto;display:block;margin-bottom:18px;}
  .brand-logo path{fill:#fff;}
  .head .tag{font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;opacity:.9;}
  .head h1{font-size:27px;font-weight:700;line-height:1.1;margin:6px 0 0;}
  .body{padding:8px 30px 30px;}
  .sec{padding:22px 0;border-bottom:1px solid #e6e9e7;}
  .sec h2{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#00a651;font-weight:700;margin:0 0 14px;}
  .qa{margin-bottom:14px;}
  .q{font-size:12px;font-weight:600;color:#7c8580;margin-bottom:2px;}
  .a{font-size:15px;}
  .tags{margin-bottom:12px;}
  .tags span{display:inline-block;font-size:12.5px;font-weight:600;border:1px solid #e6e9e7;background:#f6f7f6;border-radius:30px;padding:6px 13px;margin:0 7px 7px 0;}
  .read{font-size:14px;color:#3c453f;}
  .vis .item{display:inline-block;vertical-align:top;margin-right:34px;margin-bottom:8px;}
  .vis .lbl{font-size:12px;font-weight:600;color:#7c8580;margin-bottom:6px;}
  .vis .big{font-size:22px;font-weight:600;}
  .pal .c{display:inline-block;vertical-align:top;width:140px;margin-right:10px;}
  .pal .role{font-size:11px;font-weight:600;color:#7c8580;margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;}
  .pal .chip{height:64px;border-radius:11px;border:1px solid rgba(0,0,0,.06);}
  .pal .hx{font-size:11px;font-weight:500;color:#7c8580;margin-top:6px;}
  .foot{font-size:12px;color:#7c8580;text-align:center;padding:18px 30px;}
</style></head><body>
  <div class="mail">
    <div class="head">${LOGO}<div class="tag">Novo diagnóstico visual recebido</div><h1>${esc(d.nome)||'Marca sem nome'}</h1></div>
    <div class="body">
      <div class="sec"><h2>O negócio</h2>
        ${qa('Fase',d.fase)}
        ${qa('Por que escolhem a marca',d.diferencial)}
        ${qa('Se a marca fosse uma pessoa',d.pessoa)}
        ${qa('Cliente ideal',d.cliente)}
        ${qa('Concorrentes',d.concorrentes)}
      </div>
      ${persBloco}
      ${visBloco}
      ${corBloco}
      <div class="sec" style="border-bottom:none;"><h2>Logística</h2>${qa('Objetivo do projeto',d.objetivo)}${qa('Onde a marca será vista',d.pontos)}</div>
    </div>
    <div class="foot">Diagnóstico gerado pelo briefing interativo da Badoc&#174; Design de Marcas</div>
  </div>
</body></html>`;
}
