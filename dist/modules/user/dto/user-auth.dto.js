"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _export(target,all){for(var name in all)Object.defineProperty(target,name,{enumerable:true,get:all[name]})}_export(exports,{userLoginDtoSchema:function(){return userLoginDtoSchema},userSignupDtoSchema:function(){return userSignupDtoSchema}});const _zod=require("zod");const userSignupDtoSchema=_zod.z.object({email:_zod.z.string().email(),username:_zod.z.string().min(4),password:_zod.z.string().min(6)});const userLoginDtoSchema=_zod.z.object({email:_zod.z.string().email(),password:_zod.z.string().min(6)});