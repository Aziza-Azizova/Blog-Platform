"use strict";Object.defineProperty(exports,"__esModule",{value:true});const _app=require("./app");const PORT=process.env["PORT"]||5e3;async function main(){_app.app.listen(PORT,()=>{console.log(`Server is running on ${PORT}`)})}main().catch(err=>{console.log(err);process.exit(1)});