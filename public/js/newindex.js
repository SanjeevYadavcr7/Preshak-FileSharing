var mode = "light";
const maxAllowedSize = 100* 1024 * 1024;  // 100MB 
const host = "https://preshak-filesharingapp.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

// for drop zone area
const browseBtn = document.querySelector('.browseBtn');
const fileInput = document.querySelector('#fileInput');
const dropZone = document.querySelector('.drop-zone');
const imgZone = document.querySelector('.main-upload-inner-img-inner');
const containerBlock = document.querySelector('.container-block');
// for notification
const toast = document.querySelector('.toast');  

// for managing progress bar
const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const dropDiv = document.querySelector("#droptitle");

const sharingContainer = document.querySelector(".sharing-container"); 
const emailContainer = document.querySelector(".email-container"); 
const fileURL = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");
const emailForm = document.querySelector("#emailForm");

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    darkmode = localStorage.getItem("darkMode");
    if(darkmode !== 'enabled')
    {
        if(!dropZone.classList.contains('dragged'))
            dropZone.classList.add('dragged');
        
    }
    else
    {
        if(!dropZone.classList.contains('draggedDark'))
            dropZone.classList.add('draggedDark');
    }
    if(!imgZone.classList.contains('suspensions')){
        imgZone.classList.add('suspensions');
    }
});

dropZone.addEventListener('dragleave', () => {
    darkmode = localStorage.getItem("darkMode");
    if(darkmode !== 'enabled')
        dropZone.classList.remove('dragged');
    else
        dropZone.classList.remove('draggedDark');

    imgZone.classList.remove('suspensions');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log("File length= "+files.length);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {uploadFile();});

// adding file choosing option on clicking browse span 
browseBtn.addEventListener('click', (e) => {
    fileInput.click();
});

// click to copy feature
copyBtn.addEventListener("click",() => {
    fileURL.select();
    document.execCommand("copy");
    showToast("Link Copied!");
})


const uploadFile = () => {
    if(fileInput.files.length > 1){
        fileInput.value="";
        showToast("You can upload only one file !");
        darkmode = localStorage.getItem("darkMode");
        if(darkmode !== 'enabled')dropZone.classList.remove('dragged');
        else dropZone.classList.remove('draggedDark');
        imgZone.classList.remove('suspensions');
        return;
    }

    const file = fileInput.files[0];
    if(file>maxAllowedSize){
        fileInput.value = "";
        showToast("File exceeded 100MB limit !");
        return;
    }
    progressContainer.style.display = "block";
    dropDiv.style.display = "none";

    const formData = new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){  // checking if file is uploaded or not
            console.log(xhr.response);
            setTimeout(() => {
                containerBlock.style.display = "none";
                sharingContainer.style.display = "block";
                emailContainer.style.display = "block";
            },1000);
            showLink(JSON.parse(xhr.response));
        }
    };
    
    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
            fileInput.value = "";
            showToast(`Error in upload: ${xhr.statusText}`)
        }
    
    xhr.open("POST",uploadURL);   // making POST request on upload url to formData
    xhr.send(formData);
};

