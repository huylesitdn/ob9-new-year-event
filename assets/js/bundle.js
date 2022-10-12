function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

// Translator

const LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: "assets/i18n",
  // filesLocation: "https://raw.githubusercontent.com/huylesitdn/ob9-desktop/main/assets/i18n",
});

const PREFERED_REGION = "preferred_region";
const _get_translator_config =
  translator.config.persistKey || "preferred_language";
const _get_language =
  localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
const _get_region = localStorage.getItem(PREFERED_REGION) || 'Malaysia';

translator.fetch([LANGUAGES.EN, LANGUAGES.ZH]).then(() => {
  // -> Translations are ready...
  translator.translatePageTo(_get_language);
  changeLanguageColor();
  renderAfterHaveTranslator();
});

/**
 * MENU SLIDE
 *
 */

$("#navMenu").on("click", function (e) {
  $("#mySidenav").addClass("active");
});

$("#mySidenav .backdrop, #mySidenav a.left-nav__top__nav__item__link").on(
  "click",
  function (e) {
    $("#mySidenav").removeClass("active");
  }
);

const selectLanguageModalElm = $("#selectLanguage");
if (selectLanguageModalElm.length > 0) {
  var selectLanguageModal = new bootstrap.Modal(selectLanguageModalElm, {});
}
$(".choose-language").on("click", function (e) {
  const select_language = $(this).data("language");
  const select_region = $(this).data("region");
  const accept_languages = ["Malaysia", "Singapore"];

  if (!accept_languages.includes(select_region)) {
    window.location.href = "/access-denied.html";
    return false;
  }

  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    selectLanguageModal.hide();
    $("#mySidenav").removeClass("active");
    localStorage.setItem(PREFERED_REGION, select_region);
    changeLanguageColor();
    window.location.reload();
  } else {
    console.log("No language setup");
  }
});

$(".universal__content__language").on("click", function (e) {
  const select_language = $(this).data("language");
  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    window.location.href = "/";
  } else {
    console.log("No language setup");
  }
});

$(".universal .play-now a").on("click", function (e) {
  e.preventDefault();
  const slick_current_select = $(
    "#selectLanguage .slick-list .slick-track .slick-current .title"
  );
  if (slick_current_select.length > 0) {
    const slick_current_select_title = slick_current_select.data("i18n");
    const accept_languages = [
      "universal_page.Malaysia",
      "universal_page.Singapore",
    ];
    if (accept_languages.includes(slick_current_select_title)) {
      window.location.href = "/login.html";
    } else {
      window.location.href = "/access-denied.html";
    }
  }
});

function changeLanguageColor() {
  $(".choose-language").each(function () {
    const get_attr_lang = $(this).data("language").toLowerCase();
    const get_attr_region = $(this).data("region");
    const _get_region = localStorage.getItem(PREFERED_REGION);
    if (_get_language == get_attr_lang && _get_region == get_attr_region) {
      $(this).addClass("text-primary");
    }
  });
}

/**
 * MENU SLIDE
 *
 */

/**
 * SCROLL TEXT
 *
 */

