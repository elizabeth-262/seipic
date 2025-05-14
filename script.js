const video = document.getElementById('video');
const startButton = document.getElementById('start');
const downloadButton = document.getElementById('download');
const countdown = document.getElementById('countdown');
const imageStrip = document.getElementById('image-strip').getElementsByTagName('img');

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
});

async function captureImages() {
    for (let i = 0; i < 4; i++) {
        await startCountdown();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        imageStrip[i].src = canvas.toDataURL('image/png');
    }
}

function startCountdown() {
    return new Promise(resolve => {
        countdown.style.display = 'block';
        let count = 3;
        countdown.innerText = count;

        const interval = setInterval(() => {
            count--;
            countdown.innerText = count;

            if (count === 0) {
                clearInterval(interval);
                countdown.style.display = 'none';
                resolve();
            }
        }, 1000);
    });
}

function downloadImages() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const imageWidth = imageStrip[0].naturalWidth;
    const imageHeight = imageStrip[0].naturalHeight;

    // set canvas size for 4 images stacked vertically
    canvas.width = imageWidth;
    canvas.height = imageHeight * 4;

    for (let i = 0; i < 4; i++) {
        if (imageStrip[i].src) {
            context.save();

            context.translate(0, i * imageHeight); 

            context.lineWidth = 30;  // frame thickness
            context.strokeStyle = '#000';  // frame color
            context.strokeRect(0, 0, imageWidth, imageHeight);

            context.drawImage(imageStrip[i], 0, 0, imageWidth, imageHeight);
            context.restore();
        }
    }

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'my_4-cut_photostrip.png';
    a.click();
}

startButton.addEventListener('click', captureImages);
downloadButton.addEventListener('click', downloadImages);
