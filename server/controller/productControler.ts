import http, { IncomingMessage, Server, ServerResponse } from "http";
import fs from "fs";

const DATABASE_NAME = "database.json"



const getHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    let result: string
    fs.readFile(DATABASE_NAME, (err, data) => {
      result = data.toString()
      if (err) {
        res.end(err)
      }
  
      res.writeHead(200, {
        'Content-Length': data.byteLength,
        'Content-Type': 'application/json'
      })
        .end(result);
    
  
    })
  }
  const postHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    let body = "";
  
    req.on("readable", () => {
      let chunk;
      while (null !== (chunk = req.read())) {
        body += chunk;
      }
    });
  
    req.on("end", () => {
      let file: any;
      body = JSON.parse(body);
      fs.readFile(DATABASE_NAME, (err, data) => {
        file = JSON.parse(data.toString());
        file.push(body);
        fs.writeFile(DATABASE_NAME, JSON.stringify(file, null, 3), (err) => {
          if (err) {
            res.end(err);
          }
        })
        
        res.writeHead(201, {
         
        "Content-Type": "application/json",
          })
          .end(JSON.stringify({ message: "Added Successfully" }));
      });
    });
  };
  
  const deleteHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    })
    req.on("end", () => {
      let task = JSON.parse(data);
      fs.readFile(DATABASE_NAME, (err, data) => {
        if (err) {
          // error, send an error message
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: err,
            })
          );
        } else {
       
          let tasks = JSON.parse(data.toString());
         
          
          let index = tasks.findIndex((t:any) => t.id == Number(task.id));
           // remove the task
          tasks.splice(index, 1);
  
          
          fs.writeFile(
            DATABASE_NAME,
            JSON.stringify(tasks, null,3),
            (err) => {
              // Check out any errors
              if (err) {
                // error, send an error message
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err,
                  })
                );
              } else {
                // no error, send the data
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: task,
                  })
                );
              }
            }
          );
        
        }
      })
    })
  }
  
  const putHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  
    let body = "";
  
    req.on("readable", () => {
      let chunk;
      while (null !== (chunk = req.read())) {
        body += chunk;
      }
    });
  
    req.on("end", () => {
      let file: any;
      let task = JSON.parse(body);
      fs.readFile(DATABASE_NAME, (err, data) => {
        file = JSON.parse(data.toString());
  
        let index = file.findIndex((t: any) => t.id == Number(task.id));
  
        file[index] = { ...file[index], ...task };
  
        // file.push(body);
        fs.writeFile(DATABASE_NAME, JSON.stringify(file, null, 3), (err) => {
          if (err) {
            res.end(err);
          }
        })
        
        res.writeHead(201, {
         
        "Content-Type": "application/json",
          })
          .end(JSON.stringify({ message: "Updated Successfully" }));
      });
    });
  
  }

  export{ postHandler,deleteHandler, putHandler, getHandler}
  