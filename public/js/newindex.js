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
    if(!dropZone.classList.contains('dragged')){
        dropZone.classList.add('dragged');
    }
    if(!imgZone.classList.contains('suspensions')){
        imgZone.classList.add('suspensions');
    }
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
    imgZone.classList.remove('suspensions');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    // dropZone.classList.remove('dragged');
    // imgZone.classList.remove('suspensions');
    const files = e.dataTransfer.files;
    console.log("File length= "+files.length);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {
    uploadFile();
});

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
        dropZone.classList.remove('dragged');
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
    // progressContainer.style.display = "none";
    // sharingContainer.style.display = "block";
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
            // sharingContainer.style.display = "none";
            // dropZone.classList.remove('dragged');
            // imgZone.classList.remove('suspensions');
            // containerBlock.style.display = "block";
            // progressContainer.style.display = "none";
            // dropDiv.style.display = "block";
            // fileInput.value = "";
            setTimeout(() => {
            window.location.href = 'https://preshak-filesharingapp.herokuapp.com/';
            },2700);
            showToast("Email Sent!");
         }
    })
});

let toastTimer;
const showToast = (msg) => {
    toast.display.style = "block";
    toast.innerText = msg;
    toast.style.transform = "translate(-5vw, -90vh)";
    clearTimeout(toastTimer);
    toastTimer =  setTimeout(() => {
        toast.style.transform = "translate(20vw, -90vh)";
    }, 2000);
};