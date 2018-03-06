const OriginShelfItem = require("seller/shelf_item/view")

const Modal = require("pokeball/components/modal")

const listExamineTemplate = Handlebars.templates["seller/shelf_item/templates/list_examine"]
const unfreezeWidthComment = Handlebars.templates["seller/item_supervise/templates/unfreeze_with_comment"]
const itemOn = Handlebars.templates["seller/product_manage/templates/item-on"]

let examine

class ProductManage extends OriginShelfItem {
  constructor($) {
    super($)
  }

  bindEvent() {
    super.bindEvent()
    let self = this
    $("body").on("keyup", "#js-examine-reason", function() {
      $(this).val() != "" && $(".js-examine-submit").attr("disabled", false)
      $(this).val() == "" && $(".js-examine-submit").attr("disabled", true)
    })
    $('body').on('keyup', '.unfrozen-comment', function() {
      let canSubmit = $(this).val() === ''
      $('.btn-unfrozen-submit').attr('disabled', canSubmit)
    })
    $('body').on('click', '.js-item-unfrozen', function(evt) {
      self.onUnfrozenItem(evt)
    })
    //tab页签选中状态
    let tabs=$(".tab-navs").find("li");
    let tabStatus=$.query.get("step");
    tabs.removeClass("active");
    if(tabStatus==0){
      $(tabs[0]).addClass("active");
    }else if(tabStatus==6){
      $(tabs[1]).addClass("active");
    }
    //编辑操作增加ptype
    let step=$.query.get("step");
    $.each($(".js-edit-item"),function (index,node) {
      node.href+=("&ptype="+step);
    })
  }

  // 重载下架
  offTheItem(evt) {
    let itemId = $(evt.currentTarget).closest("tr").data("id")
    $(".js-item-off").attr("id", itemId)
    $(document).on("confirm:off-one", () => this.itemsOff(itemId))
  }
  itemsOff(itemId){
    $.ajax({
      url: "/api/seller/items/undershelfAll",
      type: "POST",
      data: {
        "itemId": itemId
      },
      success: () => {
        window.location.reload();
      },
      complete: () => {
      }
    })
  }

  // 重载上架
  onTheItem(evt) {
    let vm = this;
    let itemId = $(evt.currentTarget).closest("tr").data("id")
    $(".js-item-on").attr("id", itemId)
    let name = $(evt.currentTarget).parent().parent().find(".left-text").find("a").text();
    $(document).off('confirm:on-one').on("confirm:on-one", function(event, data) {
      let listExamine = $(listExamineTemplate({
        name
      }));
      new Modal(listExamine).show();
      $(".js-examine-submit").on("click", function() {
        let auditComment = $("#js-examine-reason").val();
        vm.itemOnshelfExamin(data, auditComment)
      })
    })
  }

  // 批量下架商品
  batchOffItems() {
    let items = _.map($("input.js-item-select:checked"), (i) => $(i).closest("tr").data("id"))
    if (items.length) {
      this.changeItemStatus(items, "-1")
    } else {
      new Modal({
        icon: "error",
        title: "没有商品没选中",
        content: "请勾选至少一个需要操作的商品"
      }).show()
    }
  }

  // 批量上架
  batchOnItems() {
    let vm = this;
    let items = _.map($("input.js-item-select:checked"), (i) => {
      return $(i).closest("tr").data("id")
    })
    let name = "批量商品"
    if (items.length) {
      let listExamine = $(listExamineTemplate({
        name
      }));
      new Modal(listExamine).show();
      $(".js-examine-submit").on("click", function() {
        let auditComment = $("#js-examine-reason").val();
        vm.batchItemOnshelfExamin(items, auditComment)
      })
    } else {
      new Modal({
        icon: "error",
        title: "没有商品没选中",
        content: "请勾选至少一个需要操作的商品"
      }).show()
    }
  }