//this is the useful function to scroll a text inside an element...
function startScrolling(scroller_obj, velocity, start_from) {
  //bind animation  inside the scroller element
  scroller_obj
    .bind("marquee", function (event, c) {
      //text to scroll
      var ob = $(this);
      //scroller width
      var sw = parseInt(ob.closest(".text-animated").width());
      //text width
      var tw = parseInt(ob.width());
      //text left position relative to the offset parent
      var tl = parseInt(ob.position().left);
      //velocity converted to calculate duration
      var v = velocity > 0 && velocity < 100 ? (100 - velocity) * 1000 : 5000;
      //same velocity for different text's length in relation with duration
      var dr = (v * tw) / sw + v;
      //is it scrolling from right or left?
      switch (start_from) {
        case "right":
          //   console.log('here')
          //is it the first time?
          if (typeof c == "undefined") {
            //if yes, start from the absolute right
            ob.css({
              left: sw,
            });
            sw = -tw;
          } else {
            //else calculate destination position
            sw = tl - (tw + sw);
          }
          break;
        default:
          if (typeof c == "undefined") {
            //start from the absolute left
            ob.css({
              left: -tw,
            });
          } else {
            //else calculate destination position
            sw += tl + tw;
          }
      }
      //attach animation to scroller element and start it by a trigger
      ob.animate(
        {
          left: sw,
        },
        {
          duration: dr,
          easing: "linear",
          complete: function () {
            ob.trigger("marquee");
          },
          step: function () {
            //check if scroller limits are reached
            if (start_from == "right") {
              if (parseInt(ob.position().left) < -parseInt(ob.width())) {
                //we need to stop and restart animation
                ob.stop();
                ob.trigger("marquee");
              }
            } else {
              if (
                parseInt(ob.position().left) > parseInt(ob.parent().width())
              ) {
                ob.stop();
                ob.trigger("marquee");
              }
            }
          },
        }
      );
    })
    .trigger("marquee");
  //pause scrolling animation on mouse over
  scroller_obj.mouseover(function () {
    $(this).stop();
  });
  //resume scrolling animation on mouse out
  scroller_obj.mouseout(function () {
    $(this).trigger("marquee", ["resume"]);
  });
}

$(function () {
  $(".text-animated").each(function (i, obj) {
    if ($(this).find(".text-overflow").width() > $(this).width()) {
      //settings to pass to function
      var scroller = $(this).find(".text-overflow"); // element(s) to scroll
      var scrolling_velocity = 95; // 1-99
      var scrolling_from = "right"; // 'right' or 'left'
      //call the function and start to scroll..
      startScrolling(scroller, scrolling_velocity, scrolling_from);
    }
  });
});

/**
 * END SCROLL TEXT
 *
 */

$(".universal .btn-play-now").on("click", function () {
  const language_value = $(
    ".universal input[name='universal_radio']:checked"
  ).val();
  const allow_region = ["Malaysia", "Singapore"];
  if (allow_region.includes(language_value)) {
    localStorage.setItem(PREFERED_REGION, language_value);
    window.location.href = "/login.html";
  } else {
    window.location.href = "/access-denied.html";
  }
});



$('.back_to_top').on("click", function (e) {
  e.preventDefault();
  // $(window).scrollTop(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
})


$("#carouselSposorshipEventVideo").slick({
  centerMode: true,
  infinite: true,
  slidesToShow: 1,
  arrows: true,
  dots: true,
});

$("#carouselSponsoredEventPhotos1").slick({
  centerMode: true,
  infinite: true,
  slidesToShow: 1,
  arrows: false,
  dots: true,
});


const incorrectEmailModalElm = $("#incorrectEmailModal");
if (incorrectEmailModalElm.length > 0) {
  var incorrectEmailModal = new bootstrap.Modal(incorrectEmailModalElm, {});
}
$('.forget-password-page .btn-next').on('click', function (e) {
  const forget_password_input = $('.forget-password-page #forget_password_input')
  if (!forget_password_input.val()) {
    incorrectEmailModal.show();
  } else {
    window.location.href = '/forget-password-success.html';
  }
});

const selectPromotionModalElm = $("#selectPromotionModal");
if (selectPromotionModalElm.length > 0) {
  var selectPromotionModal = new bootstrap.Modal(selectPromotionModalElm, {});
}
// $(".select-promotion__items").on("click", function (e) {
//   setTimeout(() => {
//     selectPromotionModal.hide();
//     $(".deposit-amount__summary").removeClass("d-none");
//     $(".deposit-amount__action .btn-submit").attr("disabled", false);
//     $("#select-promotion-placeholder").addClass("fw-bold");
//     $("#select-promotion-placeholder").css("color", "#000");
//     $("#select-promotion-placeholder").text("Welcome Bonus up to 180%");
//   }, 500);
// });

