/**
 * 公用二维码组件前段js文件
 * Created by daiyi on 2016-1-14.
 */
/**
 * 打开端口，目前缺省打开com1，不可选
 * @return
 */
function openBarCodePort(qType, comType){
    var q = qType || 'newLand';
    var c = comType || '1';
    var mObject=false;//是否安装控件标识
    closeBarCodePort();
    try{
        new ActiveXObject("BARCODEREADER.BarCodeReaderCtrl.1");//创建iWebOffice2003对象
    }
    catch(e){
        mObject=true;//创建对象异常则说明控件没有安装
    }
    var obj = document.getElementById("PDF417Reader");
    if(!obj || mObject==true){
        $.alert($.i18n('common.barcode.activeX.miss'));
        return false;
    }
    obj.CopyRight= CopyRight;
    if(!obj.IsAuthorized){
        $.alert($.i18n('common.barcode.error.license'));
        return;
    }
    /*//设置端口号为com1
    if (!obj.SetComPortId) {
        $.alert($.i18n('common.barcode.activeX.miss'));
        return false;
    }
    var result = obj.SetComPortId(c);
    if(result == 1){
        $.alert($.i18n('common.barcode.port.used'));
        return false;
    }else if(result == 2){
        $.alert($.i18n('common.barcode.port.opened'));
        return false;
    }*/
    var result = 0;
    if (q == "newLand") {
        try{
            result = obj.OpenVirtualCom();
        } catch (e) {
            $.alert($.i18n('common.barcode.activeX.miss'));
            return false;
        }
    } else {
        result = obj.OpenComPort();
    }
    if(result == 1){
        $.alert($.i18n('common.barcode.open.error'));
        return false;
    }
    $(window).unload(function(){
        closeBarCodePort();
    });
    return true;
}

/**
 * 关闭com口
 * @return
 */
function closeBarCodePort(){
    var obj = document.getElementById("PDF417Reader");
    //增加防护，如果没有安装上控件，obj对象还是存在的
    try{
        if(obj) {
            obj.CloseComPort();
            obj.CloseVirtualPort();
        }
    }catch(e){
    }
}

/**
 * 解析由系统生成的二维码数据
 * @param readerId
 */
function getDecoderObj(param) {
    var obj = param.reader.GetBarCodeBuff();
    var extParam = {};
    if (param.decodeParamFun) {
        extParam = param.decodeParamFun();
    }
    return callBackendMethod("barCodeManager","decodeBarCode",param.decodeType, obj, extParam);
}