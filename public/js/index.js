// for managing upload container
const dropZone = document.querySelector('.drop-zone');
const browseBtn = document.querySelector('.browseBtn');
const fileInput = document.querySelector('#fileInput');

// for managing progress container
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");
const percentDiv = document.querySelector("#percent");
const progressContainer = document.querySelector(".progress-container");

const sharinngContainer = document.querySelector(".sharing-container"); 
const fileURL = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");

const emailForm = document.querySelector("#emailForm");
const toast = document.querySelector('.toast');

const host = "https://preshak.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const maxAllowedSize = 100* 1024 * 1024;  // 100MB

dropZone.addEventListener('dragover', (e)=>{
    e.preventDefault();
    if(!dropZone.classList.contains('dragged')){
        dropZone.classList.add('dragged');
    }
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
})

// removing dragged class once we drop the file
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;  // no. of files selected
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
})

fileInput.addEventListener("change", () => {
    uploadFile();
})

// adding file choosing option on clicking browse span
browseBtn.addEventListener('click', (e)=>{
    fileInput.click();
});

copyBtn.addEventListener("click",() => {
    fileURL.select();
    document.execCommand("copy");
    showToast("Link Copied!");
})

const uploadFile = () => {

    if(fileInput.files.length > 1){
        fileInput.value = "";
        showToast("Only upload 1 file!");
        return;
    }
    
    const file = fileInput.files[0];
    if(file>maxAllowedSize){
        fileInput.value = "";
        showToast("File exceeded 100MB limit!");
        return;
    }

    progressContainer.style.display = "block";

    const formData = new FormData()   // making a form object to store selected files in it
    formData.append("myfile",file)

    const xhr = new XMLHttpRequest();
    // onreadystate change when file is uploaded
    xhr.onreadystatechange = () =>{   
        // console.log(xhr.readyState);
        if(xhr.readyState === XMLHttpRequest.DONE){  // checking if file is uploaded or not
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;    // calling function to show progress of upload process

    xhr.upload.onerror = () => {
        fileInput.value = "";
        showToast(`Error in upload: ${xhr.statusText}`)
    }

    xhr.open("POST",uploadURL);   // making POST request on upload url to formData
    xhr.send(formData)              
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
    progressContainer.style.display = "none";
    sharinngContainer.style.display = "block";
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
            sharinngContainer.style.display = "none";
            showToast("Email Sent!");
         }
    })
});

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0px)";
    clearTimeout(toastTimer);
    toastTimer =  setTimeout(() => {
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000);
};