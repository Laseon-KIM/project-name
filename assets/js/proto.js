/* ==========================================================================
   iOS 상태바 렌더러
   --------------------------------------------------------------------------
   프로토타입 html 에 아래 한 줄만 넣으면 상태바가 그려집니다.

     <div class="status"></div>

   옵션 (필요할 때만):
     data-time="9:41"      시간 바꾸기 (기본 9:41)
     data-battery="80"     배터리 잔량 % (기본 100)
     data-dark             어두운 배경용 — 아이콘이 흰색이 됨
   ========================================================================== */

(function () {
  'use strict';

  /* 신호 세기 — 막대 4개 */
  var SIGNAL =
    '<svg class="status__ico" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">' +
      '<rect x="0"  y="8"   width="3" height="4"    rx="1" fill="currentColor"/>' +
      '<rect x="5"  y="5.8" width="3" height="6.2"  rx="1" fill="currentColor"/>' +
      '<rect x="10" y="3.2" width="3" height="8.8"  rx="1" fill="currentColor"/>' +
      '<rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="currentColor"/>' +
    '</svg>';

  /* 와이파이 — 부채꼴 2개 + 아래 점 */
  var WIFI =
    '<svg class="status__ico" width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">' +
      '<path d="M1 3.2a10.2 10.2 0 0 1 14 0" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M3.4 6.1a6.7 6.7 0 0 1 9.2 0" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M8 10.6 5.75 8.35a3.18 3.18 0 0 1 4.5 0L8 10.6z" fill="currentColor"/>' +
    '</svg>';

  /* 배터리 — 테두리는 흐리게, 잔량만 진하게 */
  function battery(percent) {
    var max = 20;                                   // 내부 최대 폭
    var w = Math.max(1.5, (max * percent) / 100);   // 0% 여도 흔적은 남게
    var low = percent <= 20;

    return '' +
      '<svg class="status__ico status__ico--batt" width="28" height="13" viewBox="0 0 28 13" aria-hidden="true">' +
        '<rect x="0.6" y="0.6" width="23.8" height="11.8" rx="3.8" ' +
              'stroke="currentColor" stroke-opacity="0.35" fill="none"/>' +
        '<path d="M25.9 4.4c1 0.4 1.6 1.2 1.6 2.1s-0.6 1.7-1.6 2.1V4.4z" ' +
              'fill="currentColor" fill-opacity="0.35"/>' +
        '<rect x="2.4" y="2.4" width="' + w.toFixed(1) + '" height="8.2" rx="2" ' +
              'fill="' + (low ? '#ff3b30' : 'currentColor') + '"/>' +
      '</svg>';
  }

  var bars = document.querySelectorAll('.status');

  Array.prototype.forEach.call(bars, function (el) {
    var time = el.dataset.time || '9:41';
    var level = el.dataset.battery === undefined ? 100 : Number(el.dataset.battery);

    if (el.dataset.dark !== undefined) el.classList.add('is-dark');

    el.innerHTML =
      '<span class="status__time">' + time + '</span>' +
      '<span class="status__icons">' + SIGNAL + WIFI + battery(level) + '</span>';
  });
})();
