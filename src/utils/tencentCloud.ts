/**
 * 腾讯云 SCF 调用工具（纯 JS，无依赖）
 * TC3-HMAC-SHA256 签名
 */
import Taro from '@tarojs/taro'

// ========== 配置 ==========
// 填写真实密钥后云端上报功能生效；留占位符时静默降级，不影响小程序运行。
const SECRET_ID='YOUR_SECRET_ID'
const SECRET_KEY='YOUR_SECRET_KEY'
const REGION = 'ap-beijing'
const FUNCTION_NAME = 'sbti-calculator'
const API_KEY='YOUR_API_KEY'

// ========== SHA-256 实现 ==========
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

function rotr(v: number, n: number) { return (v >>> n) | (v << (32 - n)) }
function ch(x: number, y: number, z: number) { return (x & y) ^ (~x & z) }
function maj(x: number, y: number, z: number) { return (x & y) ^ (x & z) ^ (y & z) }
function sigma0(x: number) { return rotr(x,2) ^ rotr(x,13) ^ rotr(x,22) }
function sigma1(x: number) { return rotr(x,6) ^ rotr(x,11) ^ rotr(x,25) }
function gamma0(x: number) { return rotr(x,7) ^ rotr(x,18) ^ (x >>> 3) }
function gamma1(x: number) { return rotr(x,17) ^ (x >>> 19) }

function sha256_block(h: number[], w: Uint32Array) {
  const a=h[0],b=h[1],c=h[2],d=h[3],e=h[4],f=h[5],g=h[6],hh=h[7]
  for(let j=0;j<64;j++) {
    const T1 = hh + sigma1(e) + ch(e,f,g) + SHA256_K[j] + (w[j]||0)
    const T2 = sigma0(a) + maj(a,b,c)
    h[7]=g; h[6]=f; h[5]=e; h[4]=d+T1
    h[3]=c; h[2]=b; h[1]=a; h[0]=T1+T2
  }
  h[0]+=a; h[1]+=b; h[2]+=c; h[3]+=d; h[4]+=e; h[5]+=f; h[6]+=g; h[7]+=hh
}

function toBytes(v: number) {
  const b=new Uint8Array(4); const v32=new Uint32Array(1)
  v32[0]=v; new Uint8Array(v32.buffer).forEach((x,i)=>b[3-i]=x); return b
}

function sha256(data: Uint8Array): Uint8Array {
  const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19])
  const bitlen = BigInt(data.length<<3)
  const newLen = ((data.length+8)>>6)+1
  const x = new Uint8Array(newLen<<2)
  x.set(data); x[data.length]=0x80
  const view = new DataView(x.buffer); view.setBigUint64(newLen*32-8, bitlen)
  const w = new Uint32Array(64)
  for(let i=0;i<newLen;i++){
    for(let j=0;j<16;j++) w[j]=view.getUint32((i*32+j*4))
    sha256_block(H,w)
  }
  const r=new Uint8Array(32)
  const v=new DataView(r.buffer); H.forEach((v2,i)=>v.setUint32(i*4,v2))
  return r
}

function hmac(key: Uint8Array, msg: Uint8Array): Uint8Array {
  const BLOCK=64; let key2=key
  if(key.length>BLOCK){ key2=sha256(key) }
  const kp=new Uint8Array(BLOCK),op=new Uint8Array(BLOCK)
  for(let i=0;i<BLOCK;i++){ kp[i]=key2[i]??0; op[i]=0x5c^key2[i] }
  const inner=new Uint8Array(BLOCK+msg.length)
  inner.set(kp); inner.set(msg,BLOCK)
  return sha256(op.concat(sha256(inner)))
}

function tc3sign(secret_key: string, date: string, service: string, str2sign: string): string {
  const h=hmac(new TextEncoder().encode('TC3'+secret_key), new TextEncoder().encode(date))
  const h2=hmac(h, new TextEncoder().encode(service))
  const h3=hmac(h2, new TextEncoder().encode('tc3_request'))
  const sig=hmac(h3, new TextEncoder().encode(str2sign))
  return Array.from(sig).map(b=>b.toString(16).padStart(2,'0')).join('')
}

// ========== 调用 SCF ==========
interface ScfResult { [k:string]: any }

export async function callSCF(event: Record<string,any>): Promise<ScfResult> {
  const host = 'scf.tencentcloudapi.com'
  const service = 'scf'
  const version = '2018-04-16'
  const action = 'Invoke'
  const timestamp = Math.floor(Date.now()/1000)
  const date = new Date(timestamp*1000).toISOString().slice(0,10).replace(/-/g,'')
  const payload = JSON.stringify({ TencentDBInstanceId:'cdb-xxxxx', ...event })
  const payloadBytes = new TextEncoder().encode(payload)
  const hashedPayload = sha256(payloadBytes)
  const signedHeaders = 'content-type;host;x-api-key'

  const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-api-key:${API_KEY}\n`
  const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${Array.from(hashedPayload).map(b=>b.toString(16).padStart(2,'0')).join('')}`
  const credentialScope = `${date}/${service}/tc3_request`
  const hashedCanonical = sha256(new TextEncoder().encode(canonicalRequest))
  const str2sign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${Array.from(hashedCanonical).map(b=>b.toString(16).padStart(2,'0')).join('')}`
  const signature = tc3sign(SECRET_KEY, date, service, str2sign)

  const auth = `TC3-HMAC-SHA256 Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const res = await fetch(`https://${host}/`, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Host':host,
      'X-Api-Key':API_KEY,
      'Authorization':auth,
      'X-TC-Timestamp':timestamp.toString(),
      'X-TC-Version':version,
      'X-TC-Action':action,
      'X-TC-Region':REGION,
    },
    body: payload,
  })
  return await res.json()
}

// ========== 设备唯一标识 ==========
const DEVICE_ID_KEY = 'sbti_device_id'

export function getOrCreateDeviceId(): string {
  let id = Taro.getStorageSync<string>(DEVICE_ID_KEY)
  if (!id) {
    id = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    Taro.setStorageSync(DEVICE_ID_KEY, id)
  }
  return id
}

// ========== 每日分享上报（防重） ==========
const CREDENTIALS_CONFIGURED = SECRET_ID !== 'YOUR_SECRET_ID' && SECRET_KEY !== 'YOUR_SECRET_KEY'

export async function dailyReportCheck(
  openid: string,
  typeCode: string,
  typeName: string
): Promise<void> {
  if (!CREDENTIALS_CONFIGURED) return

  try {
    const today = new Date().toISOString().slice(0, 10)
    const key = `daily_report_${today}`
    if (Taro.getStorageSync(key)) return

    await callSCF({ action: 'share', openid, typeCode, typeName, date: today })
    Taro.setStorageSync(key, '1')
  } catch (e) {
    console.warn('[dailyReportCheck] 上报失败:', e)
  }
}