  // 重载商品选择
  selectItem(evt) {
    let totalCount = 0;
    _.each($(".js-item-select:checked"), (item) => {onshelfAll
      totalCount++
    });
    if (totalCount != 0) {
      $(".js-item-batch-delete").removeAttr("disabled");
    } else {
      $(".js-item-batch-delete").attr("disabled", true);
    }
  }

  // 重载批量选择
  selectBatch(evt) {
    $("input.js-item-select").prop("checked", $(evt.currentTarget).prop("checked") ? true : false)
    this.selectItem(evt)
  }
  //重写商品删除
  deleteTheItem (evt) {
    let itemId = $(evt.currentTarget).closest("tr").data("id")
    $(".js-item-delete").attr("id", itemId)
    $(document).on("confirm:delete-one", (event, data)=> this.itemsDelete(data))
  }
  itemsDelete(data){
    $.ajax({
      url: "/api/seller/items/delete",
      type: "POST",
      data: {
        "itemId": data
      },
      success: () => {
        window.location.reload();
      },
      complete: () => {
      }
    })
  }

  //检查商品是否是协议商品(上架)
  checkItemdiscont(itemIds, callback) {
    $("body").spin("medium")
    $.ajax({
      async: false,
      url: "/api/seller/items/check-discount",
      type: "POST",
      data: {
        "itemIds": itemIds
      },
      success: (data) => {
        examine = data;
      },
      complete: () => {
        $("body").spin(false)
      }
    })
  }

  //商品上架申请单个
  itemOnshelfExamin(itemId, auditComment) {
    $(".js-examine-submit").prop("disabled", true)
    $("body").spin("medium")
    $.ajax({
      url: "/api/seller/items/onshelfAll",
      type: "POST",
      data: {
        "itemId": itemId,
        "auditComment": auditComment,
        "auditResult": "SUBMIT_FIRST_AUDIT"
      },
      success: (data) => {
        new Modal($(itemOn(data))).show();
        $('.btn-reload').off().on('click', function() {
          window.location.reload();
        })
      },
      complete: () => {
        $("body").spin(false)
      }
    })
  }

  //商品上架申请批量
  batchItemOnshelfExamin(itemIds, auditComment) {
    $(".js-examine-submit").prop("disabled", true)
    $("body").spin("medium")
    $.ajax({
      url: "/api/seller/items/batch-onshelf",
      type: "POST",
      data: {
        "itemIds": itemIds,
        "auditComment": auditComment,
        "auditResult": "SUBMIT_FIRST_AUDIT"
      },
      success: () => {
        window.location.reload()
        $(".js-examine-submit").prop("disabled", false)
      },
      complete: () => {
        $("body").spin(false)
      }
    })
  }

  //重载商品详情编辑
  getItemDetail(evt) {
    if ($(evt.currentTarget).data("status") == "2") { //待审核状态不允许编辑
      return false;
    }
    let itemId = $(evt.currentTarget).data("id")
    $.ajax({
      url: `/api/seller/items/${itemId}/detail`,
      type: "GET",
      dataType: "html",
      success: (data) => {
        this.renderRichEditor(itemId, data)
      }
    })
  }

  onUnfrozenItem(evt) {
    let itemId = $(evt.currentTarget).closest("tr").data("id")
    let self = this
    let modalUnfrozen = new Modal(unfreezeWidthComment())
    modalUnfrozen.show(function(modal) {
      let comment = $('.unfrozen-comment', modal).val()
      self.unfrozenItem(itemId, comment)
    })
  }

  unfrozenItem(itemId, comment) {
      let api = '/api/seller/items/common/applyUnfrozenItem'
      $("body").spin("medium")
      $.ajax({
        url: api,
        type: 'POST',
        data: {
          itemId: itemId,
          comment: comment
        },
        success: () => {
          window.location.reload()
        },
        complete: () => {
          $("body").spin(false)
        }
      })
    }

}

module.exports = ProductManage