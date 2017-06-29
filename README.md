# starriver_pro_web

## 流程

1. 流程
   需求分析
   UI设计，静态图，界面逻辑。
   UI分析，抽象分离
   制作静态页面以及对应样式
   模块制作，模块属性定义，实现。
   行为，交互实现。
   测试。
   优化，改良。

2. 样例：人脉
   需求分析：略
   UI设计：略
   UI分析，抽象分离：
	Button,
	Search,
	Results,
        Item

   制作静态页面以及对应样式: index.html

   模块制作：如最左侧的几个模块
   1. Button Add 
   2. Search Input
   3. Results View
       Item
   我们来实现Search和Results
   1. Search
     属性：value
      
   2. Results
     属性：results,active
     
   3. Item 
     属性: avatar,name,actived
     
   
   相关test
   1. search
     value===''时 不显示clear
   
   2. Item
     头像背景图片为avatar
     文本显示为name
     actived===true时，class为active
  
  行为，交互实现:
  1. Search
     onChange:改变search的值
  2. Item
     onClick:改变active的值   
  3. Course
     onSearch:
     onActive:

  测试   

  优化，改良。
              
	
