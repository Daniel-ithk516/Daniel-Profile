// 定義表單數據結構
interface ContactData {
    name: string;
    email: string;
    message: string;
    "form-name": string; // Netlify 需要這個隱藏欄位來識別表單
}

const handleContactSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    
    // 使用 FormData 提取數據
    const formData = new FormData(form);
    
    // 類型安全的數據對象
    const data: ContactData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
        "form-name": formData.get("form-name") as string
    };

    // 展示安全意識：簡單的客戶端編碼（僅作技術展示）
    // 在實際 HTTPS 環境下，這層編碼是額外的，但能防止日誌明文記錄
    const secureLog = btoa(encodeURIComponent(data.message));
    console.log("Payload Prepared (Base64 Encoded Message):", secureLog);

    try {
        // 透過 HTTPS 發送到 Netlify (當前頁面路徑)
        const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            // 將對象轉換為 URL 編碼格式
            body: new URLSearchParams(data as any).toString(),
        });

        if (response.ok) {
            alert("✅ Message sent securely via HTTPS!");
            form.reset();
        } else {
            throw new Error("Transmission failed");
        }
    } catch (error) {
        alert("❌ Error: " + (error as Error).message);
    }
};

// 綁定事件
document.querySelector("#contact-form")?.addEventListener("submit", handleContactSubmit);