$(".select-promotion__items input[name='select-promotion-radio']").change(
  function () {

    const current_value = $(
      ".select-promotion__items input[name='select-promotion-radio']:checked"
    ).val();
    setTimeout(() => {
      if(current_value === '1') {
        const Welcome_Bonus_up_to = translator.translateForKey('Welcome_Bonus_up_to', _get_language);
        $('.Deposit_Summary_Promotion').text(Welcome_Bonus_up_to);
        $('.Deposit_Summary_Bonus').text('MYR 500');
        $('.Deposit_Summary_Turnover').text('x25');
        $('.Deposit_Summary_Turnover_Requirement').text('MYR 10,000');
        $(".select-promotion-placeholder").text(Welcome_Bonus_up_to);
      } else {
        const Don_want_to_claim_any_promotion = translator.translateForKey('Don_want_to_claim_any_promotion', _get_language);
        $('.Deposit_Summary_Promotion').text(Don_want_to_claim_any_promotion);
        $('.Deposit_Summary_Bonus').text('MYR 0');
        $('.Deposit_Summary_Turnover').text('x1');
        $('.Deposit_Summary_Turnover_Requirement').text('MYR 500');
        $(".select-promotion-placeholder").text(Don_want_to_claim_any_promotion);
      }
      selectPromotionModal.hide();
      $(".deposit-amount__summary").removeClass("d-none");
      $(".deposit-amount__action .btn-submit").attr("disabled", false);
      $(".select-promotion-placeholder").addClass("fw-bold");
      $(".select-promotion-placeholder").css("color", "#000");
    }, 500);
  }
);

const selectBankModalElm = $("#selectBankModal");
if (selectBankModalElm.length > 0) {
  var selectBankModal = new bootstrap.Modal(selectBankModalElm, {});
}
$(".select-bank-modal__items input[name='select-bank-modal-radio']").change(
  function () {

    const current_value = $(
      ".select-bank-modal__items input[name='select-bank-modal-radio']:checked"
    ).val();
    setTimeout(() => {
      selectBankModal.hide();
      $(".select-bank-placeholder").text(current_value);
      $(".select-bank-placeholder").addClass("fw-bold");
      $(".select-bank-placeholder").css("color", "#000");
    }, 500);
  }
);

$(".add-bank-account .select-bank-modal__items").on("click", function (e) {
  setTimeout(() => {
    selectBankModal.hide();
    const bank_input = $(
      ".add-bank-account .add-bank-account__content__input__select-bank__input__placeholder"
    );
    bank_input.html("MAYBANK");
    bank_input.addClass("fw-bold");
    const submit_btn = $(
      ".add-bank-account .add-bank-account__content__submit .btn"
    );
    submit_btn.removeClass("disabled");
    // submit_btn.prop("disabled", false);
  }, 500);
});

$(".deposit-page .deposit-amount__item input[name='depositAmount']").change(
  function () {
    const amount = $(this).data("amount");
    $(".deposit-amount-input").val(amount);
    $(".deposit-amount-input-label").hide();
  }
);

$(".deposit-page .deposit-items__content input[name='crypto_option']").change(
  function () {

    const current_value = $(
      ".deposit-page .deposit-items__content input[name='crypto_option']:checked"
    ).val();
    if(current_value === 'USDT') {
      $('#TRC_20').show();
    } else {
      $('#TRC_20').hide();
    }
  }
);


$('#Memo_copy').hide();
$(".deposit-page .deposit-items__content input[name='network_option']").change(
  function () {

    const current_value = $(
      ".deposit-page .deposit-items__content input[name='network_option']:checked"
    ).val();

    console.log(current_value)
    if(current_value === 'BEP 20') {
      $('#Memo_copy').show();
      $('#Memo_copy').css('margin-top', -30);
    } else {
      $('#Memo_copy').hide();
    }
  }
);

$(".deposit-amount-input").on("input", function (e) {
  const value = $(this).val();
  if (value > 50 && value < 50000) {
    $(".deposit-page .btn-submit").prop("disabled", false);
    $(".deposit-amount-input-label").hide();
  } else {
    $(".deposit-page .btn-submit").prop("disabled", true);
    $(".deposit-amount-input-label").show();
  }
});

