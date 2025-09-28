document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('downloadBtn');
    let qrCodeInstance = null;

    const generateQRCode = () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert('Por favor, introduce una URL.');
            urlInput.focus();
            return;
        }

        // Limpiar contenedor anterior
        qrCodeContainer.innerHTML = '';
        downloadBtn.classList.add('hidden');
        downloadBtn.href = '#';

        // Crear nueva instancia de QRCode
        qrCodeInstance = new QRCode(qrCodeContainer, {
            text: url,
            width: 180,
            height: 180,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Pequeña demora para asegurar que el QR se ha renderizado en el DOM
        setTimeout(() => {
            const canvas = qrCodeContainer.querySelector('canvas');
            if (canvas) {
                downloadBtn.href = canvas.toDataURL('image/png');
                downloadBtn.download = 'codigo-qr.png';
                downloadBtn.classList.remove('hidden');
            } else {
                 // Fallback para la imagen si la librería usa `img`
                const img = qrCodeContainer.querySelector('img');
                if(img) {
                    downloadBtn.href = img.src;
                    downloadBtn.download = 'codigo-qr.png';
                    downloadBtn.classList.remove('hidden');
                }
            }
        }, 100);
    };

    generateBtn.addEventListener('click', generateQRCode);

    urlInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
});
