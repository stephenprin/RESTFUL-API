import http, { IncomingMessage, Server, ServerResponse } from "http";
import fs from "fs";
import {postHandler,deleteHandler, putHandler, getHandler} from './controller/productControler'

/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => { 
 
  switch (req.method) {
      case "GET":
          getHandler(req, res)
          break;
      case "POST":
         postHandler(req,res)
          break;
    case "PUT":
      putHandler(req, res)
          break;
    case "DELETE":
      deleteHandler(req, res)
          break;
      default:
          break;
  }
})
const initDB = (name: string) => {
  const isExist = fs.existsSync(name)
  if (!isExist) {
    let data = {
          organization: "node ninja",
          createdAt: "2020-08-12T19:04:55.455Z",
          updatedAt: "2020-08-12T19:04:55.455Z",
          products: ["developers", "pizza"],
          marketValue: "90%",
          address: "sangotedo",
          ceo: "cn",
          country: "Taiwan",
          id: 2,
          noOfEmployees: 2,
          employees: ["james bond", "jackie chan"]
      }
      let dataarry = [data]
      fs.writeFile(name, JSON.stringify(dataarry, null,3), (err) => {
          if (err) {
              return
          }
      })
  }
}


server.listen(3001, "localhost", 0, () => {
  console.log("connecting")
  initDB("database.json")
})
