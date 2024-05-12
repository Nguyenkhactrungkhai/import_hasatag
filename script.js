document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const hashtagsInput = document.getElementById('hashtagsInput');
    const removeHashtagsBtn = document.getElementById('removeHashtags');
    const addHashtagsBtn = document.getElementById('addHashtags');
    const copyBtn = document.getElementById('copyToClipboard');
    const downloadBtn = document.getElementById('download');
    const contentPreview = document.getElementById('contentPreview');
    const lineCountDisplay = document.getElementById('lineCount');

    let fileContent = '';
    let editedContent = '';

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fileContent = e.target.result;
                removeHashtagsBtn.disabled = false;
                hashtagsInput.disabled = false;
                contentPreview.textContent = fileContent;
                updateLineCount(fileContent);
            };
            reader.readAsText(file);
        }
    });

    hashtagsInput.addEventListener('input', function() {
        addHashtagsBtn.disabled = !this.value.trim();
    });

    removeHashtagsBtn.addEventListener('click', function() {
        editedContent = fileContent.replace(/#\S+/g, '').replace(/created by.*$/gm, '').trim();
        contentPreview.textContent = editedContent;
        updateLineCount(editedContent);
        downloadBtn.style.display = 'block';
        copyBtn.disabled = false;
    });

    addHashtagsBtn.addEventListener('click', function() {
        const hashtags = hashtagsInput.value.trim();
        if (hashtags) {
            editedContent = editedContent.split('\n').map(line => line.trim() + ' ' + hashtags).join('\n');
            contentPreview.textContent = editedContent;
            updateLineCount(editedContent);
        } else {
            alert('Vui lòng nhập hashtags!');
        }
    });

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(editedContent)
            .then(() => alert('Nội dung đã được sao chép vào clipboard!'))
            .catch(err => alert('Có lỗi xảy ra khi sao chép: ' + err));
    });

    downloadBtn.addEventListener('click', function() {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editedContent));
        element.setAttribute('download', 'edited_file.txt');
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });

    function updateLineCount(text) {
        const lineCount = text.split('\n').length;
        lineCountDisplay.textContent = `Số dòng: ${lineCount}`;
    }
});
