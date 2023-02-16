(() => {

	/**
	*	private variable
	*/

	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 僑先部 cardCode
	const _nupsList = ["1FFFF", "2FFFF", "3FFFF"];

	// 序號調整志願序之參數
	// let _prevWishIndex = -1;
	// let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/
	const $group1QuotaBtn = $('#btn-group1Quota');
	const $group2QuotaBtn = $('#btn-group2Quota');
	const $group3QuotaBtn = $('#btn-group3Quota');
	const $groupSubjects = $('#btn-groupSubjects');
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $manualSearchBtn = $('#btn-manualSearch'); // 手動搜尋按鈕
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const $paginationContainer = $('#pagination-container'); // 分頁區域
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // // 監聽「招生校系清單」關鍵字
	$manualSearchBtn.on('click', _generateOptionalWish);
	$saveBtn.on('click', _handleSave);

	async function _init() {
	}
})();
