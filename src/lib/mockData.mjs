import { writeFile } from "fs/promises";
import axios from 'axios'
export default async function mockData() {
    const res = await axios.get(
      `https://api.hypixel.net/v2/skyblock/profiles?uuid=fb3d9649-8a5b-4d5b-91b7-63db14b195ad`,
      {
        headers: {
          "API-Key": "723f6d69-1eb4-4bb6-bf13-2a2d87907876",
        },
      }
    );
await writeFile('./mockedRes.json', JSON.stringify(res.data, null, 2))

}

await mockData()