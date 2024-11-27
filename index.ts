import {DynamoDBClient, ScanCommand, ScanCommandOutput, ScanInput} from "@aws-sdk/client-dynamodb"
import {unmarshall} from "@aws-sdk/util-dynamodb"
import {writeFile} from "node:fs/promises"
const client = new DynamoDBClient({
    region: 'us-east-1'
})
const input:ScanInput = {
    TableName: 'pdap-svc-wpb-er-json-ErbCacheTable-1KWJ3BW4183F0',
    FilterExpression: 'period_id = :period_id AND narrative <> :null AND narrative <> :empty',
    ProjectionExpression: 'mechanism_id, mechanism_name, mechanism_code, period_id, org_unit_id, narrative',
    ExpressionAttributeValues: { // ExpressionAttributeValueMap
        ":period_id": {S: "2023Oct"},
        ":null":{NULL:true},
        ":empty":{S:''}
    },
}


type Item = {
    mechanism_id: string;
    mechanism_code: string;
    narrative: string;
    mechanism_name: string;
    org_unit_id: string;
}
type Output = {
    key: Record<string,any>|undefined,
    items: Item
}
async function scan(input:ScanInput):Promise<Output>{
    const response:ScanCommandOutput = await client.send(new ScanCommand(input))
    return {
        items: response!.Items!.map((item)=>unmarshall(item)) as any,
        key: response.LastEvaluatedKey
    }
}
let key:boolean|any = true
let result:Item[] = []
while (key){
    if (result.length>0) input.ExclusiveStartKey = key
    const {key:k, items} = await scan(input)
    key = k
    result = result.concat(items)
}
await writeFile('output.json', JSON.stringify(result, null, 4), 'utf8')
console.log(result.length)


