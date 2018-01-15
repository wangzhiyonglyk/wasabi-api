/**
 * @author 王志勇
 * @description 辅助函数 2018-01-15
 */
export default {
    /**
     * 是否是空对象
     */
    isEmptyObject:function(obj){
        if ((obj && typeof obj === "object" && JSON.stringify(obj) !== "{}") || (settings.headers && typeof settings.headers === "object" && JSON.stringify(settings.headers) !== "{}")) {
            return true;
        }
        else if(!obj)
        {//空也认为是空对象
            return true;
        }
        return false;
    }
}