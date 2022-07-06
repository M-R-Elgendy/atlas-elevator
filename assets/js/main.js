function setUserAgent(window, userAgent) {
    // Works on Firefox, Chrome, Opera and IE9+
    if (navigator.__defineGetter__) {
        navigator.__defineGetter__('userAgent', function () {
            return userAgent;
        });
    } else if (Object.defineProperty) {
        Object.defineProperty(navigator, 'userAgent', {
            get: function () {
                return userAgent;
            }
        });
    }
    // Works on Safari
    if (window.navigator.userAgent !== userAgent) {
        var userAgentProp = {
            get: function () {
                return userAgent;
            }
        };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}

// set user agent
setUserAgent(window, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");

let current_temp = 1;
$(".image-radio img").click(function () {
    let imgRadioName = ($(this).prev().attr('name'));
    if (imgRadioName == 'temp-1') {
        $('.temp-2').prop('checked', false);
        $('.temp-1').prop('checked', true);
        current_temp = 1;
    } else {
        $('.temp-1').prop('checked', false);
        $('.temp-2').prop('checked', true);
        current_temp = 2;
    }
});

const {
    degrees,
    PDFDocument,
    rgb,
    StandardFonts
} = PDFLib

async function createCert(heroName) {

    // const template = document.querySelector("#gender").value;
    let url = '';

    if (current_temp == '1') {
        url = 'assets/temps/temp-1.pdf'
    } else {
        url = 'assets/temps/temp-2.pdf'
    }
    console.log(url)
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

    const fontUrl = 'assets/fonts/ANDLSO.TTF'
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    pdfDoc.registerFontkit(fontkit)
    const customFont = await pdfDoc.embedFont(fontBytes)

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const {
        width,
        height
    } = firstPage.getSize()



    const textSize = 30;
    const textWidth = customFont.widthOfTextAtSize(heroName, textSize);
    if (current_temp == '2') {
        firstPage.drawText(heroName, {
            // cert 1
            x: ((width / 1.85 - textWidth / 2) - 25),
            y: 215,
            size: textSize,
            font: customFont,
            color: PDFLib.rgb(0.796078431372549, 0.32941176470588235, 0.35294117647058826)
        });
    } else {
        firstPage.drawText(heroName, {
            // cert 1
            x: ((width / 1.85 - textWidth / 2) - 25),
            y: 245,
            size: textSize,
            font: customFont,
            color: PDFLib.rgb(0.6549019607843137, 0.4235294117647059, 0.16470588235294117)
        });
    }

    const pdfBytes = await pdfDoc.save()

    download(pdfBytes, `تهنئة ${heroName}.pdf`, "application/pdf");

}

function handelForm() {
    const nameInput = document.querySelector("#hero_name");
    const heroName = nameInput.value;
    if (heroName != '') {
        createCert(heroName);
    } else {
        nameInput.classList.add("border", "border-danger", "text-danger");
        nameInput.setAttribute("placeholder", "الرجاء كتابة الاسم")
    }
}
