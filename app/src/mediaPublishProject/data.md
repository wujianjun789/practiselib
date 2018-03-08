//媒体发布数据结构
const state = {
   data:[
        {
            id:1,
            name:播放方案1
            children:[
                {
                    id：11,
                    name: 播放计划1，
                    children:[
                        {
                            id: 111,
                            name: 播放场景1,
                            children:[
                                {
                                    id: 1111,
                                    name: 播放区域
                                }，
                                {
                                    id: 1112,
                                    name: 播放区域
                                }，
                            ]
                        },
                        {
                            id: 112,
                            name: 播放场景2
                        }
                    ]
                },
                {
                    id：12,
                    name: 播放计划2
                },
            ]
        },{
            id:2,
            name:播放方案2
        }
   ]
    project: {id：1},  //播放方案
    plan: -1,     //播放计划
    screen: -1,   //播放场景
    zone: -1,      //播放区域
    item: -1       //播放区域

this.setState({plan:1, sce})
}