$(".withdrawal-page #withdrawal-input").on("input", function (e) {
  const value = $(this).val();
  if (value > 50 && value < 50000) {
    $(".withdrawal-page .withdrawal-submit").prop("disabled", false);
    $("#withdrawal-amount-input-label").hide();
  } else {
    $(".withdrawal-page .withdrawal-submit").prop("disabled", true);
    $("#withdrawal-amount-input-label").show();
  }
});

$(".withdrawal-page .withdrawal-max-value").on("click", function (e) {
  $(".withdrawal-page #withdrawal-input").val(5800);
  $("#withdrawal-amount-input-label").hide();
  $(".withdrawal-page .withdrawal-submit").prop("disabled", false);
});

const successModalElm = $("#depositSuccessModal");
if (successModalElm.length > 0) {
  var successModal = new bootstrap.Modal(successModalElm, {});
}
$("#online-banking .btn-submit").on("click", function (e) {
  successModal.show();
});

const paymentGatewaySuccessModalElm = $("#paymentGatewaySuccessModal");
if (paymentGatewaySuccessModalElm.length > 0) {
  var paymentGatewaySuccessModal = new bootstrap.Modal(
    paymentGatewaySuccessModalElm,
    {}
  );
}
$("#payment-gateway .btn-submit").on("click", function (e) {
  paymentGatewaySuccessModal.show();
});

const transferConfirmModalElm = $("#transferConfirmModal");
if (transferConfirmModalElm.length > 0) {
  var transferConfirmModal = new bootstrap.Modal(transferConfirmModalElm, {});
}
$("#autoTransferCheck").on("click", function (e) {
  const isCheck = $(this).is(":checked");
  if (!isCheck) {
    e.preventDefault();
    transferConfirmModal.show();
  } else {
    $(".transfer .transfer__content__auto-switch-off").addClass("d-none");
    $(".transfer .transfer__content__action").addClass("d-none");
  }
});
$("#transferConfirmModal .btn-confirm").on("click", function (e) {
  const isCheck = $("#autoTransferCheck").is(":checked");
  $("#autoTransferCheck").prop("checked", !isCheck);
  transferConfirmModal.hide();
  $(".transfer .transfer__content__auto-switch-off").removeClass("d-none");
  $(".transfer .transfer__content__action").removeClass("d-none");
});

const chooseWalletModalElm = $("#chooseWalletModal");
if (chooseWalletModalElm.length > 0) {
  var chooseWalletModal = new bootstrap.Modal(chooseWalletModalElm, {});
}
$("#chooseWalletModal .choose-modal__items input[name=choose-modal-radio]").on(
  "change",
  function (e) {
    const current_value = $(
      "#chooseWalletModal .choose-modal__items input[name=choose-modal-radio]:checked"
    ).val();
    setTimeout(() => {
      const attach_new_elem = current_value.split("_");
      $("#auto-switch-off--left").html(attach_new_elem[0]);
      $("#auto-switch-off--right").html(attach_new_elem[1]);
      chooseWalletModal.hide();
    }, 500);
  }
);

$(
  "#selectProfilePictureModal .select-profile-picture-modal__items__item input[name=select-profile-picture-modal-radio]"
).on("change", function (e) {
  const current_value = $(
    "#selectProfilePictureModal .select-profile-picture-modal__items__item input[name=select-profile-picture-modal-radio]:checked"
  ).data("src");
  $(".profile .avatar > div > img").attr("src", current_value);
});





// inbox follow
$('.inbox-page .inbox_edit, .inbox-page .inbox_close').on('click', function () {
  toggleInboxDisplayNone();
  toggleInboxAction();
});

