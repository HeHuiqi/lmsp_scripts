const axios = require('axios');
const HqFileUtil = require('./HqFileUtil');
const appState = {
    deviceToken:null,
    token:null,
    expired_at:0,
};


async function reqAuthToken(email,password,deviceToken){
    const data = {"login":email,password:password};
    const headers = { 
        "Content-Type": "application/json",
        // "x-client-id":'ios',
        "x-device-token-letmespeak":deviceToken,
    };
    appState.deviceToken = deviceToken;
    const config = {headers};
    // console.log('config:',config);
    const out = await axios.post('https://api2.letmespeak.pro/user/v2/auth',data,config);
    return out;
}
async function decryptAuthToken(auth_token,playerToken,deviceToken){
    const headers = { 
        "Content-Type": "application/json",
        // "x-client-id":'ios',
        "x-device-token-letmespeak":deviceToken,
        "x-c-token-letmespeak":playerToken,
    };
    const data = {"token":deviceToken,auth_token:auth_token};
    const config = {headers};
    // console.log('decryptAuthToken:',data);
    // console.log('headers:',headers);
    let out = await axios.post('https://api2.letmespeak.pro/api/1.0/auth',data,config);

    appState.token = out.token;

    return out;
}

async function login(account){
    console.log('开始登录。。。。。',account.email);
    let loginTokenInfo;

/*
    let currentTime = new Date();
    currentTime = currentTime.getTime()/1000;
    const savedToken = HqFileUtil.readToken(account.email);

    let defaultToken = {
        "deviceToken": "",
        "token": "",
        "expired_at": 0
    }
    if(savedToken){
        defaultToken.deviceToken = savedToken.deviceToken;
        defaultToken.token = savedToken.token;
        defaultToken.expired_at = savedToken.expired_at | 0;
    }
    if(currentTime >= defaultToken.expired_at ){
        console.log('请求token');
        try {
            const authLogin = await reqAuthToken(account.email,account.password,account.deviceToken);
            console.log('authLogin:',authLogin.data);
            const allProfiles =  authLogin.data.profiles;
            if(allProfiles.length == 0){

                return loginTokenInfo;
            }
            let selectProfile = allProfiles[0];
            if(selectProfile.energy < 1)
            for (let index = 1; index < allProfiles.length; index++) {
                const profile = allProfiles[index];
                if(profile.energy > 1){
                    selectProfile = profile;
                    break;
                }
            }
            console.log('selectProfile:',selectProfile);
            const auth_token = selectProfile.auth_token;
            const loginToken = selectProfile.token;
            loginTokenInfo  = await decryptAuthToken(auth_token,loginToken,account.deviceToken);
            console.log('loginTokenInfo:',loginTokenInfo.data);
            appState.token = loginTokenInfo.data.token;
            appState.expired_at = loginTokenInfo.data.expired_at;
            const willSaveToken = {
                deviceToken: account.deviceToken,
                token: appState.token,
                expired_at: loginTokenInfo.data.expired_at,
            };
            HqFileUtil.saveToken(account.email,willSaveToken);
            console.log('登录成功：',appState);
            // console.log('登录成功!');
        } catch (error) {
            console.log('登录发生错误：',error.toString());
    
        }
    }else{
        console.log('加载本地token');
        appState.deviceToken = savedToken.deviceToken;
        appState.token = savedToken.token;
        appState.expired_at = savedToken.expired_at;
        console.log('登录成功：',appState);
    
        loginTokenInfo = {
            data: appState,
        };
    }

    */
   
    try {
        const authLogin = await reqAuthToken(account.email,account.password,account.deviceToken);
        // console.log('authLogin:',authLogin.data);
        const allProfiles =  authLogin.data.profiles;
        let selectProfile = allProfiles[0];
        if(selectProfile.energy < 1)
        for (let index = 1; index < allProfiles.length; index++) {
            const profile = allProfiles[index];
            if(profile.energy > 1){
                selectProfile = profile;
                break;
            }
        }
        const auth_token = selectProfile.auth_token;
        const loginToken = selectProfile.token;
        loginTokenInfo  = await decryptAuthToken(auth_token,loginToken,account.deviceToken);
        appState.token = loginTokenInfo.data.token;
        console.log('登录成功：',appState);
        // console.log('登录成功!');


    } catch (error) {
        console.log('登录发生错误：',error);

    }

    // appState.deviceToken = 'lPuSP3yzzrjumOtq';
    // appState.token = 'DlAwxrdteFj7zsMNXL/AoHP0rf334emBbIuBGact4RVYBn+rLK+Sjq/NMMnZSCKdSdHZgIJxhwXHzd9vFY+UkIbg8h2qx0s3yPVTaVkyOCw5kn+XW9JFR2LyjilIBx9ZR/D+yrTcyQZ6/ZK3gwyP2W62Wq0Q9mhqctnhl3aCpmq7EEExShrQcTPHhg8vKPl1D+h6V7LOydSpHiDVz2KM3F6/QFSRFHjoTwt0+gSqUAsRNr3ueo/agfsTyKPwLQ0B+RvP3T1ROAYBRKWw7TJbIJvUkTviKwz2YeWIaPSN984ucE+XGT1p5OHn5z0hwwLHKNgqkO6tFIoR4aixGGrJmxv9qFoUtVXXv+8ABHte0m3hsCdHFhXL0dpenTo7ID/vltb+aaIIBtrU3ATWSG4E7yFgaLZ31Rdl02aRKpY0ekd1Lg6Hh0QXaXdo/hxzrRm7yPBpyrkcpR5Txzugv3bu89aqigtMi3DcbOuRfi87b05Rl4e8bG8ooBER3QLAb0vxaa2BQmSqFY/WiiT51V5A+coe8xPGJKvGTvrG5TEcB4CqE+NlcGP8KFu3yzYKDB1RDiNW+nuY/4Zy1do6p6iWTitAw1tPpAyqu1hqofbCBqYQbtI6rZAidJLBznhA+RDhP4UlwN9+JUdrb4Vbroh6/0QsgPkUwJ9nIqp7ooj48Nuv1nq1kNsbvgEJ+ZJVgnHggMe3cVKZ2eW2irCQQb11Ujs=';

    // loginTokenInfo = {
    //     data: appState,
    // };
    return loginTokenInfo;
}
// 获取故事任务
async function getTaskDetail(taskId){
    console.log('获取故事任务。。。。。');
    const headers = { 
        "Content-Type": "application/json",
        // "x-client-id":'ios',
        "x-device-token-letmespeak":appState.deviceToken,
    };
    const config = {headers};
    const url=  `https://api2.letmespeak.pro/lms/dialog/byOrder/${taskId}?v=2&newwordsets=true`
    console.log('data:',url);

    let out;
    try {
        out = await axios.post(url,config);
        out = out.data;
        console.log('getTaskDetail:',out.game_id);
    } catch (error) {
        console.log('获取故事任务发生错误:',error.toString());
    }
    return out;
}
// 完成故事任务
async function finishTask(taskId,game_id){
    const data = {"result":"3","id":taskId+'',"game_id":game_id};
    const headers = { 
        "Content-Type": "application/json",
        // "x-client-id":'ios',
        "x-device-token-letmespeak":appState.deviceToken,
    };
    headers["x-auth-token-letmespeak"] = appState.token;
    const config = {
        headers,
    };
    // console.log('finishTask-config:',config);
    console.log('finishTask-data:',data);

    const url=  'https://api2.letmespeak.pro/api/1.0/training/finish/dialogue';

    let out;
    try {
        out = await axios.post(url,data,config);
        out = out.data;
        console.log('完成故事任务：',out);
    } catch (error) {
        console.log('完成故事任务发生错误：',error.toString());
    }
    return out;
}


