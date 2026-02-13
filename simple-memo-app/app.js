document.addEventListener('DOMContentLoaded', () => {
    const memoInput = document.getElementById('memo-input');
    const addBtn = document.getElementById('add-btn');
    const memoList = document.getElementById('memo-list');
    const searchInput = document.getElementById('search-input');
    const themeToggle = document.getElementById('theme-toggle');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-input');
    const toastContainer = document.getElementById('toast-container');

    let memos = JSON.parse(localStorage.getItem('memos')) || [];
    let isEditing = false;
    let currentEditId = null;

    // --- Icons ---
    const icons = {
        sun: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
        moon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
        trash: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
        download: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
        pin: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>'
    };

    // --- Initialization ---
    initTheme();
    renderMemos();
    exportBtn.innerHTML = icons.download;
    importBtn.innerHTML = icons.upload;

    // --- Event Listeners ---
    addBtn.addEventListener('click', handleMemoAction);
    searchInput.addEventListener('input', (e) => filterMemos(e.target.value));
    themeToggle.addEventListener('click', toggleTheme);
    exportBtn.addEventListener('click', exportMemos);
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', importMemos);

    // Allow Ctrl+Enter to submit
    memoInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleMemoAction();
        }
    });

    // --- Core Functions ---

    function handleMemoAction() {
        const content = memoInput.value.trim();
        if (!content) {
            showToast('내용을 입력해주세요.');
            return;
        }

        if (isEditing) {
            updateMemo(content);
        } else {
            addMemo(content);
        }
    }

    function addMemo(content) {
        const newMemo = {
            id: Date.now(),
            content: content,
            date: new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            isPinned: false
        };

        memos.unshift(newMemo);
        saveMemos();
        renderMemos();
        resetInput();
        showToast('메모가 저장되었습니다.');
    }

    function updateMemo(content) {
        memos = memos.map(memo => {
            if (memo.id === currentEditId) {
                return { ...memo, content: content, date: memo.date.split(' (')[0] + ' (수정됨)' };
            }
            return memo;
        });

        saveMemos();
        renderMemos();
        resetInput();
        showToast('메모가 수정되었습니다.');
    }

    function deleteMemo(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            memos = memos.filter(memo => memo.id !== id);
            saveMemos();
            renderMemos();

            if (isEditing && currentEditId === id) {
                resetInput();
            }

            showToast('메모가 삭제되었습니다.');
        }
    }

    function togglePin(id) {
        memos = memos.map(memo => {
            if (memo.id === id) {
                return { ...memo, isPinned: !memo.isPinned };
            }
            return memo;
        });

        saveMemos();
        renderMemos();

        const isPinned = memos.find(m => m.id === id).isPinned;
        showToast(isPinned ? '메모가 고정되었습니다.' : '메모 고정이 해제되었습니다.');
    }

    function startEdit(id) {
        const memo = memos.find(m => m.id === id);
        if (!memo) return;

        isEditing = true;
        currentEditId = id;
        memoInput.value = memo.content;
        addBtn.textContent = '메모 수정';
        addBtn.classList.add('edit-mode');
        memoInput.focus();

        document.querySelector('.input-card').scrollIntoView({ behavior: 'smooth' });
    }

    function resetInput() {
        isEditing = false;
        currentEditId = null;
        memoInput.value = '';
        addBtn.textContent = '메모 추가';
        addBtn.classList.remove('edit-mode');
    }

    function saveMemos() {
        localStorage.setItem('memos', JSON.stringify(memos));
    }

    function renderMemos(filteredMemos = null) {
        let displayMemos = filteredMemos || memos;

        // Sort: Pinned first
        displayMemos = [...displayMemos].sort((a, b) => {
            if (a.isPinned === b.isPinned) return 0;
            return a.isPinned ? -1 : 1;
        });

        memoList.innerHTML = '';

        if (displayMemos.length === 0) {
            memoList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">메모가 없습니다.</p>';
            return;
        }

        displayMemos.forEach(memo => {
            const memoCard = document.createElement('div');
            memoCard.className = `memo-card ${memo.isPinned ? 'pinned' : ''}`;

            memoCard.innerHTML = `
                <div class="memo-content">${parseMarkdown(escapeHtml(memo.content))}</div>
                <div class="memo-footer">
                    <span class="memo-date">${memo.date}</span>
                    <div class="memo-actions">
                        <button class="action-btn pin-btn ${memo.isPinned ? 'active' : ''}" aria-label="메모 고정">${icons.pin}</button>
                        <button class="action-btn edit-btn" aria-label="메모 수정">${icons.edit}</button>
                        <button class="action-btn delete-btn" aria-label="메모 삭제">${icons.trash}</button>
                    </div>
                </div>
            `;

            const pinBtn = memoCard.querySelector('.pin-btn');
            pinBtn.addEventListener('click', () => togglePin(memo.id));

            const editBtn = memoCard.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => startEdit(memo.id));

            const deleteBtn = memoCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteMemo(memo.id));

            memoList.appendChild(memoCard);
        });
    }

    function filterMemos(query) {
        const searchTerm = query.toLowerCase();
        const filtered = memos.filter(memo =>
            memo.content.toLowerCase().includes(searchTerm)
        );
        renderMemos(filtered);
    }

    // --- Helper Functions ---

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parseMarkdown(text) {
        let html = text.replace(/\n/g, '<br>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/(?:^|<br>)&gt;\s(.*?)(?=<br>|$)/g, '<blockquote>$1</blockquote>');
        html = html.replace(/(?:^|<br>)-\s(.*?)(?=<br>|$)/g, '<br>• $1');
        return html;
    }

    function exportMemos() {
        if (memos.length === 0) {
            showToast('내보낼 메모가 없습니다.');
            return;
        }
        const dataStr = JSON.stringify(memos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `memos_backup_${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showToast('메모가 백업 파일로 저장되었습니다.');
    }

    function importMemos(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!Array.isArray(importedData)) {
                    throw new Error('잘못된 파일 형식');
                }

                // Merge avoiding duplicates (by ID)
                let importCount = 0;
                importedData.forEach(item => {
                    if (!memos.some(m => m.id === item.id)) {
                        memos.unshift(item);
                        importCount++;
                    }
                });

                saveMemos();
                renderMemos();
                showToast(`${importCount}개의 메모를 가져왔습니다.`);
            } catch (err) {
                showToast('파일을 읽는 중 오류가 발생했습니다.');
                console.error(err);
            }
            // Reset input so same file can be selected again if needed
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    // --- UX/UI Functions ---

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = icons.sun;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = icons.moon;
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? icons.sun : icons.moon;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});
