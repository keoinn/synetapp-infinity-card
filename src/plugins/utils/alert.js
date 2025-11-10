import Swal from 'sweetalert2'

// DOCME: https://stackoverflow.com/questions/33178843/es6-export-default-with-multiple-functions-referring-to-each-other

export function handleAlert({
  auction = 'error',
  title = null,
  text = null,
  showConfirmButton = false,
  timer = 3000,
  position = 'center',
  background = null,
  toast = true
}) {

  /**
    handleAlert({
      auction: 'warning',
      text: 'Do you want to continue',
    })
  */

  let icon = null
  let title_str = null
  let text_str = null
  let position_conf = null

  if(auction === 'error') {
    icon = 'error'
    title_str = '錯誤'
  } else if(auction === 'success') {
    icon = 'success'
    title_str = '成功'
  } else if(auction === 'warning') {
    icon = 'warning'
    title_str = '警告'
  }

  text_str = text

  if(title === null) {
    title_str = text_str
    text_str = null
  } else {
    title_str = title
  }

  position_conf = position
  if(toast === true) {
    position_conf = 'top-end'
    if(position === '!center') {
      position_conf = 'center'
    }
  }

  Swal.fire({
    icon: icon,
    toast: toast,
    position: position_conf,
    title: title_str,
    text: text_str,
    showConfirmButton: showConfirmButton,
    timer: timer,
    background: background // transparent
  })
}

export function handleBackendMsg (status, msg, dispaly_true = false) {
  if(status === false) {
    handleAlert({
      auction: 'error',
      text: msg,
    })
  }
  if(dispaly_true === true && status === true) {
    handleAlert({
      auction: 'success',
      text: msg,
    })
  }
}

export async function handleConfirm({
  title = '確認',
  text = '確定要執行此操作嗎？',
  confirmButtonText = '確定',
  cancelButtonText = '取消',
  icon = 'warning'
}) {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    confirmButtonColor: '#1976D2',
    cancelButtonColor: '#757575',
    reverseButtons: true,
    customClass: {
      confirmButton: 'swal2-confirm-white-text',
      cancelButton: 'swal2-cancel-white-text'
    },
    didOpen: () => {
      // 確保按鈕文字為白色
      const confirmBtn = document.querySelector('.swal2-confirm-white-text')
      const cancelBtn = document.querySelector('.swal2-cancel-white-text')
      if (confirmBtn) {
        confirmBtn.style.color = '#ffffff'
      }
      if (cancelBtn) {
        cancelBtn.style.color = '#ffffff'
      }
    }
  })
  
  return result.isConfirmed
}

export default { handleAlert, handleBackendMsg, handleConfirm }


