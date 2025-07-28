import { writeFile } from "fs/promises";

export default async function mockData(data) {
await writeFile('./mockedRes.json', `export default tion const res = ${JSON.stringify(data, null, 2)}`)

}