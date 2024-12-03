import {readFile, writeFile} from "node:fs/promises";
const user = 'bao-admin'
const pass = 'Prejudice247<Decimal624o'

type Mechanism = {
    mechanism_code: string;
    org_unit_id: string;
    mechanism_id: string;
    mechanism_name: string;
    narrative: string;
    period_id: string;
    categoryOptionId: string;

}
const data:Mechanism[] = JSON.parse((await readFile('narratives.json')).toString())
for (let mechanism of data) {
    const {mechanism_id} = mechanism
    const categoryOptionId:string = (await (await fetch(`https://nr.testing.datim.org/api/identifiableObjects/${mechanism_id}?fields=categoryOptions`, {headers: {Authorization: `Basic ${btoa(`${user}:${pass}`)}`}})).json()).categoryOptions[0].id
    mechanism.categoryOptionId = categoryOptionId
}

await writeFile('payload.json', JSON.stringify(data,null,4))