// function to monitor update process progress 
const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);   // calculating loaded %
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`
}

const showLink = ({file: url}) => {
    fileInput.value = "";
    emailForm[2].removeAttribute("disabled");
    fileURL.value = url;
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = fileURL.value;
    
    const formData = {
        uuid: url.split("/").splice(-1,1)[0],   // getting uuid from generated dowload link
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    };

    // console.table(formData);
    emailForm[2].setAttribute("disabled", "true");
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(({success}) => {
         if(success){
            setTimeout(() => {
            window.location.href = 'https://preshak-filesharingapp.herokuapp.com/';
            },2700);
            showToast("Email Sent!");
         }
    })
});

let toastTimer;
const showToast = (msg) => {
    // toast.display.style = "block";
    toast.innerText = msg;
    toast.style.transform = "translate(-5vw, -90vh)";
    clearTimeout(toastTimer);
    toastTimer =  setTimeout(() => {
        toast.style.transform = "translate(20vw, -90vh)";
    }, 2000);
};

let darkmode = localStorage.getItem("darkMode");

// selecting classes for dark mode 
const aDark = document.querySelector('.dark-a');
const imgDark = document.querySelector('.dark-img');
const logoDark = document.querySelector('.dark-logo');
const bodyDark = document.querySelector('.body-container');
const mainDark = document.querySelector('.main-container');
const img1Dark = document.querySelector('.img1');
const img2Dark = document.querySelector('.img2');
const img3Dark = document.querySelector('.img3');
const img4Dark = document.querySelector('.img4');
const mainUploadDark = document.querySelector('.main-upload');
const bannerDark = document.querySelector('.banner');
const muiDark = document.querySelector('.main-upload-inner');
const browseBtnDark = document.querySelector('.browseBtn');
const imgZoneDark = document.querySelector('.main-upload-inner-img');
const progessCDark  = document.querySelector('.progress-container');
const progessBarDark  = document.querySelector('.progress-bar');
const bgProgressDark = document.querySelector('.bg-progress');
const bannerBtnDark = document.querySelector('.banner-btn');
const mainLinkBoxDark  = document.querySelector('.main-link-box');
const pLinkDark  = document.querySelector('.main-link-p');
const formDark  = document.querySelector('.main-form');
const linkDark  = document.querySelector('.main-link');
const pFormDark  = document.querySelector('.main-form-p');
const mainFormDark  = document.querySelector('.main-form-box');
const mLinkBoxLinkDark = document.querySelector('.main-link-box-link');
const sender = document.querySelector('#sender');
const receiver = document.querySelector('#receiver');
const inputDark = document.querySelectorAll('.input-edit');

const enableDarkMode = () => {
    bodyDark.style.background = "#161625";
    mainDark.style.background = "linear-gradient(to bottom, #30303C, #202032)";
    mainDark.style.border = "1px solid #3A3A45";
    aDark.style.border = "2px solid #3A3A45";
    imgDark.src = "/img/light.png";
    logoDark.src = "/img/logo.png";
    img1Dark.src = "/img/youtube_download2.png";
    img2Dark.src = "/img/cloud_download2.png";
    img3Dark.src = "/img/file_download2.png";
    img4Dark.src = "/img/select2.png";
    mainUploadDark.style.boxShadow = "0px 20px 20px -10px rgba(0,0,0,0.4)";
    mainUploadDark.style.background = "#1E1E30";
    mainUploadDark.style.border = "1px solid transparent";
    bannerDark.style.background = "#202032";
    bannerDark.style.color = "#FFF";
    bannerDark.style.border = "1px solid #3C3C4B";
    muiDark.style.border = "1px dashed #9898D0";
    browseBtnDark.style.color = "#50A1FF";
    imgZoneDark.style.background = "rgba(80,213,255,0.09)";
    progessCDark.style.background = "#1E1E30";
    // progessBarDark.style.background = "#4C75F2";
    progessCDark.style.border = "2px solid #3C3C4B";
    bgProgressDark.style.background = "#1E1E30";
    bgProgressDark.style.boxShadow = "0 15px 21px -10px rgba(0,0,0,0.4)";
    toast.style.boxShadow = "0 7px 21px -12px #4C75F2";
    toast.style.background = "#4C75F2";
    toast.style.border = "1px solid #4C75F2";
    bannerBtnDark.style.background = "#4C75F2";
    bannerBtnDark.style.border = "1px solid #4C75F2";
    mainLinkBoxDark.style.background = "#1E1E30";
    mainLinkBoxDark.style.boxShadow = "0 20px 11px -10px #161625";
    pLinkDark.style.color = "#777";
    pFormDark.style.color = "#777";
    mainFormDark.style.background = "#1E1E30";
    mainFormDark.style.boxShadow = "0 20px 11px -10px #161625";
    // formDark.style.borderLeft = "1px solid #555";
    mLinkBoxLinkDark.style.border = "1px dashed #555";
    fileURL.style.background = "transparent";
    fileURL.style.color = "#777";
    sender.style.background = "#202032";
    sender.style.border = "1px solid #555";
    receiver.style.background = "#202032";
    receiver.style.border = "1px solid #555";
    sender.style.color = "#3BADFF";
    sender.style.fontWeight = "400"; 
    sender.style.letterSpacing = "0.1em";
    receiver.style.color = "#F24C4C";
    receiver.style.fontWeight = "400"; 
    receiver.style.letterSpacing = "0.1em";

    localStorage.setItem('darkMode','enabled');
}
const disableDarkMode = () => {
    bodyDark.style.background = "#FFF";
    mainDark.style.background = "linear-gradient(to bottom, #2555FF, #2589FF)";
    mainDark.style.border = "1px solid #666";
    aDark.style.border = "2px solid #3A3A45";
    imgDark.src = "/img/bolt.png";
    logoDark.src = "/img/preshak_logo.png";
    img1Dark.src = "/img/youtube_download.png";
    img2Dark.src = "/img/cloud_download.png";
    img3Dark.src = "/img/file_download.png";
    img4Dark.src = "/img/select.png";
    mainUploadDark.style.boxShadow = " 0 20px 20px -10px #abcff8";
    mainUploadDark.style.background = "#FFF";
    mainUploadDark.style.border = "1px solid #FFF";
    bannerDark.style.background = "rgba(37,85,255,0.06)";
    bannerDark.style.color = "#555";
    bannerDark.style.border = "1px solid #50A1FF";
    muiDark.style.border = "1px dashed #50A1FF";
    browseBtnDark.style.color = "#50A1FF";
    imgZoneDark.style.background = "#FFF";
    progessCDark.style.background = "#FFF";
    // progessBarDark.style.background = "#4C75F2";
    progessCDark.style.border = "2px solid #edf5fe";
    bgProgressDark.style.background = "#FFF";
    bgProgressDark.style.boxShadow = "0 15px 21px -10px #abbdff";
    toast.style.boxShadow = "0 15px 21px -10px #567bff";
    toast.style.background = "#2E5CFF";
    toast.style.border = "1px solid #2E5CFF";
    bannerBtnDark.style.background = "#2555FF";
    bannerBtnDark.style.border = "1px solid #2555FF";
    mainLinkBoxDark.style.background = "#FFF";
    mainLinkBoxDark.style.boxShadow = "0 20px 11px -10px rgba(0,0,0,0.5)";
    pLinkDark.style.color = "#fff";
    pFormDark.style.color = "#fff";
    mainFormDark.style.background = "#fff";
    mainFormDark.style.boxShadow = "0 20px 11px -10px rgba(0,0,0,0.5)";
    // formDark.style.borderLeft = "1px solid #fff";
    mLinkBoxLinkDark.style.border = "1px dashed #2589FF";
    fileURL.style.background = "#fff";
    fileURL.style.color = "#777";
    sender.style.background = "#fff";
    sender.style.border = "1px solid #2589FF";
    receiver.style.background = "#fff";
    receiver.style.border = "1px solid #2589FF";
    sender.style.color = "#444";
    sender.style.fontWeight = "400"; 
    sender.style.letterSpacing = "0.1em";
    receiver.style.color = "#444";
    receiver.style.fontWeight = "400"; 
    receiver.style.letterSpacing = "0.1em";
    localStorage.setItem('darkMode',null);
}

if(darkmode === 'enabled'){
    enableDarkMode();
}

aDark.addEventListener("click",() => {
    darkmode = localStorage.getItem("darkMode");
    if(darkmode !== "enabled"){
        enableDarkMode();
    }
    else{
        disableDarkMode();
    }
})


logoDark.addEventListener("click",() => {
    darkmode = localStorage.getItem("darkMode");
    if(darkmode !== "enabled"){
        enableDarkMode();
    }
    else{
        disableDarkMode();
    }   
})

