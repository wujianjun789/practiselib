/** Created By ChrisWen
 *  Queue --- 先进先出
 */

module.exports = class promiseQueue {
    constructor() {
        this.middlewareArr = [];
        //设计空的 promise
        this.middlewareChain = Promise.resolve();
    }

    use(middleware) {
        this.middlewareArr.push(middleware);
    }

    //创建Promise 链条
    composeMiddleware(context) {
        let {middlewareArr} = this;
        //根据中间件数组 创建Promise 链条
        for (let middleware of middlewareArr) {
            this.middlewareChain = this.middlewareChain.then(() => {
                return middleware(context);
            })
        }
        return this.middlewareChain;
    }
}