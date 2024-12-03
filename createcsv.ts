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
}
type DataValue = {
    pe: string;
    ou: string;
    de: string;
    ds: string;
    co: string;
    cc: string;
    cp: string;
    value: string;
}
const data:Mechanism[] = JSON.parse((await readFile('narratives.json')).toString()).slice(0,5)
const dataValues = []

for (let mechanism of data) {
    const {mechanism_id, narrative, org_unit_id} = mechanism
    const cp:string = (await (await fetch(`https://nr.testing.datim.org/api/identifiableObjects/${mechanism_id}?fields=categoryOptions`, {headers: {Authorization: `Basic ${btoa(`${user}:${pass}`)}`}})).json()).categoryOptions[0].id
    dataValues.push({
        pe: '2023Oct',
        ou: org_unit_id,
        de: 'k9JP8KHiLFV',
        ds: 'JxVx2abUluG',
        co: 'HllvX50cXC0',
        cc: 'wUpfppgjEza',
        cp,
        value: narrative,
    })
    console.log(`${data.indexOf(mechanism)+1}/${data.length}`)
}
let output = 'de,pe,ou,coc,aoc,value\n'
for (let dv of dataValues) {
    const {de,pe,ou,}
    output += `${de}${pe}${ou}${coc}\n`
}
await writeFile('payload.csv',output)

