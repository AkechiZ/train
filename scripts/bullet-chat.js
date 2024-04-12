var arr = ["测试"]; // 用来保存弹幕数据的数组

$(document).ready(function(){
    var screen = $(".display"); // 显示弹幕的 div
    var height = screen.height(); // 此 div 的高度
    var width = screen.width(); // 此 div 的宽度

    $("#sendout").click(function(){ // 点击发送弹幕
        var text = $("#inputline").val(); // 获取发送值
        $("#inputline").val(''); // 清空发送区
        console.log(text); // 打印发送的值到控制台
        arr.push(text); // 将值放入数据数组中

        var textObj = $("<div>"+text+"</div>");
        screen.append(textObj); // 在屏幕上添加弹幕
        console.log("textObj:" + textObj.html()); // 打印添加的弹幕到控制台
    });

    // 关闭  开启弹幕按钮点击事件
    $("#close").click(function(){
        screen.empty(); // 清空弹幕屏幕
    });

    var moveObj = function(obj){
        obj.css({
            display: "inline",
            position: "absolute",
            fontSize: Math.floor(Math.random() * 25) + 12 + 'px' // 随机设置字体大小在12到36px之间
        });

        var begin = Math.random() * width; // 一开始的水平位置为随机值
        var top = Math.random() * height; // 一开始的垂直位置为随机值

        obj.css({
            left: begin, // 设置弹幕水平位置
            top: top, // 设置弹幕垂直位置
            color: getRandomColor() // 随机设置弹幕颜色
        });

        var time = 10000 + Math.random() * 20000; // 随机生成持续时间

        obj.animate({
                left: "-" + width + "px" // 让弹幕向左移动到屏幕外
            },
            time,function(){
                obj.remove(); // 弹幕移动完成后移除弹幕对象
            });
    }

    var getRandomColor = function(){
        return '#'+('00000'+(Math.random()*0xffffff <<0).toString(16)).substr(-6); // 生成随机颜色值
    }

    var runDanMu = function(){
        if (arr.length > 0)
        {
            var n = Math.floor(Math.random()*arr.length); // 随机选择弹幕数组中的一个值
            var textObj = $("<div>"+arr[n]+"</div>");
            screen.append(textObj); // 在屏幕上添加随机选择的弹幕
            moveObj(textObj); // 移动弹幕对象
        }
        setTimeout(runDanMu,1000); // 每隔一秒继续运行弹幕
    }

    runDanMu(); // 开始运行弹幕
});
