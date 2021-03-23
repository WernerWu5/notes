## css行高line-height的一些深入理解及应用

### 介绍
“行高”顾名思意指一行文字的高度。具体来说是指两行文字间基线之间的距离。

![](http://image.zhangxinxu.com/image/blog/200911/base_line.jpg)

vertical-align中有top,middle,baseline,bottom与之是由关联的，但具体细节如何，浏览器差异怎样，我还不是很清楚


### line-height与line boxes高度

CSS中起高度作用的应该就是height以及line-height了吧！如果一个标签没有定义height属性(包括百分比高度)，那么其最终表现的高度一定是由line-height起作用，即使是IE6下11像素左右默认高度bug也是如此。待我慢慢叙来。

先说一个大家都熟知的现象，有一个空的div，`<div></div>`，如果没有设置至少大于1像素高度height值时，该div的高度就是个0。如果该div里面打入了一个空格或是文字，则此div就会有一个高度。那么您思考过没有，为什么div里面有文字后就会有高度呢？

这是个看上去很简单的问题，是理解line-height非常重要的一个问题。可能有人会跟认为是：文字撑开的！文字占据空间，自然将div撑开。我一开始也是这样理解的，但是事实上，深入理解inline模型后，我发现，根本不是文字撑开了div的高度，而是line-height！要证明很简单(如下测试代码)：

CSS代码：
```css
.test1{
  font-size:20px;
  line-height:0; 
  border:1px solid #cccccc; 
  background:#eeeeee;
}
.test2{
  font-size:0;
  line-height:20px;
  border:1px solid #cccccc;
  background:#eeeeee;
}
```
HTML代码：
```html
<div class="test1">测试</div>
<div class="test2">测试</div>
```
结果如下图(windows IE6浏览器下)：

![](http://image.zhangxinxu.com/image/blog/200911/2009-11-28_002310.png)

结果是如此的显而易见，test1 div有文字大小，但行高为0，结果div的高度就是个0；test2 div文字大小为0，但是有行高，为20像素，结果div高度就是20像素。这就说明撑开div高度的是line-height不是文字内容。

到底这个line-height行高怎么就产生了高度呢？在inline box模型中，有个line boxes，这玩意是看不见的，这个玩意的工作就是包裹每行文字。一行文字一个line boxes。例如“艾佛森退役”这5个字，如果它们在一行显示，你艾佛森再牛逼，对不起，只有一个line boxes罩着你；但“春哥纯爷们”这5个字，要是竖着写，一行一个，那真是够爷们，一个字罩着一个line boxes，于是总计五个line boxes。line boxes什么特性也没有，就高度。所以一个没有设置height属性的div的高度就是由一个一个line boxes的高度堆积而成的。

其实line boxes不是直接的生产者，属于中层干部，真正的活儿都是它的手下 – inline boxes干的，这些手下就是文字啦，图片啊，`<span>`之类的inline属性的标签啦。line boxes只是个考察汇报人员，考察它的手下谁的实际line-height值最高，谁最高，它就要谁的值，然后向上汇报，形成高度。例如，`<span style="line-height:20px;">`取手下line-height`<span style="line-height:40px;">`最高`</span>`的值`</span>`。则line boxes的高度就是40像素了

### 行高的垂直居中性

行高还有一个特性，叫做垂直居中性。line-height的最终表现是通过line boxes实现的，而无论line boxes所占据的高度是多少（无论比文字大还是比文字小），其占据的空间都是与文字内容公用水平中垂线的。还拿上面这张图来说吧。

![](http://image.zhangxinxu.com/image/blog/200911/2009-11-28_002310.png)

看test1的结果，此时line boxes的高度为0，但是它是以文字的水平中垂线对称分布的。这一重要的特性可以用来实现文字或图片的垂直居中对齐。

### 在单行或多行或图片垂直居中实现上的应用

#### 单行文字的垂直居中对齐









### 转自：

[css行高line-height的一些深入理解及应用](https://www.zhangxinxu.com/wordpress/2009/11/css%E8%A1%8C%E9%AB%98line-height%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8F%8A%E5%BA%94%E7%94%A8/)