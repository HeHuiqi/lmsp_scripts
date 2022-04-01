#!/usr/bin/env node

const HqFileUtil = require('./HqFileUtil');

const HqNetUtils = require('./HqNetUtils');

let defaulConfigFile = 'HqConfig.json';

let currentTaskType = 1; // 任务类型
let currentTaskId = 1; // 任务id
let accountIndex = 0; // 
let reqDelay = 10; //秒
let acccounts = [];
let currentAccount = acccounts[accountIndex]

async function doWordTask(taskId, nextAccountCallback) {

    let taskDetail = await HqNetUtils.getWordTaskDetail(taskId);
    let game_id = taskDetail.game_id;
    const words = taskDetail.words;
    const wordIDs = words.map((word) => {
        return word.id;
    });
    const errorsCount = '0';
    const totalCount = JSON.stringify(wordIDs.length);
    let doWordResult = await HqNetUtils.finishWordTask(game_id, errorsCount, totalCount, wordIDs);

    if (doWordResult.energy_now == 0) {
        if (accountIndex < acccounts.length) {
            taskId = 1;
            const tip = `此账号:${currentAccount.email} 没有精力了，休息一下吧！`;
            console.log(tip);
            accountIndex = accountIndex + 1;
            currentAccount = acccounts[accountIndex];
            nextAccountCallback(currentAccount);

        } else {
            console.log('没有账号可学习了');
        }
    } else {
        console.log('doWordResult.energy_spent-inner:', doWordResult.energy_spent);
        if (doWordResult.energy_spent === 0) {
            currentTaskId = currentTaskId + 1;
            console.log('finish-currentTaskId:', currentTaskId);
        }
    }

}

async function startDoWordTask(account) {

    try {
        const loginInfo = await HqNetUtils.login(account);
        
        if(loginInfo === undefined || loginInfo === null){
            console.log('没有选择角色或角色学习时间期了');
            return;
        }

        const interval = reqDelay * 1000;
        const doTask = async (taskId) => {
            // 每个账号做一次任务
            await doWordTask(taskId, (nextAccount) => {
                console.log('下一个账号：', nextAccount);
                (async () => {
                    if (nextAccount) {
                        await startDoWordTask(nextAccount);
                    } else {
                        if (timer) {
                            clearInterval(timer);
                        }
                        console.log('没有账号可学习了');
                    }
                })();
            });
        };
        let timer = setInterval(async () => {
            await doTask(currentTaskId);

        }, interval);
        await doTask(currentTaskId);


    } catch (error) {
        console.log('startDoWordTask-error:', error);

    }
}

async function doStoryTask(taskId, nextAccountCallback) {

    let taskDetail = await HqNetUtils.getTaskDetail(taskId);
    let game_id = taskDetail.game_id;

    let doWordResult = await HqNetUtils.finishTask(taskId, game_id);
    if (doWordResult.energy_now == 0) {
        // console.log('没有精力了，休息一下吧！');
        if (accountIndex < acccounts.length) {
            const tip = `此账号:${currentAccount.email} 没有精力了，休息一下吧！`;
            console.log(tip);
            accountIndex = accountIndex + 1;
            currentAccount = acccounts[accountIndex];
            nextAccountCallback(currentAccount);

        } else {
            console.log('没有账号可学习了');
        }
    } else {
        console.log('doWordResult.energy_spent:', doWordResult.energy_spent);
        if (doWordResult.energy_spent === 0) {
            currentTaskId = currentTaskId + 1;
            console.log('hq-finish-currentTaskId:', currentTaskId);
        }
    }

}
async function startDoStoryTask(account) {
    try {
        const loginInfo = await HqNetUtils.login(account);
        if(loginInfo === undefined || loginInfo === null){
            console.log('没有选择角色或角色学习时间期了');
            return;
        }

        const interval = reqDelay * 1000;
        const doTask = async (taskId) => {
            // 每个账号做一次任务
            await doStoryTask(taskId, (nextAccount) => {
                console.log('下一个账号：', nextAccount);
                (async () => {
                    if (nextAccount) {
                        await startDoStoryTask(nextAccount);
                    } else {
                        clearInterval(timer);

                        console.log('没有账号可学习了');
                    }
                })();
            });
        };
        let timer = setInterval(async () => {
            await doTask(currentTaskId);
        }, interval);
        await doTask(currentTaskId);

    } catch (error) {
        console.log('startDoWordTask-error:', error);

    }
}

async function main() {

    switch (currentTaskType) {
        case 1:
            await startDoWordTask(currentAccount);
            break;
        case 2:
            await startDoStoryTask(currentAccount);
            break;

        default:
            break;
    }
}



const path = require('path');
const readline = require('readline');
const { exit} = require('process');

function readConfig(){
    const currentDir = process.cwd();

    const argv = process.argv;

    let inputConfigFile = argv[2];
    if(inputConfigFile){
        defaulConfigFile = inputConfigFile;
    }

    const isExistConfig = HqFileUtil.fileIsExists(defaulConfigFile);
    if(isExistConfig === false){
        console.log('请在 HqConfig.json 文件中配置好自己账号');
        exit(0);
    }

    
    const filePath = path.join(currentDir,defaulConfigFile);
    // console.log("filePath:",filePath);
    
    const configs = HqFileUtil.readFile(filePath);
    if(configs.acccounts){
        acccounts = configs.acccounts;
    }
    return acccounts;
}

async function test(){
    HqFileUtil.createSaveFile();
    readConfig();
    // console.log('acccounts:',acccounts);
    if (acccounts.length == 0) {
        console.log('请在 HqConfig.json 文件中配置好自己账号');
        exit(0);
    }
    currentAccount = acccounts[accountIndex];
    await HqNetUtils.login(currentAccount);
};
// test();
function start() {

    readConfig();
    // console.log('acccounts:',acccounts);
    if (acccounts.length == 0) {
        console.log('请在 HqConfig.json 文件中配置好自己账号');
    
        exit(0);
    }
    currentAccount = acccounts[accountIndex];
    // main();
    // return;

    let allTask = '任务类型信息:\n 单词任务数字: 1 \n 故事任务数字: 2\n';
    console.log(allTask);

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(`输入任务类型数字: `, (taskType) => {
        let out = parseInt(taskType);
        if (out === 0) {
            out = 1;
        }
        if (out < 3) {
            currentTaskType = out;
            // let tip = `your input task type is: ${out}\n`;
            // console.log(tip);
        } else {
            console.log('任务类型数字最大是 2');
            rl.close();
            return;
        }
        rl.question(`输入请求间隔（秒） : `, (req_deplay) => {
            out = parseInt(taskType);
            if (out > reqDelay) {
                reqDelay = out;
            }
            rl.question(`输入任务ID: `, (taskId) => {
                out = parseInt(taskId);
                if (out > 1) {
                    currentTaskId = out;
                }
                // tip = `your input task ID is: ${out}\n`;
                // console.log(tip);

                // 开始做任务了
                console.log('开始做任务了');
                main();
                rl.close();
            });

        });

    });
}

start();


