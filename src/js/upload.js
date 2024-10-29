(() => {

	/**
	*	cache DOM
	*/
    const $saveButton = $('.btn-save'); // 儲存按鈕 安慰用 檔案成功上傳其實就儲存了
	const $imgModal = $('#img-modal'); // 檔案編輯模板
	const $imgModalBody= $('#img-modal-body');// 檔案編輯模板顯示檔案區域
	const $deleteFileBtn = $('.btn-delFile');// 檔案編輯模板刪除按鈕
	const $confirmedDeadlineText = $('.confirmed-deadline-text'); // 開放報名日期，緬甸跟大家不一樣
	let $uploadedFiles = [];// 已上傳檔案名稱陣列


	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

    $saveButton.on('click', _handleSave); // 儲存按鈕事件
	$deleteFileBtn.on('click',_handleDeleteFile);// 刪除按鈕事件
    $('body').on('change.upload', '.file-upload', _handleUpload);// 上傳按鈕事件
	$('body').on('click', '.img-thumbnail', _showUploadedFile);// 點擊檔案呼叫編輯模板事件

	async function _init() {
		const registerResponse = await student.getStudentRegistrationProgress();
		if(registerResponse.ok){
			const data = await registerResponse.json();
            if(data.has_qualify === false) {
                await swal({title:`請先完成資格檢視`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false});
                location.href = "./qualify.html";
            } else if(data.has_personal_info === false) {
                await swal({title:`請先填寫個人基本資料`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false});
                location.href = "./personalInfo.html";
            } else if(data.confirmed_at !== null){
				$('.input-group').hide();
				$deleteFileBtn.hide();
				$saveButton.hide();
			}

			if(data.school_country_name === '緬甸'){
				$confirmedDeadlineText.text(' 2024 年 11 月 29 日 ');
				$confirmedDeadlineText.parent().html($confirmedDeadlineText.parent().html()+`<br/><small>Please complete the following steps before November 29, 2024:</samll>`);
			} else if (data.school_country_name === '泰國' && data.school_type === '泰北未立案之華文中學') {
				$confirmedDeadlineText.text(' 2025 年 02 月 28 日 ');
				$confirmedDeadlineText.parent().html($confirmedDeadlineText.parent().html()+`<br/><small>Please complete the following steps before February 28, 2025:</samll>`);
			} else {
				$confirmedDeadlineText.text(' 2025 年 03 月 31 日 ');
				$confirmedDeadlineText.parent().html($confirmedDeadlineText.parent().html()+`<br/><small>Please complete the following steps before March 31, 2025:</samll>`);
			}
		} else {
			const data = await response.json();
			await swal({
				title: `ERROR！`,
				html:`${data.message[0]}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}
		const response = await student.getStudentUploadedAdmissionBrochureRequirmentFiles();
		if(response.ok){
			const data = await response.json();
			for (const [type] of Object.entries(data)) {
				// 先取得各類型的以上傳檔案名稱陣列
				$uploadedFiles = data[type];
				// 有檔案才渲染
				if($uploadedFiles.length > 0){
					_renderUploadedArea(type);
				}
			}
		} else {
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `ERROR！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			location.href = "./result.html";
		}
		await loading.complete();
	}

	// 儲存事件
    async function _handleSave(){
        await loading.start();
        await swal({title: `儲存成功`, html:`<a class="font-weight-bold text-danger">請於報名期限內完成線上填報與紙本繳件</a>`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
        await loading.complete();
        location.href = './result.html';
    }

	// 上傳事件
    async function _handleUpload(){
		// 先取得要上傳的檔案類型
        const type = $(this).data('type');
		// 取得學生欲上傳的檔案
		const fileList = this.files;

		// 沒有上傳檔案 直接return
		if(fileList.length <= 0){
			return;
		}

		// 檢查檔案大小 不超過4MB 在放進senData中
		let sendData = new FormData();
		for (let file of fileList ) {
			//有不可接受的副檔名存在
			let res = checkFile(file);
			if (!res) {
				await $(this).val('');
				return;
			}
			res = student.sizeConversion(file.size,4);
			if (res) {
				await swal({
					title: `上傳失敗！`,
					html:`${file.name}檔案過大，檔案大小不能超過4MB。`,
					type:"error",
					confirmButtonText: '確定',
					allowOutsideClick: false
				});
				await $(this).val('');
				return;
			}
			sendData.append('files[]', file);
		}
		await $(this).val('');
		await loading.start();
		// 將檔案傳送到後端
		const response = await student.uploadAdmissionBrochureRequirmentFiles(sendData, type);
		if(response.ok){
			await swal({
				title: `上傳成功！`,
				type:"success",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			// 後端會回傳上傳後該類型的已上傳檔案名稱陣列
			const data = await response.json();
			$uploadedFiles = data;
			// 重新渲染已上傳檔案區域
			_renderUploadedArea(type);
		} else {
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `上傳失敗！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		await loading.complete();
		return 0;
    }

	// 渲染已上傳檔案區域事件
	function _renderUploadedArea(type){
		let uploadedAreaHtml = '';
		const $uploadedFileArea = document.getElementById(`${type}-uploaded-files`)
        $uploadedFiles.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${env.baseUrl}/young-associate/admission-paper/${type}/${file}"
                        data-toggle="modal"
                        data-filename="${file}"
						data-target=".img-modal"
						data-type="${type}"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/young-associate/admission-paper/${type}/${file}"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${env.baseUrl}/young-associate/admission-paper/${type}/${file}"
						data-filename="${file}"
						data-type="${type}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        })
        $uploadedFileArea.innerHTML = uploadedAreaHtml;
	}

	// 顯示檔案 modal
	function _showUploadedFile() {
        // 取得點選的檔案名稱及類別
		const type = $(this).data('type');
		const fileName = $(this).data('filename');
		const fileType = $(this).data('filetype');

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖放圖，非圖放 icon
		if (fileType === 'img') {
			$imgModalBody.html(`
				<img
					src="${this.src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			$imgModalBody.html(`
				<div style="margin: 0 auto">
					<embed src="${this.dataset.filelink}" width="550" height="800" type="application/pdf">
				</div>
			`);
		}
        // 刪除檔案按鈕紀錄點選的檔案名稱及類別
		$deleteFileBtn.attr({
			'type': type,
			'filetype': fileType,
			'filename': fileName,
		});
	}

	// 確認是否刪除上傳檔案
    function _handleDeleteFile(){
        const fileName = $deleteFileBtn.attr('filename');
		const type = $deleteFileBtn.attr('type');
        swal({
            title: '確定要刪除已上傳的檔案？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			buttonsStyling: true,
			reverseButtons: true
        }).then(()=>{
            _deleteFile(type, fileName);
        }).catch(()=>{
            return 0;
        });
    }

	async function _deleteFile(type, fileName){
		await loading.start();

		const response = await student.deleteStudentUploadedAdmissionBrochureRequirmentFiles(type, fileName);

		if(response.ok){
			await swal({
				title: `刪除成功！`,
				type:"success",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			const data = await response.json();
			$uploadedFiles = data;
			await $imgModal.modal('hide');
			_renderUploadedArea(type);
		} else {
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `刪除失敗！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		await loading.complete();
	}

	// 副檔名與檔案型態對應（回傳值須符合 font-awesome 規範）
	function _getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
	}

	//檢查檔案類型
    function checkFile(selectfile){
        let extension = [".jpg", ".png", ".pdf",".jpeg"]; //可接受的附檔名
        let fileExtension = selectfile.name; //fakepath
        //看副檔名是否在可接受名單
        fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.')).toLowerCase();  // 副檔名通通轉小寫
        if (extension.indexOf(fileExtension) < 0) {
			swal({
				title: `上傳失敗`,
				html:`${fileExtension} 非可接受的檔案類型副檔名。`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
            selectfile.value = null;
            return false;
        } else {
            return true;
        }
    }

})();
