淘宝方案Flexible很好解决了自适应，其中有引入dpr是为了解决1px在高清屏比较粗的问题。
而具体如何解决：设备逻辑像素宽度放大dpr倍再整体缩小1/dpr倍，相当于设备分辨率宽度，公式：

```
device-width = 最大物理像素 / (dpr * scale)
```

CSS像素 = 设备独立像素(DIP) = 逻辑像素(DIP)

DPR(设备像素比) ＝ 物理像素个数  / 逻辑像素

在dpr为2时，1px的逻辑像素占据了2个物理像素个数，所以在高清屏看来，我们会觉得边框变粗了

**单条 border**
```css
.hairlines li{
    position: relative;
    border:none;
}
.hairlines li:after{
    content: '';
    position: absolute;
    left: 0;
    background: #000;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
}
```

**四条 border**
```css
.hairlines li{
    position: relative;
    margin-bottom: 20px;
    border:none;
}
.hairlines li:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #000;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: left top;
    transform-origin: left top;
}
```

```js
if(window.devicePixelRatio && devicePixelRatio >= 2){
    document.querySelector('ul').className = 'hairlines';
}
```