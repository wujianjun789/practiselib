import {IsExitInArray} from './algorithm';
export function excelImport(e,key,columns,cb){
    return new Promise(function(resolve, reject){
        let files = e.target.files;
        let fileReader = new FileReader();
        let items = []; // 存储获取到的数据
        
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    });// 以二进制流方式读取得到整份excel表格对象
            } catch (e) {
                console.log('文件类型不正确');
                resolve([[]]);
                return;
            }

            // key存在读取该表，不存在读取第一张表
            let sheetName = workbook.Sheets.hasOwnProperty(key)?key:workbook.SheetNames[0];
            //获取表头
            let header = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1})[0];

            let fromTo = workbook.Sheets[sheetName]['!ref'];
            items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
    
            (function(){
                //表头数量
                if (fromTo[0] === 'A' && fromTo[3] ==='F') {
                    //表头内容
                    for(let i=0; i < columns.length; i++) {
                        if(!IsExitInArray(header, columns[i].field)) {
                            items=[];
                            return ;
                        }
                    }
                    //表格内容
                    let requireProperty = ['id','name','typeName','domainName']
                    for(let i=0; i < items.length; i++){
                        for(let j=0; j < requireProperty.length; j++){
                            if(!items[i].hasOwnProperty(requireProperty[j])) {
                                items=[];
                                return ;
                            }
                        }
                    }
                }
                else{
                    items=[];
                }
            })();
            resolve([items, files[0].name]); 
        }
          
    })
}
