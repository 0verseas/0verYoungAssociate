(() => {
    /**
	*	private variable
	*/

    /**
	*	cache DOM
	*/
	const $formOrder = $('#form-order');
	const $tBodyOrder = $('#tbody-order');

    /**
	*	bind event
	*/
    $('#btn-previewPersonalData').attr('href',env.baseUrl + '/young-associate/admission-paper/department-apply-form');

    /**
	*	init
	*/

	_init();

    async function _init() {
		$('.correction-form-link').attr("href",env.baseUrl+"/admission-data-correction-form/young-associate");
		try {
			const response = await student.getAdmissionSelectionOrder();
			if (!response[0].ok) { throw response[0]; }
			const resAdmission = await response[0].json();
			// 整理已選志願
			if(!resAdmission["student_young_associate_department_admission_selection_order"] || resAdmission["student_young_associate_department_admission_selection_order"].length < 1) {
				$formOrder.html(`<div class="col-12 text-center">
									<h3>- 沒有選擇志願 -</h3>
								</div>`);
			} else {
				let orderHtml = '';
				resAdmission["student_young_associate_department_admission_selection_order"].forEach((val, index) => {
					orderHtml += `
								<tr>
									<td>` + val.order + `</td>
									<td>` + val.department_data.card_code + `</td>
									<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
								</tr>
								`;
				});
				$tBodyOrder.html(orderHtml);
			}
		} catch (e) {
			if (e.status && e.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else if (e.status && (e.status === 403 || e.status === 503)) {
				// 是否有完成資格驗證在 navbar.js 已經有判斷。
				e.json && e.json().then((data) => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						if(window.history.length>1){
							window.history.back();
						} else {
							location.href = "./personalInfo.html";
						}
					});
				})
			} else {
				console.error(e);
				e.json && e.json().then((data) => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
		}
		loading.complete();
    }
})();