let inbox_select_all = false;
$(".inbox-page .inbox_select_all").click(function(e){
  e.preventDefault();

  inbox_select_all = !inbox_select_all;
  
  $('.inbox-page input[name="inbox_select"]').prop('checked', inbox_select_all);
  $('.inbox-page input[name="inbox_select_all"]').prop('checked', inbox_select_all);

  if (inbox_select_all) {
    toggleInboxAction(true);
  } else {
    toggleInboxAction();
  }
});


$('.inbox-page input[name="inbox_select"]').on("input", function() {
  let _is_check = false;
  $('.inbox-page input[name="inbox_select"]').each(function() {
    const checked = $(this).is(':checked');
    if(checked) {
      _is_check = true;
    }
  })
  toggleInboxAction(_is_check)
});

$('.inbox__action__mark_all_read').on("click", function() {
  const checked_value = $('.inbox-page input[name="inbox_select"]:checked');
  checked_value.each(function() {
    const parent = $(this).parent();
    parent.find('.badge').remove();
    $(this).prop('checked', false);
  });
  toggleInboxAction(false);
  toggleInboxDisplayNone();
  inbox_select_all = false;
  const select_all_label = translator.translateForKey('inbox_page.select_all', _get_language);
  $('.inbox-page .inbox_select_all').text(select_all_label);
})


$('.inbox_delete').on("click", function() {
  window.location.href = '/inbox-no-message.html'
  // const checked_value = $('.inbox-page input[name="inbox_select"]:checked');
  // checked_value.each(function() {
  //   $(this).parent().remove();
  //   $(this).prop('checked', false);
  // });
  // toggleInboxAction(false);
  // toggleInboxDisplayNone();
  // inbox_select_all = false;
  // const select_all_label = translator.translateForKey('inbox_page.select_all', _get_language);
  // $('.inbox-page .inbox_select_all').text(select_all_label);

  // const inbox__items = $('.inbox__items');
  // if (inbox__items.length === 0) {
  //   $('.inbox__empty').toggleClass('d-none')
  // }
})

$('.bonus-center-page .bonus-center-page__content__status__item .form-select').on('change', function() {
  const _val = $(this).val();
  if(_val === 'Claimed') {
    window.location.href = '/bonus-center-claimed.html'
  } else {
    window.location.href = '/bonus-center.html'
  }
});

$('.transaction-history-page .transaction-history-page__content__status__item .form-select').on('change', function() {
  const _val = $(this).val();
  switch (_val) {
    case 'Rebate':
      window.location.href = '/transaction-history-rebate.html'
      break;
    case 'Deposit':
      window.location.href = '/transaction-history.html'
      break;
    case 'Transfer':
      window.location.href = '/transaction-history-transfer.html'
      break;
  
    default:
      // window.location.href = '/transaction-history.html'
      break;
  }
});


function toggleInboxAction (show = false) {
  $(".inbox-page .inbox_read-all").prop("disabled", !show);
  $(".inbox-page .inbox_delete").prop("disabled", !show);
}

function toggleInboxDisplayNone () {
  $(`
    .inbox-page .inbox_select_all, 
    .inbox-page .inbox_back, 
    .inbox-page .inbox_close, 
    .inbox-page .inbox_edit,
    .inbox-page input[name="inbox_select"],
    .inbox-page .inbox__action
  `).toggleClass('d-none');
}

const is_register_thank_you_route = location.pathname === "/register-thank-you.html";
if (is_register_thank_you_route) {
  setTimeout(() => {
    window.location.href = '/deposit.html';
  }, 5000)
}

