document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const textInput = document.getElementById('text-input');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValueSpan = document.getElementById('size-value');
    const colorDarkInput = document.getElementById('color-dark');
    const colorLightInput = document.getElementById('color-light');
    const errorCorrectionSelect = document.getElementById('error-correction-level');
    const liveUpdateCheckbox = document.getElementById('live-update-checkbox');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('downloadBtn');

    let qrCodeInstance = null;

    // --- Debounce function for performance ---
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // --- Core QR Code Rendering Function ---
    const renderQRCode = () => {
        const options = {
            text: textInput.value.trim(),
            width: parseInt(sizeSlider.value, 10),
            height: parseInt(sizeSlider.value, 10),
            colorDark: colorDarkInput.value,
            colorLight: colorLightInput.value,
            correctLevel: QRCode.CorrectLevel[errorCorrectionSelect.value]
        };

        if (!options.text) {
            qrCodeContainer.innerHTML = '<p>El QR aparecerá aquí.</p>';
            downloadBtn.style.display = 'none';
            return;
        }

        // Clear previous QR code
        qrCodeContainer.innerHTML = '';

        // Create new QR code
        try {
            qrCodeInstance = new QRCode(qrCodeContainer, options);
        } catch (error) {
            console.error('Error generating QR Code:', error);
            qrCodeContainer.innerHTML = '<p>Error al generar el QR.</p>';
            return;
        }

        // Update download link (with a small delay to ensure canvas is ready)
        setTimeout(() => {
            const canvas = qrCodeContainer.querySelector('canvas');
            if (canvas) {
                downloadBtn.href = canvas.toDataURL('image/png');
                downloadBtn.style.display = 'block';
            } else {
                const img = qrCodeContainer.querySelector('img');
                if (img) {
                    downloadBtn.href = img.src;
                    downloadBtn.style.display = 'block';
                }
            }
        }, 50);
    };

    // --- Event Listeners ---
    const debouncedRender = debounce(renderQRCode, 250);

    const setupEventListeners = () => {
        textInput.addEventListener('input', () => {
            if (liveUpdateCheckbox.checked) {
                debouncedRender();
            }
        });

        sizeSlider.addEventListener('input', () => {
            sizeValueSpan.textContent = sizeSlider.value;
            if (liveUpdateCheckbox.checked) {
                renderQRCode();
            }
        });

        [colorDarkInput, colorLightInput, errorCorrectionSelect].forEach(element => {
            element.addEventListener('change', () => {
                if (liveUpdateCheckbox.checked) {
                    renderQRCode();
                }
            });
        });

        liveUpdateCheckbox.addEventListener('change', () => {
            generateBtn.classList.toggle('hidden', liveUpdateCheckbox.checked);
            if (liveUpdateCheckbox.checked) {
                renderQRCode(); // Render immediately when switching to live mode
            }
        });

        generateBtn.addEventListener('click', renderQRCode);
    };

    // --- Initialization ---
    const init = () => {
        setupEventListeners();
        sizeValueSpan.textContent = sizeSlider.value; // Set initial size value
        downloadBtn.style.display = 'none'; // Hide download button initially
        generateBtn.classList.toggle('hidden', liveUpdateCheckbox.checked);
        renderQRCode(); // Initial render with default values
    };

    init();
});