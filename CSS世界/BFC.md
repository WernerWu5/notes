## 简介

在解释BFC之前，先说一下文档流。我们常说的文档流其实分为**定位流**、**浮动流**、**普通流**三种。而普通流其实就是指BFC中的FC。FC(Formatting Context)，直译过来是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。常见的FC有BFC、IFC，还有GFC和FFC。

BFC(Block Formatting Context)块级格式化上下文，是用于布局块级盒子的一块渲染区域。MDN上的解释：BFC是Web页面 CSS 视觉渲染的一部分，用于决定块盒子的布局及浮动相互影响范围的一个区域。


注意：一个BFC的范围包含创建该上下文元素的所有子元素，但**不包括**创建了新BFC的子元素的内部元素。这从另一方角度说明，一个元素不能同时存在于两个BFC中。因为如果一个元素能够同时处于两个BFC中，那么就意味着这个元素能与两个BFC中的元素发生作用，就违反了BFC的隔离作用。

## 三种文档流的定位方案

### 常规流(Normal flow)

* 在常规流中，盒一个接着一个排列;
* 在块级格式化上下文里面， 它们竖着排列；
* 在行内格式化上下文里面， 它们横着排列;
* 当position为static或relative，并且float为none时会触发常规流；
* 对于静态定位(static positioning)，position: static，盒的位置是常规流布局里的位置；
* 对于相对定位(relative positioning)，position: relative，盒偏移位置由top、bottom、left、right属性定义。即使有偏移，仍然保留原有的位置，其它常规流不能占用这个位置。

### 浮动(Floats)

* 左浮动元素尽量靠左、靠上，右浮动同理
* 这导致常规流环绕在它的周边，除非设置 clear 属性
* 浮动元素不会影响块级元素的布局
* 但浮动元素会影响行内元素的布局，让其围绕在自己周围，撑大父级元素，从而间接影响块级元素布局
* 最高点不会超过当前行的最高点、它前面的浮动元素的最高点
* 不超过它的包含块，除非元素本身已经比包含块更宽
* 行内元素出现在左浮动元素的右边和右浮动元素的左边，左浮动元素的左边和右浮动元素的右边是不会摆放浮动元素的

### 绝对定位(Absolute positioning)
* 绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
* 它的定位相对于它的包含块，相关CSS属性：top、bottom、left、right；
* 如果元素的属性position为absolute或fixed，它是绝对定位元素；
* 对于position: absolute，元素定位将相对于上级元素中最近的一个relative、fixed、absolute，如果没有则相对于body；


## BFC触发方式

* 根元素，即HTML标签
* 浮动元素：float值为left、right
* overflow值不为 visible，为 auto、scroll、hidden
* display值为 inline-block、table-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
* 定位元素：position值为 absolute、fixed

**注意**：display:table也可以生成BFC的原因在于Table会默认生成一个匿名的table-cell，是这个匿名的table-cell生成了BFC。

## 约束规则

浏览器对BFC区域的约束规则：

* 生成BFC元素的子元素会一个接一个的放置。
* 垂直方向上他们的起点是一个包含块的顶部，两个相邻子元素之间的垂直距离取决于元素的margin特性。在BFC中相邻的块级元素的外边距会折叠(Mastering margin collapsing)。
* 生成BFC元素的子元素中，每一个子元素左外边距与包含块的左边界相接触（对于从右到左的格式化，右外边距接触右边界），即使浮动元素也是如此（尽管子元素的内容区域会由于浮动而压缩），除非这个子元素也创建了一个新的BFC（如它自身也是一个浮动元素）。

规则解读：

* 内部的Box会在垂直方向上一个接一个的放置
* 内部的Box垂直方向上的距离由margin决定。（完整的说法是：属于同一个BFC的两个相邻Box的margin会发生折叠，不同BFC不会发生折叠。）
* 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）
* BFC的区域不会与float的元素区域重叠
* 计算BFC的高度时，浮动子元素也参与计算


## 作用

BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然。我们可以利用BFC的这个特性来做很多事。

### 1.解决margin重叠问题

margin重叠现象：相邻的垂直元素同时设置了margin后，实际margin值会塌陷到其中较大的那个值。

```html
<style>
  *{margin:0;padding:0;}
　.box p{margin:20px auto;background:pink;}
</style>

<div class="box">
　<p>Hello,world</p>
  <p>Hello,world</p>
  <p>Hello,world</p>
</div>
```
这时候就会发现上下margin重叠了。

我们可以在其中一个元素外面包裹一层容器，并触发该容器生成一个BFC。那么两个元素便属于不同的BFC，就不会发生margin重叠了。

```html
<div class="box">
　<p>Hello,world</p> 
　<div style="overflow:hidden">
    <p>Hello,world</p>
  </div>
    <p>Hello,world</p>
</div>
```
我们使用overflow:hidden；生成了一个BFC，成功解决了margin重叠问题。


### 2.解决浮动问题
我们知道给父元素设置overflow:hidden可以清除子元素的浮动，但往往都不知道原理是什么。

其实这就是应用了BFC的原理：当在父元素中设置overflow:hidden时就会触发BFC，所以他内部的元素就不会影响外面的布局，BFC就把浮动的子元素高度当做了自己内部的高度去处理溢出，所以外面看起来是清除了浮动。

```html
<div class="one">//给父元素添加overflow:hidden，
　　<div class="two">Hello World!</div>
</div>
```

### 3.解决侵占浮动元素的问题

当一个元素浮动，另一个元素不浮动时，浮动元素因为脱离文档流就会盖在不浮动的元素上。

解决办法：我们给另一个元素也添加浮动，或者添加overflow:hidden

我们为非浮动元素建立BFC环境，根据BFC的不与float box重叠的规则，解决了侵占元素问题。


[CSS中重要的BFC](https://segmentfault.com/a/1190000013023485)