function renderAfterHaveTranslator () {
  var phonePopoverEl = $('#phonePopover');
  if(phonePopoverEl.length > 0 && translator) {
    phonePopoverEl.attr( "data-bs-content", translator.translateForKey('phone_tip', _get_language));
  }
  var emailPopoverEl = $('#emailPopover');
  if(emailPopoverEl.length > 0 && translator) {
    emailPopoverEl.attr( "data-bs-content", translator.translateForKey('email_tip', _get_language));
  }
  var infoPopoverEl = $('#infoPopover');
  if(infoPopoverEl.length > 0 && translator) {
    infoPopoverEl.attr( "data-bs-content", translator.translateForKey('user_tip', _get_language));
  }
  var bankPopoverEl = $('#bankPopover');
  if(bankPopoverEl.length > 0 && translator) {
    bankPopoverEl.attr( "data-bs-content", translator.translateForKey('bank_tip', _get_language));
  }


  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, {html: true})
  })



  var vipWeeklyAngpowHelpTooltipEl = $('#vipWeeklyAngpowHelpTooltip');
  if(vipWeeklyAngpowHelpTooltipEl.length > 0 && translator) {
    vipWeeklyAngpowHelpTooltipEl.attr("title", translator.translateForKey('vip_weekly_angpow_help_tooltip', _get_language));
    var vipWeeklyAngpowHelpTooltipElTooltip = new bootstrap.Tooltip(vipWeeklyAngpowHelpTooltipEl, {
      popperConfig: function (defaultBsPopperConfig) {
        // var newPopperConfig = {...}
        // use defaultBsPopperConfig if needed...
        // return newPopperConfig
      }
    });
  }

  changeFlagAndCountryName();
}

function changeFlagAndCountryName() {
  if(translator) {
    console.log(_get_region)

    var flagName = '1'
    switch (_get_region) {
      case 'Malaysia':
        flagName = '1'
        break;
      case 'Singapore':
        flagName = '2'
        break;
      case 'Thailand':
        flagName = '3'
        break;
      case 'Vietnam':
        flagName = '4'
        break;
      case 'Indonesia':
        flagName = '5'
        break;
      default:
        break;
    }
    $('#flagLanguage').attr("src","assets/images/language/"+flagName+".png");

    const countryNameLanguage = translator.translateForKey('universal_page.' + _get_region, _get_language)
    $('#countryNameLanguage').html(countryNameLanguage)
  }
}

let toggleBalance = false;
$('.toggleBalance').on("click", function (e) {
  e.preventDefault();

  if (!!toggleBalance) {
    $('#balanceCurrency').html('MYR 5888.20')
  } else {
    $('#balanceCurrency').html('MYR ********')
  }
  toggleBalance = !toggleBalance;
});

let timer_refresh_balance;
$('.refresh-balance').on("click", function (e) {
  e.preventDefault();
  const self = this;
  if (translator) {
    window.clearTimeout(timer_refresh_balance);
    $(self).addClass('spin');
    timer_refresh_balance = window.setTimeout(function(){
      $(self).removeClass('spin');
      addAlert(translator.translateForKey('SUCCESSFUL', _get_language), 'secondary');
    }, 3000); 
  }

});



var alertPlaceholder = document.getElementById('liveAlertPlaceholder')

function addAlert(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper);
  closeAlert(); // close after 5s
}

let timer_close_alert;
function closeAlert() {
  window.clearTimeout(timer_close_alert);
  timer_refresh_balance = window.setTimeout(function(){
    const _alertElm = $('.alert');
    if(_alertElm.length > 0) {
      var alert = bootstrap.Alert.getOrCreateInstance(_alertElm[0]);
      alert.close();
    }
  }, 5000); 
}


// datepicker
if (translator) {
  $(function() {
  
    $('.datefilterFrom, .datefilterTo, .datefilterIcon').daterangepicker({
        autoUpdateInput: false,
        opens: 'left',
        startDate: moment(),
        endDate: moment(),
        locale: {
            cancelLabel: 'Clear'
        }
    });
  
    $('.datefilterFrom, .datefilterTo, .datefilterIcon').on('apply.daterangepicker', function(ev, picker) {
        $('.datefilterFrom').val(picker.startDate.format('DD/MM/YYYY'));
        $('.datefilterTo').val(picker.endDate.format('DD/MM/YYYY'));
    });
  
    $('.datefilterFrom, .datefilterTo, .datefilterIcon').on('cancel.daterangepicker', function(ev, picker) {
        $('.datefilterFrom, .datefilterTo').val('');
    });
  
  });
}
// datepicker


// end inbox follow