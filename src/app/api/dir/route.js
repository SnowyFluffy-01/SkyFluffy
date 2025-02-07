
import fetchData from '../../../../lib/api-req';
import path from 'path';
import fs from 'graceful-fs';
export async function GET(request) {
 try {

    const dir = path.join(process.cwd(), 'public',
    'new')
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
   
    let paths = []
    const res = await fetchData(username)
   console.log(res)
    res.i.forEach(item => {
        let attr = item?.tag?.ExtraAttributes?.id 
        let pngPath = attr + '.png'
      })
     
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
  console.error(e)
  return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
}