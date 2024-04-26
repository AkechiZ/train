document.addEventListener("DOMContentLoaded", function() {
    let arr = ["测试"]; // 用来保存弹幕数据的数组
    let screen = document.querySelector(".display"); // 显示弹幕的 div
    let height = screen.offsetHeight; // 此 div 的高度
    let width = screen.offsetWidth; // 此 div 的宽度


    document.getElementById("sendout").addEventListener("click", function() { // 点击发送弹幕
        sendMessage();
    });

    // 添加按键监听器到输入框上
    document.getElementById("inputline").addEventListener("keypress", function(event) {
        // 检查按下的键是否是回车键
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // 关闭  开启弹幕按钮点击事件
    document.getElementById("close").addEventListener("click", function() {
        screen.innerHTML = ''; // 清空弹幕屏幕
    });

    // 发送消息的函数
    function sendMessage() {
        let text = document.getElementById("inputline").value; // 获取发送值
        document.getElementById("inputline").value = ''; // 清空发送区
        arr.push(text); // 将值放入数据数组中

        let textObj = document.createElement("div");
        textObj.textContent = text;
        screen.appendChild(textObj); // 在屏幕上添加随机选择的弹幕
        moveObj(textObj); // 移动弹幕对象

    }

    let moveObj = function(obj) {
        obj.style.display = "inline";
        obj.style.position = "absolute";
        obj.style.fontSize = Math.floor(Math.random() * 25) + 12 + 'px'; // 随机设置字体大小在12到36px之间

        let begin = width - obj.offsetWidth; // 一开始的水平位置为随机值
        let top = Math.random() * height; // 一开始的垂直位置为随机值

        obj.style.left = begin + "px"; // 设置弹幕水平位置
        obj.style.top = top + "px"; // 设置弹幕垂直位置
        obj.style.color = getRandomColorWithContrast('#151A20');

        let time = 10000 + Math.random() * 20000; // 随机生成持续时间

        let animate = function() {
            let left = parseFloat(obj.style.left);
            let elapsedTime = performance.now() - startTime;
            if (left > -width && elapsedTime < time) {
                let progress = elapsedTime / time;
                let distanceToMove = width * progress;
                obj.style.left = (begin - distanceToMove) + "px";
                requestAnimationFrame(animate);
            } else {
                obj.remove(); // 弹幕移动完成后移除弹幕对象
            }
        };

        let startTime = performance.now();
        requestAnimationFrame(animate);

    };

    let luminanace=function (r, g, b) {
        // 将 RGB 值转换为相对亮度
        let a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        // 使用系数计算亮度
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    let contrast=function (rgb1, rgb2) {
        // 将十六进制颜色转换为 RGB
        let result1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb1);
        let result2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb2);
        let rgb1Obj = result1 ? {
            r: parseInt(result1[1], 16),
            g: parseInt(result1[2], 16),
            b: parseInt(result1[3], 16)
        } : null;
        let rgb2Obj = result2 ? {
            r: parseInt(result2[1], 16),
            g: parseInt(result2[2], 16),
            b: parseInt(result2[3], 16)
        } : null;

        // 计算每种颜色的亮度f
        let lum1 = luminanace(rgb1Obj.r, rgb1Obj.g, rgb1Obj.b);
        let lum2 = luminanace(rgb2Obj.r, rgb2Obj.g, rgb2Obj.b);

        // 确定最亮和最暗的颜色
        let brightest = Math.max(lum1, lum2);
        let darkest = Math.min(lum1, lum2);

        console.log("contrast",(brightest + 0.05) / (darkest + 0.05))
        // 计算对比度比率，并进行轻微调整以避免除以零
        return (brightest + 0.05) / (darkest + 0.05);
    }


    /**
     * 获取与背景颜色对比度足够的随机颜色
     * @param {string} bgColor - 背景颜色的十六进制表示（例如：#151A20）
     * @returns {string} - 返回随机颜色的十六进制表示（例如：#aabbcc）
     */
    let getRandomColorWithContrast = function(bgColor) {

        // 生成随机颜色，并确保其与背景颜色的对比色不同
        let newColor = '#' + (Math.random().toString(16) + '000000').slice(2, 8);   // 生成六位十六进制颜色代码
        while (contrast(newColor,bgColor) < 4.5){ //对比度小于4.5时 参考 https://juejin.cn/post/6942304569665781790
            newColor = '#' + (Math.random().toString(16) + '000000').slice(2, 8);
        }

        return newColor;
    };

    let runDanMu = function() {
        if (arr.length > 0) {
            let n = Math.floor(Math.random() * arr.length); // 随机选择弹幕数组中的一个值
            let textObj = document.createElement("div");
            textObj.textContent = arr[n];
            screen.appendChild(textObj); // 在屏幕上添加随机选择的弹幕
            moveObj(textObj); // 移动弹幕对象
        }
        setTimeout(runDanMu, 500); // 每隔一秒继续运行弹幕
    };

    runDanMu(); // 开始运行弹幕
});
