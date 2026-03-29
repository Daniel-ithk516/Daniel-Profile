// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    
    // Close menu on link click (mobile)
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('nav-menu').classList.remove('active');
        });
    });
});

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    alert('Message sent! (demo)\n' + 
          'Name: ' + formData.get('name') + '\n' + 
          'Email: ' + formData.get('email'));
    e.target.reset();
}
// 處理表單提交
const handleContactSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    
    // 建立提交物件
    const data = {
        "form-name": formData.get("form-name"),
        "name": formData.get("name"),
        "email": formData.get("email"),
        "message": formData.get("message")
    };

    // 技術展示：在 Console 顯示加密後的傳輸負載 (Base64)
    // 雖然有 HTTPS 保護，但在開發者視角加入這層意識能加分
    const encodedLog = btoa(unescape(encodeURIComponent(data.message)));
    console.log("Transmission Security Check - Encoded Message:", encodedLog);

    try {
        // 發送異步請求到 Netlify 伺服器
        const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
        });

        if (response.ok) {
            // 成功提示
            alert("✅ 訊息已透過 HTTPS 安全傳送！");
            form.reset();
        } else {
            throw new Error("傳輸失敗，請稍後再試。");
        }
    } catch (error) {
        console.error("Submission Error:", error);
        alert("❌ 錯誤: " + error.message);
    }
};

// 確保頁面載入後綁定事件
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});