// 获取单词任务
async function getWordTaskDetail(taskId){
    console.log('开始获取单词任务');
    const data = {"translationLanguageCode":"en","originalLanguageCode":"zh"};
    const headers = { 
        "Content-Type": "application/json",
        "x-device-token-letmespeak":appState.deviceToken,
        "x-auth-token-letmespeak":appState.token,
    };
    const config = {headers};
    const url=  `https://api2.letmespeak.pro/lms/wordset/v2/get/${taskId}`
    console.log('单词任务：',url);
    // console.log('headers：',headers);
    // console.log('data',data);


    let out;
    try {
        out = await axios.post(url,data,config);
        out = out.data;
        console.log('getWordTaskDetail:',out.game_id);
    } catch (error) {
        console.log('获取单词任务发生错误：',error.toString());

    }
    return out;
}
// wordIDs 数组json
async function finishWordTask(game_id,errsCount,totalCount,wordIDs){
    console.log('开始完成单词任务。。。。。');
    const data = {"game_id":game_id,"errors":errsCount,"total":totalCount,"wordIDs":wordIDs.toString()};

    const headers = { 
        "Content-Type": "application/json",
        // "x-client-id":'ios',
        "x-device-token-letmespeak":appState.deviceToken,
    };
    headers["x-auth-token-letmespeak"] = appState.token;

    const config = {
        headers,
    };
    // console.log('finishWordTask-config:',config);
    // console.log('finishWordTask-data:',data);

    const url=  'https://api2.letmespeak.pro/api/1.0/training/finish/wordset';

    let out;
    try {
        out = await axios.post(url,data,config);
        out = out.data;
        console.log('完成单词任务：',out);

    } catch (error) {
        console.log('完成单词任务发生错误：',error.toString());
    }

    return out;
}


function mockRequest(){
    return new Promise((resovle)=>{
        setTimeout(() => {
            resovle('data:mockRequest');
        }, 3000);
    });
}
const reqMock = async function (){
  
    console.log('reqmock');
    let data =  await mockRequest();
    console.log("result:",data);
   
}
/*

npm install lmsp_scripts -g git+https://github.com/HeHuiqi/lmsp_scripts.git
*/

const HqNetUtils = {
    login,
    getTaskDetail,
    finishTask,
    getWordTaskDetail,
    finishWordTask,
    reqMock,
}
module.exports = HqNetUtils;


