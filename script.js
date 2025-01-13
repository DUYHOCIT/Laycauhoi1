const TELEGRAM_TOKEN = '7656286886:AAGZmLzJQTbXAj5_BCHs1EZMrna9B-ZIp-E'; // Thay thế với token thực tế
const TELEGRAM_CHAT_ID = '6623256952'; // Thay thế với chat ID thực tế

document.getElementById('addJsonButton').addEventListener('click', function () {
    const jsonInputs = document.getElementById('jsonInputs');
    const newJsonGroup = document.createElement('div');
    newJsonGroup.className = 'json-group';
    newJsonGroup.innerHTML = `
        <textarea class="jsonInput" placeholder="Dán vào đây ní ơi..."></textarea>
        <button class="deleteButton">&times;</button>
    `;
    jsonInputs.appendChild(newJsonGroup);

    const deleteButton = newJsonGroup.querySelector('.deleteButton');
    deleteButton.addEventListener('click', function () {
        jsonInputs.removeChild(newJsonGroup);
    });
});

document.getElementById('processButton').addEventListener('click', function () {
    const jsonInputs = document.querySelectorAll('.jsonInput');
    const uniqueQuestions = new Map();
    let hasData = false; // Biến để kiểm tra có dữ liệu hay không

    jsonInputs.forEach(input => {
        const jsonInput = input.value;

        if (jsonInput.trim()) {
            hasData = true; // Đánh dấu là có dữ liệu
            try {
                const data = JSON.parse(jsonInput);

                data.data.forEach(record => {
                    record.test.forEach(test => {
                        const questionId = test.id;

                        if (!uniqueQuestions.has(questionId)) {
                            uniqueQuestions.set(questionId, {
                                questionHtml: test.question_direction.replace(/<[^>]*>/g, ''),
                                answerOptions: test.answer_option.map(option => option.value.replace(/<[^>]*>/g, ''))
                            });
                        }
                    });
                });
            } catch (error) {
                alert('Một trong các dữ liệu JSON không hợp lệ. Vui lòng kiểm tra lại.');
                throw error;
            }
        }
    });

    if (!hasData) {
        alert('Vui lòng nhập dữ liệu JSON trước khi xử lý.');
        return; // Dừng lại nếu không có dữ liệu
    }

    let htmlContent = '<html><head><title>Kết quả xử lý JSON</title></head><body>';
    htmlContent += '<h1>Câu hỏi</h1>\n';

    uniqueQuestions.forEach((value, questionId) => {
        const questionHtml = value.questionHtml;
        const answerOptions = value.answerOptions;

        htmlContent += `<h2>Câu ${questionId}. ${questionHtml}</h2>`;
        answerOptions.forEach((option, index) => {
            const letter = String.fromCharCode(65 + index);
            htmlContent += `<p>${letter}. ${option}</p>\n`;
        });
    });

    htmlContent += '</body></html>';

    const resultTab = window.open('', '_blank');
    resultTab.document.write(htmlContent);
    resultTab.document.close();

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const file = new File([blob], 'ketqua.html', { type: 'text/html' });

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', file);

    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
        
        } else {
         
        }
    }).catch(error => {
       
    });
});

document.getElementById('videoGuideButton').addEventListener('click', function () {
    window.open('https://drive.google.com/file/d/1DgBA0R6jlCU7KjSdF6mei_LKs5bzHf9D/view?usp=sharing', '_blank');
});