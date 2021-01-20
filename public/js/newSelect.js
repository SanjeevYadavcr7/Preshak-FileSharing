const tabItems = document.querySelectorAll('.tab-content');
const tabContentItems = document.querySelectorAll('.tab-content-item');

function selectItem(e){
    removeShow();
    removeImage();

    this.classList.add('active');
    const tabContentItem = document.querySelector(`#${this.id}-content`);
    tabContentItem.classList.add('show');
}

function removeShow(){
	tabContentItems.forEach(item => item.classList.remove('show'));
}

function removeImage(){
    tabItems.forEach(item => item.classList.remove('active'));
}

tabItems.forEach(item => item.addEventListener('click', selectItem));
