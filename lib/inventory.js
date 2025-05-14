
import nbt from 'prismarine-nbt'


export default async function parseInv(inv) {

  try {

    let buf = Buffer.from(inv, 'base64');
      nbt.parse(buf, (e, data) => {
        if (e) throw(e)

        let invData = nbt.simplify(data);
        invData.i.forEach((item, index) => {
         console.log(item, index)
        })
     

      });
    
  } catch (e) {
    console.error(e)
  }
}


