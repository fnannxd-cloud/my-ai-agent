exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        const API_KEY = process.env.OPENCODE_API_KEY; 

        if (!API_KEY) {
            console.error("خطأ: المفتاح السري غير موجود");
            return { statusCode: 500, body: JSON.stringify({ error: "API Key missing" }) };
        }

        // استخدام fetch العالمي المدمج في بيئة نتلايف Node.js
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

        if (!response.ok) {
            console.error("خطأ من الـ API:", JSON.stringify(data));
            return { statusCode: 500, body: JSON.stringify({ error: "API Error" }) };
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (error) {
        console.error("خطأ تقني:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
