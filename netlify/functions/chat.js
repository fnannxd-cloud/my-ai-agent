const fetch = require('node-fetch'); // تأكد من تثبيت هذه المكتبة في package.json

exports.handler = async function(event, context) {
    // 1. التأكد من أن الطلب من نوع POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        // 2. سحب المفتاح السري من إعدادات Netlify
        const API_KEY = process.env.OPENCODE_API_KEY; 

        if (!API_KEY) {
            console.error("خطأ: المفتاح السري غير موجود في إعدادات البيئة");
            throw new Error("API Key configuration error");
        }

        // 3. الاتصال بمزود الذكاء الاصطناعي
        const response = await fetch('https://api.opencode.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    {"role": "system", "content": "أنت مهندس برمجيات محترف ووكيل ذكي تقوم ببناء الأنظمة المعقدة."},
                    {"role": "user", "content": userMessage}
                ]
            })
        });

        const data = await response.json();

        // 4. فحص إذا كان هناك خطأ من الـ API نفسه
        if (!response.ok) {
            console.error("خطأ من الـ API:", data);
            throw new Error(data.error?.message || "فشل الاتصال بـ API");
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (error) {
        console.error("خطأ تقني داخل الـ Function:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
