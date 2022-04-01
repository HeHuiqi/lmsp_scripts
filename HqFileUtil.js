const fs = require("fs");
const saveTokenFile = 'HqSavedToken.json';

const path = require('path');

function fileIsExists(filePath){
   return fs.existsSync(filePath);
}

function createSaveFile(){

    const initContent = {
        "palceholder": {
            "deviceToken": "",
            "token": "",
            "expired_at": 0
        }
    };

    if(!fileIsExists(saveTokenFile)){
        console.log('saveTokenFile 不存在,开始创建');
        fs.writeFileSync(saveTokenFile,JSON.stringify(initContent));

    }
}
function readFile(filePath){
    let data = fs.readFileSync(filePath);
    data = JSON.parse(data.toString());
    // console.log('data:',data);
    return data;
}
function readTokens(){
    return readFile(saveTokenFile);
}
function readToken(email){
    let tokens = readTokens()
    return tokens[email];
}

function saveToken(email,tokenInfo){
    const data = readTokens()
    let newData = data;
    newData[email] = tokenInfo;
    fs.writeFileSync(saveTokenFile,JSON.stringify(newData));
}
const HqFileUtil = {
    fileIsExists,
    createSaveFile,
    readFile,
    readToken,
    saveToken,
}
module.exports = HqFileUtil;

