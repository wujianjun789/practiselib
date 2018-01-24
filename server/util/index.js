/**
 * Created by a on 2018/1/24.
 */
const os = require('os');
function getHostIP(){
    let ip = "localhost";
    const networkInterface = os.networkInterfaces();
    let isBreak = false;
    for(let key in networkInterface){
        let networks = networkInterface[key];
        for(let i=0;i<networks.length;i++){
            let nw = networks[i];
            if(nw.family === 'IPv4' && nw.address.split('.').length == 4){
                ip = nw.address;
                isBreak = true;
                break;
            }
        }

        if(isBreak){
            break;
        }
    }

    return ip;
}

module.exports = {
    host_ip: getHostIP()
};

