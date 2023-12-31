document.addEventListener("DOMContentLoaded", function () {
    const colorInput = document.getElementById("color-input");
    const colorCodeInput = document.getElementById("color-code-input");
    const addColorButton = document.getElementById("add-color");
    const palette = document.getElementById("palette");
    const colorFormat = document.getElementById("color-format");
    

    const updatedDateSpan = document.getElementById("updated-date");
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
    const formattedDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    updatedDateSpan.textContent = formattedDate;


    function getContrastColor(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "#000000" : "#ffffff";
    }

    function addColor() {
    const colorValuePicker = colorInput.value;
    const colorValueText = colorCodeInput.value;

    if (colorValuePicker || colorValueText) {
        let colorValue = colorValuePicker;
        
        // Check if a color code is entered manually and convert it to hex
        if (colorValueText) {
            colorValue = formatColor(colorValueText, "hex");
        }

        const colorBox = document.createElement("div");
        colorBox.className = "color-box";
        colorBox.style.backgroundColor = colorValue;

        const textColor = getContrastColor(colorValue);
        colorBox.style.color = textColor;

        const selectedFormat = colorFormat.value;
        const formattedColorValue = formatColor(colorValue, selectedFormat);
        colorBox.innerText = formattedColorValue;

        colorBox.addEventListener("click", function () {
            copyToClipboard(formattedColorValue);
        });

        palette.appendChild(colorBox);

        colorInput.value = "";
        colorCodeInput.value = "";
    }
}


    addColorButton.addEventListener("click", addColor);
    colorCodeInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addColor();
        }
    });

    function formatColor(hexColor, format) {
        switch (format) {
            case "hex":
                return hexColor;
            case "rgb":
                return hexToRgb(hexColor);
            case "hsl":
                return hexToHsl(hexColor);
            default:
                return hexColor;
        }
    }

    function hexToRgb(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        return `RGB(${r}, ${g}, ${b})`;
    }

    function hexToHsl(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16) / 255;
        const g = parseInt(hexColor.slice(3, 5), 16) / 255;
        const b = parseInt(hexColor.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `HSL(${h}, ${s}%, ${l}%)`;
    }

    function copyToClipboard(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        const popupContainer = document.createElement("div");
        popupContainer.className = "pop-up";
        const popupMessage = document.createElement("div");
        popupMessage.className = "pop-up-message";
        popupMessage.innerText = "Copied!";
        popupContainer.appendChild(popupMessage);
        document.body.appendChild(popupContainer);

        popupMessage.style.top = "50%";
        popupMessage.style.left = "50%";
        popupMessage.style.transform = "translate(-50%, -50%)";

        setTimeout(function () {
            document.body.removeChild(popupContainer);
        }, 1000);
    }

    let lastScrollTop = 0;
    const footer = document.querySelector("footer");
    window.addEventListener("scroll", function () {
        const scrollTop = window.scrollY;
        if (scrollTop > lastScrollTop) {
            footer.classList.add("footer-show");
        } else {
            if (scrollTop > 0) {
                footer.classList.remove("footer-show");
            }
        }
        lastScrollTop = scrollTop;
    });
});
