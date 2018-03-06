Properties = require "eevee/config/properties"

module.exports = ->
  @baseInfo.name = "链接组件"
  @baseInfo.description = "页面跳转链接"

  @configs.ext =
    name: "组件设置"

  defaultColorProperty = new Properties.Property @,
    name: "color"
    label: "默认颜色"
    description: "正常显示的颜色"
    type: "text",
    default: '#000'
    useData: true
    reRender: true

  hoverColorProperty = new Properties.Property @,
    name: "hoverColor"
    label: "鼠标hover颜色"
    description: "鼠标放置在链接上的颜色"
    type: "text"
    default: '#016AE6'
    useData: true
    reRender: true

  pageProperty = new Properties.Property @,
    name: "newPage"
    label: "新标签页打开"
    description: "是否在新标签页打开，默认当前页打开"
    type: "radio"
    options:
      "true": "是"
      "false": "否"
    default: "true"
    useData: true

  fontSizeProperty = new Properties.Property @,
    name: "fontSize"
    label: "字号"
    description: "字体大小"
    type: "text"
    default: "16"
    useData: true
    reRender: true

  showDistrictCodeProperty = new Properties.Property @,
    name: "showDistrictCode"
    label: "显示区划"
    description: "根据区划显示链接"
    type: "text"
    useData: true
    reRender: true

  ifimgProperty = new Properties.Property @,
    name: "ifimg"
    label: "是否显示new图片"
    description: "是否显示new图片"
    type: "text"
    useData: true
    reRender: true

  @registerConfigProperty "ext", showDistrictCodeProperty, ifimgProperty, defaultColorProperty, hoverColorProperty, fontSizeProperty, pageProperty