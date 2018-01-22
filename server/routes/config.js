/**
 * Created by a on 2017/8/10.
 */
const express = require('express');
const router = express.Router();
const http = require('http');
const lodash = require('lodash');

const client =  require('../models/config').client;

/* GET config listing. */
router.get('/', function (req, res, next) {
    res.json("http://"+(client.HOST?client.HOST:"localhost")+":"+client.PORT+client.PATH);
});

router.get('/map', function (req, res, next) {
    res.json(client.map);
});

router.get('/module', function (req, res, next) {
    let user = JSON.parse(req.query.user);
    // console.log(user, user.id, user.role, user.userId, "%%%%%%%");

    let options = {
        host: client.HOST,
        port: client.PORT,
        path: client.PATH+"/users/"+user.userId,
        method: 'GET',
        headers: {
            // "Accept": "application/json",
            'Content-Type': 'application/json'
        }
    }

    let httpReq = http.request(options, response=>{
        let body = '';
        response.on('data', data=>{
            body += data;
        })

        response.on('end', ()=>{
            // console.log('body:', body, JSON.parse(body).roleId);
            let modules = JSON.parse(body).modules;
            console.log('modules:', modules, 'user:', user.role);
            if(user.role=="admin"){
                res.json(client.module);
            }else{

                let moduList = [];

                if(!modules){
                    moduList = [{"key": "asset", "title": "资产管理", "link": "/assetManage/manage"}];
                }else{
                    modules.forEach(mod=>{
                        let curMod = lodash.find(client.module, modu=>{return modu.key == mod});
                        if(curMod){
                            moduList.push(curMod);
                        }
                    })
                }

                res.json(moduList);
            }
        })
    })

    httpReq.on('error', e=>{
        console.log("message:",e.message);
    })

    httpReq.end();
});

router.get('/strategyDevice', function (req, res, next) {
    res.json(client.strategyDevice);
})

router.get('/lightLevel', function (req, res, next) {
    res.json(client.lightLevel);
})

module.exports = router;