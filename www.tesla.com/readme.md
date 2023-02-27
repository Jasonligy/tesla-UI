所有的html内容都还在，只不过把当前展示的内容放到section里面了，并把其他内容隐藏
通过createhomepageoverlay函数创造了一个section element，用来展示当前的车型。
, i !== this.homepageHeroIndex && (this.homepageHeroIndex = i, this.updateHeroContentSection(i))这个来控制车型说明的切换  this.updateHeroContentSection
tcl-homepage-hero--overlay通过把style设置成stick，把页面全部糊住了,只不过用了transparent
&& (document.body.classList.contains("template-landing-page--content-snapping-off")这个来控制section的创建，如果section没有创建，则车型会跟随图片一起移动
template-landing-page--content-snapping-on :very important to the feature!!!


.template-landing-page--content-snapping-on .tcl-homepage-hero:not(.tcl-homepage-hero--overlay) .tcl-homepage-hero__content {
    display: none;
    display: var(--tcl-homepage-hero-content-display);
    z-index: -1;
    z-index: var(--tcl-homepage-hero-content-z-index)
}