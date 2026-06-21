// هذا الكود يعمل على سيرفر Netlify لتأمين المفتاح الخاص بك
exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        // مفتاحك السري يتم سحبه من إعدادات Netlify بشكل آمن جداً
        const API_KEY = process.env.OPENCODE_API_KEY; 

        // الاتصال بنموذج الذكاء الاصطناعي (باستخدام معمارية متوافقة)
        const response = await fetch('https://api.opencode.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // قم بتغييره حسب النموذج المتاح لك في الموقع
                messages: [
                    {"role": "system", "content": "أنت مهندس برمجيات محترف ووكيل ذكي تقوم ببناء الأنظمة المعقدة."},
                    {"role": "user", "content": userMessage}
                ]
            })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process request' })
        };
    }
};