import FavoriteShop from 'favorite_shop/view'

class SupplierInfo {
  constructor($) {
    this.init();
    this.preRender()
    this.renderAvgScore();
    this.bindEvent();
  }

  init() {
    let _DATA_ = $('.supplier').data('details');
    let tags;
    if(_DATA_){
      tags = _DATA_.tags;
      if(tags){
        for(let i=0; i<tags.length; i++){
          if( (tags[i].indexOf('zzg') >= 0) && (_DATA_.supplierTypeCode == "1") ){  //
            $('.special-supplier').removeClass('hide');
            return;
          }
        }
        $('.common-supplier').removeClass('hide');
      }
      else {
        $('.common-supplier').removeClass('hide');
      }
    }
  }

  preRender () {
    let shopId = $('button.js-add-favor').data('shopId'),
      userId = $('button.js-add-favor').data('userId')
    if (shopId && userId) {
      FavoriteShop.getShopsFollowStatus([shopId], (result) => {
        $('button.js-add-favor').each((i, e) => {
          let shopId = $(e).data('shopId')
          if (result[shopId]) {
            $(e).replaceWith('<button class="btn btn-info disabled" disabled>已关注</button>')
          }
        })
      })
    }
  }

  //渲染平均值比较以及hover效果
  renderAvgScore(){
    let ifvaccine = $("#IF_VACCINE").val();
    if(ifvaccine==1){
      $(".seller-info-content").find("li.supplier-avg-score-box").eq(0).hide();
    }
    let $li = $(".supplier-details .js-supplier-avg-score-li");
    let $avgDiv = $(".supplier-details .js-supplier-avg-score-div");
    if($avgDiv.length == 0) return;
    let popTab = '<table class="table score-popover-table"><thead><tr><td width="50%">供应商动态评分</td><td width="50%">与其他供应商相比</td></tr></thead><tbody>';
    for(var i=0;i<$avgDiv.length;i++){
      let targetId = $avgDiv.eq(i).data("targetid");
      let targetName = $avgDiv.eq(i).find(".js-target-name").text()||"";
      let curScore = $avgDiv.eq(i).find(".js-average-score").text()||0;
      let avgScore = ((parseFloat($("input[targetid="+targetId+"]").val()))/100)||0;
      let dVal = parseFloat(curScore)-avgScore;
      let avgStyle="",iconStyle="",dValPercent,percentSty;
      if(dVal>0){
        iconStyle = "icon-diyu";
        avgStyle = "avg-up";
      }else if(dVal<0){
        iconStyle = "icon-gaoyu";
        avgStyle = "avg-down";
      }else{
        iconStyle = "icon-chiping";
        avgStyle = "avg-cp";
      }
      if(dVal == 0){
        dValPercent = "----";
        percentSty = "percent-equal";
      }else{
        if(avgScore == 0){
          dValPercent = "----";
          percentSty = "percent-equal";
        }else{
          dValPercent = (Math.abs(dVal)/parseFloat(avgScore)).toFixed(2)+"%";
          percentSty = "percent-number";
        }
      }
      $avgDiv.eq(i).find(".js-average-score i.icon-zcy").addClass(iconStyle).addClass(avgStyle);
      popTab += '<tr><td><span class="targetname-td">'+targetName.substring(0,2)+'：</span><span class='+avgStyle+'>'+curScore+'</span></td>' +
          '<td><i class="'+avgStyle+' icon-zcy '+iconStyle+'"></i><span class='+percentSty+'>'+dValPercent+'</span></td></tr>';
    }
    popTab = popTab + '</tbody></table>';
    let scorePop = $li.popover({
      placement: 'bottom',
      html: true,
      content: popTab
    });

    $(".supplier-details .js-supplier-avg-score-li").hover(function(){
      scorePop.popover('show');
    },function(){
      scorePop.popover('hide');
    })
  }

  bindEvent() {
    $(".js-contact").on("click",(evt) => this.contactFun(evt));

    // 进入店铺
    $('.js-enter-shop').off().on('click', (evt)=>{
      let shopId = $(evt.currentTarget).data('shopId');
      let url = '/eevees/shop?searchType=1&shopId=' + shopId
      window.open(url);
    })
    // 关注店铺
    $('.js-add-favor').off().on('click', (evt) => {
      $(evt.currentTarget).prop('disabled', true)
      let shopId = $(evt.currentTarget).data('shopId')
      if (shopId) {
        FavoriteShop.followShops([shopId], () => {
          $(evt.currentTarget).replaceWith('<button class="btn btn-info disabled" disabled>已关注</button>')
        }, ()=>{
          $(evt.currentTarget).prop('disabled', false)
        })
      }
    })
  }
  contactFun(evt){
    let target = $(evt.target);
    let type = target.closest('.contact-box-warp').data("type");
    let userName = target.data("name");
    if(type == "ww"){
      if(userName && userName !== ""){
        window.open("aliim:sendmsg?touid=cntaobao"+userName);
      }
    }else if(type == "qq"){
      let idNumber = target.data("qqid");
      let site = target.data("site");
      if(idNumber && idNumber !== ""){
        window.open("http://wpa.qq.com/msgrd?V=3&uin="+idNumber+"&Site="+site+"&Menu=yes");
      }
    }
  }
}

module.exports =  SupplierInfo
